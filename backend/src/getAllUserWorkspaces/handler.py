import json
import os

import boto3


def handler(event, context):
    try:
        dynamodb = boto3.resource("dynamodb")

        table = dynamodb.Table(os.environ["WORKSPACESTABLE_TABLE_NAME"])
        client = boto3.client("cognito-idp")

        # get user id from access token
        access_token = event["headers"]["Authorization"]
        user_id = client.get_user(AccessToken=access_token)["Username"]

        # Get workspaces from table
        workspaces = table.scan(
            FilterExpression=boto3.dynamodb.conditions.Attr("user_id").eq(user_id)
        )["Items"]
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
                "workspaces": workspaces,
            },
        ),
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*",
            "Content-Type": "application/json",
        },
    }
