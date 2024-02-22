import boto3


def handler(event, context):
    access_token = event["headers"]["Authorization"]
    client = boto3.client("cognito-idp")

    try:
        client.delete_user(AccessToken=access_token)
        return "User has been delete successfully"
    except client.exceptions.NotAuthorizedException:
        return "Invalid access token"
    except client.exceptions.UserNotFoundException:
        return "User not found"
    except Exception as e:
        return str(e)
