import json

import boto3


def handler(event, context):
    access_token = event["headers"]["Authorization"]
    client = boto3.client("cognito-idp")

    try:
        # update user attributes
        client.update_user_attributes(
            UserAttributes=[
                {
                    "Name": "custom:show_demo",
                    "Value": "false",
                }
            ],
            AccessToken=access_token,
        )

        return {
            "statusCode": 200,
            "body": "User demo attreibute updated successfully",
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
