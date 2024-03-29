import json
import os

import boto3


def handler(event, context):
    user_pool_client_id = os.environ.get("USERPOOLCLIENT_USER_POOL_CLIENT_ID")
    body = json.loads(event["body"])

    client = boto3.client("cognito-idp")
    # lex = boto3.client("lexv2-models")

    try:
        # create user in cognito
        response = client.sign_up(
            ClientId=user_pool_client_id,
            Username=body["email"],
            Password=body["password"],
        )

        user_id = response["UserSub"]

        # # create user's lex bot alias
        # lex.create_bot_alias(
        #     botId=os.environ["BOT_ID"],
        #     botAliasId=user_id,
        # )

        return {
            "statusCode": 200,
            "body": json.dumps(response),
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "*",
                "Content-Type": "application/json",
            },
        }
    except client.exceptions.UsernameExistsException:
        return {
            "statusCode": 400,
            "body": "Email already exists",
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "*",
                "Content-Type": "application/json",
            },
        }
    except client.exceptions.InvalidPasswordException:
        return {
            "statusCode": 400,
            "body": "Invalid password",
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
