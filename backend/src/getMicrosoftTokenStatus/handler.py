import json
import time

import boto3
from jose import jwt


def handler(event, context):
    try:
        # Get user id from cognito access token
        cognito_access_token = event["headers"]["Authorization"]
        user_id = jwt.get_unverified_claims(cognito_access_token)["sub"]

        # Get Microsoft tokens from Secrets Manager
        secrets = boto3.client("secretsmanager")
        secret = secrets.get_secret_value(SecretId=user_id)

        # microsoft_tokens = { "access_token": access_token, "refresh_token": refresh_token }
        secret_dict = json.loads(secret["SecretString"])

        if "microsoft_tokens" not in secret_dict:
            raise Exception("Microsoft tokens not found in secret")

        microsoft_tokens = secret_dict["microsoft_tokens"]
        access_token = microsoft_tokens["access_token"]

        # decode to get payload
        expires_in = jwt.get_unverified_claims(access_token)["exp"]

        # check if token is expired
        is_expired = time.time() > expires_in

        if is_expired:
            secrets.rotate_secret(SecretId=user_id)

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
