import json
import os

import boto3
import jwt

# originator_id = "phone-f39b9491484e41f4aeb11a163419e5e9"


def handler(event, context):
    workspace_id = event["pathParameters"]["id"]

    # access_token = event["headers"]["Authorization"]
    # user_id = jwt.decode(access_token, options={"verify_signature": False})["sub"]

    dynamodb = boto3.resource("dynamodb")
    # s3 = boto3.resource("s3")
    # pinpoint = boto3.client("pinpoint-sms-voice-v2")

    # bucket = s3.Bucket(os.environ["WORKSPACESBUCKET_BUCKET_NAME"])
    table = dynamodb.Table(os.environ["WORKSPACESTABLE_TABLE_NAME"])

    try:
        # Update is_deployed status to true
        table.update_item(
            Key={"id": workspace_id},
            UpdateExpression="SET is_deployed = :dp",
            ExpressionAttributeValues={
                ":dp": True,
            },
        )

        # # Get workspace from bucket
        # bucket_object = bucket.Object(f"{user_id}/{workspace_id}")
        # workspace_raw = bucket_object.get()["Body"].read().decode("utf-8")

        # # Deploy workspace to bucket using pinpoint
        # pinpoint.send_text_message(
        #     DestinationPhoneNumber="+14079237031",
        #     OrginatorIdentity=originator_id,
        #     MessageBody="Hello there this is your friend Ethan!",
        #     MessageType="PROMOTIONAL",
        # )

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
                "message": f"workspace deployed successfully",
                "workspace_id": workspace_id,
            },
        ),
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*",
            "Content-Type": "application/json",
        },
    }
