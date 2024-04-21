import json

import boto3
import jwt


def handler(event, context):
    try:
        # Get user id from cognito access token
        cognito_access_token = event["headers"]["Authorization"]
        user_id = jwt.decode(cognito_access_token, options={"verify_signature": False})[
            "sub"
        ]

        secrets = boto3.client("secretsmanager")

        secrets.update_secret(SecretId=user_id, SecretString="{}")

        return {
            "statusCode": 200,
            "body": json.dumps(
                {
                    "message": "Unlinked successfully",
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
