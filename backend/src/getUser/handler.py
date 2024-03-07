import json

import boto3


def handler(event, context):
    access_token = event["headers"]["Authorization"]
    client = boto3.client("cognito-idp")

    try:
        response = client.get_user(AccessToken=access_token)
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
    except client.exceptions.NotAuthorizedException:
        return {
            "statusCode": 401,
            "body": "Not authorized",
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "*",
                "Content-Type": "application/json",
            },
        }
    except client.exceptions.UserNotFoundException:
        return {
            "statusCode": 404,
            "body": "User not found",
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "*",
                "Content-Type": "application/json",
            },
        }
    except client.exceptions.InvalidParameterException:
        return {
            "statusCode": 400,
            "body": "Invalid parameter",
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "*",
                "Content-Type": "application/json",
            },
        }
    except client.exceptions.TooManyRequestsException:
        return {
            "statusCode": 429,
            "body": "Too many requests",
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
