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
        return {
            "statusCode": 200,
            "body": json.dumps(response),
        }
    except client.exceptions.UserNotFoundException:
        return {
            "statusCode": 404,
            "body": "User not found",
        }
    except client.exceptions.NotAuthorizedException:
        return {
            "statusCode": 401,
            "body": "Invalid password",
        }
    except client.exceptions.UserNotConfirmedException:
        return {
            "statusCode": 409,
            "body": "User not confirmed",
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": str(e),
        }
