import json
import os

import boto3


# meeting confirmation via api call orginating from email
def handler(event, context):
    try:
        meeting_id = event["pathParameters"]["id"]
        confirmation_token = event["pathParameters"]["token"]

        ddb = boto3.resource("dynamodb")
        table = ddb.Table(os.environ["SCHEDULEDMEETINGSTABLE_TABLE_NAME"])

        meeting = table.get_item(Key={"id": meeting_id})

        if "Item" not in meeting:
            raise Exception("Meeting not found")
        elif meeting["Item"]["confirmation_token"] == confirmation_token:
            raise Exception("Meeting already confirmed")

        # update the number of confirmations confirmed by the user
        table.update_item(
            Key={"id": meeting_id},
            UpdateExpression="SET confirmations_confirmed = confirmations_confirmed + :val, confirmation_token = :token",
            ExpressionAttributeValues={
                ":val": 1,
                ":token": confirmation_token,
            },
        )

        return {
            "statusCode": 200,
            "body": json.dumps(
                {
                    "message": "Meeting confirmed.",
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
