import json
import os
import sys

import boto3


def handler(event, context):
    try:
        workspace_id = event["pathParameters"]["id"]
        ddb = boto3.resource("dynamodb")
        table = ddb.Table(os.environ["SCHEDULEDMEETINGSTABLE_TABLE_NAME"])

        # get user id from access token
        client = boto3.client("cognito-idp")
        access_token = event["headers"]["Authorization"]
        user_id = client.get_user(AccessToken=access_token)["Username"]

        response = table.scan(
            FilterExpression="user_id = :user_id AND workspace_id = :workspace_id",
            ExpressionAttributeValues={
                ":user_id": user_id,
                ":workspace_id": workspace_id,
            },
        )

        # convert decimal values to strings for json serialization
        for meeting in response["Items"]:
            for key in meeting.keys():
                meeting[key] = str(meeting[key])

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
            "body": f"ERROR: line {sys.exc_info()[-1].tb_lineno}, {str(e)}",
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "*",
                "Content-Type": "application/json",
            },
        }
