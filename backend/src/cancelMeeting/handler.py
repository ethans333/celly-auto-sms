import decimal
import json
import os

import boto3


def handler(event, context):
    try:
        meeting_id = event["pathParameters"]["id"]

        ddb = boto3.resource("dynamodb")
        table = ddb.Table(os.environ["SCHEDULEDMEETINGSTABLE_TABLE_NAME"])
        meeting = table.get_item(Key={"id": meeting_id})["Item"]

        response = cancel_meeting(meeting)

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


def cancel_meeting(meeting):
    lambda_client = boto3.client("lambda")

    # Cancel meetings
    lambda_client.invoke(
        FunctionName=os.environ["CANCELSCHEDULEDMEETINGS_FUNCTION_NAME"],
        InvocationType="RequestResponse",
        Payload=bytes(
            json.dumps(
                {
                    "body": {"meetings": [meeting]},
                    "user_id": meeting["user_id"],
                },
                cls=DecimalEncoder,
            ),
            encoding="utf8",
        ),
    )


# decimal encoder for calling json.dumps. Used when given there exists a variable of type decimal
class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            return str(o)
        return super().default(o)
