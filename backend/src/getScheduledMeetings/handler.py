import json
import os

import boto3


def handler(event, context):

    try:
        ddb = boto3.resource("dynamodb")
        table = ddb.Table(os.environ["SCHEDULEDMEETINGSTABLE_TABLE_NAME"])

        # get user id from access token
        client = boto3.client("cognito-idp")
        access_token = event["headers"]["Authorization"]
        user_id = client.get_user(AccessToken=access_token)["Username"]

        response = table.scan(
            FilterExpression="user_id = :user_id",
            ExpressionAttributeValues={":user_id": user_id},
        )

        # convert decimal times to time string
        for meeting in response["Items"]:
            meeting["start_time"] = str(meeting["start_time"])
            meeting["end_time"] = str(meeting["end_time"])

        return {
            "statusCode": 200,
            "body": json.dumps(
                {
                    "meetings": response["Items"],
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
