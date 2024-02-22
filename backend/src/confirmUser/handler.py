import json
import os

import boto3


def handler(event, context):
    user_pool_client_id = os.environ.get("USERPOOLCLIENT_USER_POOL_CLIENT_ID")
    body = json.loads(event["body"])

    client = boto3.client("cognito-idp")

    try:
        client.sign_up(
            ClientId=user_pool_client_id,
            Username=body["email"],
            ConfirmationCode=body["code"],
        )
        return "User confirmed successfully"
    except client.exceptions.CodeMismatchException:
        return "Invalid code"
    except client.exceptions.ExpiredCodeException:
        return "Code expired"
    except client.exceptions.UserNotFoundException:
        return "User not found"
    except Exception as e:
        return str(e)
