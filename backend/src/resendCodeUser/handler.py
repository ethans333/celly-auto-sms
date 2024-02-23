import json
import os

import boto3


def handler(event, context):
    user_pool_client_id = os.environ.get("USERPOOLCLIENT_USER_POOL_CLIENT_ID")
    body = json.loads(event["body"])

    client = boto3.client("cognito-idp")

    try:
        response = client.initiate_auth(
            AuthFlow="USER_PASSWORD_AUTH",
            AuthParameters={
                "USERNAME": body["email"].lower(),
                "PASSWORD": body["password"],
            },
            ClientId=user_pool_client_id,
        )
        return response
    except client.exceptions.UserNotFoundException:
        return "User not found"
    except client.exceptions.NotAuthorizedException:
        return "Invalid password"
    except client.exceptions.UserNotConfirmedException:
        return "User not confirmed"
    except Exception as e:
        return str(e)
