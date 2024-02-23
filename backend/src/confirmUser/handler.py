import json
import os

import boto3


def handler(event, context):
    user_pool_client_id = os.environ.get("USERPOOLCLIENT_USER_POOL_CLIENT_ID")
    body = json.loads(event["body"])

    client = boto3.client("cognito-idp")

    try:
        client.confirm_sign_up(
            ClientId=user_pool_client_id,
            Username=body["email"],
            ConfirmationCode=body["code"],
        )
        return {
            "statusCode": 200,
            "body": json.dumps({"message": "User confirmed"}),
        }
    except client.exceptions.CodeMismatchException:
        return {
            "statusCode": 400,
            "body": "Invalid code",
        }
    except client.exceptions.ExpiredCodeException:
        return {
            "statusCode": 400,
            "body": "Code expired",
        }
    except client.exceptions.UserNotFoundException:
        return {
            "statusCode": 400,
            "body": "User not found",
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": str(e),
        }
