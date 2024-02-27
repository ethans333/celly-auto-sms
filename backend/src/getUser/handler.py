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
        }
    except client.exceptions.NotAuthorizedException:
        return {
            "statusCode": 401,
            "body": "Not authorized",
        }
    except client.exceptions.UserNotFoundException:
        return {
            "statusCode": 404,
            "body": "User not found",
        }
    except client.exceptions.InvalidParameterException:
        return {
            "statusCode": 400,
            "body": "Invalid parameter",
        }
    except client.exceptions.TooManyRequestsException:
        return {
            "statusCode": 429,
            "body": "Too many requests",
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": str(e),
        }
