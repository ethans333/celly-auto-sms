import json
import time

import boto3
import jwt


def handler(event, context):
    try:
        # Get user id from cognito access token
        cognito_access_token = event["headers"]["Authorization"]
        user_id = jwt.decode(cognito_access_token, options={"verify_signature": False})[
            "sub"
        ]

        # Get Microsoft tokens from Secrets Manager
        secrets = boto3.client("secretsmanager")
        secret = secrets.get_secret_value(SecretId=user_id)

        #   microsoft_tokens = { "access_token": access_token, "refresh_token": refresh_token }
        microsoft_tokens = json.loads(secret["SecretString"])["microsoft_tokens"]
        access_token = microsoft_tokens["access_token"]

        # decode to get payload
        expires_in = jwt.decode(access_token, options={"verify_signature": False})[
            "exp"
        ]

        # check if token is expired
        is_expired = time.time() > expires_in

        return {
            "statusCode": 200,
            "body": json.dumps({"is_expired": is_expired}),
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
