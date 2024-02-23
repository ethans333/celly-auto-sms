import json
import os

import boto3


def handler(event, context):
    user_pool_client_id = os.environ.get("USERPOOLCLIENT_USER_POOL_CLIENT_ID")
    body = json.loads(event["body"])

    client = boto3.client("cognito-idp")

    try:
        response = client.resend_confirmation_code(
            ClientId=user_pool_client_id,
            Username=body["email"],
        )
        return {
            "statusCode": 200,
            "body": json.dumps(response),
        }
    except client.exceptions.UserNotFoundException:
        return {
            "statusCode": 404,
            "body": "User not found",
        }
    except client.TooManyRequestsException:
        return {
            "statusCode": 429,
            "body": "Too many requests",
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": str(e),
        }
