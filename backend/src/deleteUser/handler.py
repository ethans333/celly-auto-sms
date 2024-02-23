import boto3


def handler(event, context):
    access_token = event["headers"]["Authorization"]
    client = boto3.client("cognito-idp")

    try:
        client.delete_user(AccessToken=access_token)
        return {"statusCode": 200, "body": "User deleted successfully"}
    except client.exceptions.NotAuthorizedException:
        return {"statusCode": 401, "body": "Not authorized"}
    except client.exceptions.UserNotFoundException:
        return {"statusCode": 400, "body": "User not found"}
    except Exception as e:
        return {
            "statusCode": 500,
            "body": str(e),
        }
