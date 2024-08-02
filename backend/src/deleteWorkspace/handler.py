import decimal
import json
import os

import boto3
import jwt


def handler(event, context):
    try:
        workspace_id = event["pathParameters"]["id"]

        # bucket
        s3 = boto3.resource("s3")
        bucket = s3.Bucket(os.environ["WORKSPACESBUCKET_BUCKET_NAME"])

        # table
        ddb = boto3.resource("dynamodb")
        table = ddb.Table(os.environ["SCHEDULEDMEETINGSTABLE_TABLE_NAME"])

        # lambda
        lambda_client = boto3.client("lambda")

        access_token = event["headers"]["Authorization"]
        user_id = jwt.decode(access_token, options={"verify_signature": False})["sub"]

        # Get all meeting ids related to workspace
        meetings_to_cancel = table.scan(
            FilterExpression="user_id = :user_id AND workspace_id = :workspace_id",
            ExpressionAttributeValues={
                ":user_id": user_id,
                ":workspace_id": workspace_id,
            },
        )["Items"]

        # Cancel meetings
        response = lambda_client.invoke(
            FunctionName=os.environ["CANCELSCHEDULEDMEETINGS_FUNCTION_NAME"],
            InvocationType="RequestResponse",
            Payload=bytes(
                json.dumps(
                    {
                        "body": {"meetings": meetings_to_cancel},
                        "headers": {"Authorization": access_token},
                    },
                    cls=DecimalEncoder,
                ),
                encoding="utf8",
            ),
        )

        # Delete workspace from bucket
        bucket.delete_objects(
            Delete={"Objects": [{"Key": f"{user_id}/{workspace_id}"}]}
        )
    except Exception as e:
        return {
            "statusCode": 500,
            "body": str(e),
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "*",
                "Content-Type": "application/json",
            },
        }

    return {
        "statusCode": 200,
        "body": json.dumps(
            {
                "message": str(response["Payload"].read().decode("utf8")),
            }
        ),
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*",
            "Content-Type": "application/json",
        },
    }


# decimal encoder for calling json.dumps. Used when given there exists a variable of type decimal
class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            return str(o)
        return super().default(o)
