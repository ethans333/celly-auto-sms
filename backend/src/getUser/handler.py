import boto3


def handler(event, context):
    access_token = event["headers"]["Authorization"]
    client = boto3.client("cognito-idp")

    try:
        response = client.get_user(AccessToken=access_token)
        return response
    except client.exceptions.NotAuthorizedException:
        return "Invalid access token"
    except client.exceptions.UserNotFoundException:
        return "User not found"
    except Exception as e:
        return str(e)
