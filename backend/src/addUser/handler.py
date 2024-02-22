import json
import os

import boto3


def handler(event, context):
    user_pool_client_id = os.environ.get("USERPOOLCLIENT_USER_POOL_CLIENT_ID")
    body = json.loads(event["body"])

    client = boto3.client("cognito-idp")

    try:
        response = client.sign_up(
            ClientId=user_pool_client_id,
            Username=body["email"],
            Password=body["password"],
        )
        return response
    except client.exceptions.UsernameExistsException:
        return "User already exists"
    except client.exceptions.InvalidPasswordException:
        return "Invalid password"
    except Exception as e:
        return str(e)
