import json
import os

import boto3


def handler(event, context):
    try:
        workspace_id = event["pathParameters"]["id"]

        # from workspace_id, get user_id
        # from user_id, get access_token
        # using msal get calendar events from Microsoft Graph API
        # return an array of datetimes representing exsiting calendar events

    except Exception as e:
        return {"statusCode": 500, "body": str(e)}

    return {
        "statusCode": 200,
        "body": json.dumps(
            {
                "calendar_events": [],
            }
        ),
    }


# Use this code snippet in your app.
# If you need more information about configurations
# or implementing the sample code, visit the AWS docs:
# https://aws.amazon.com/developer/language/python/

import boto3
from botocore.exceptions import ClientError


def get_secret():

    secret_name = "ethans_super_secret_key"
    region_name = "us-east-1"

    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(service_name="secretsmanager", region_name=region_name)

    try:
        get_secret_value_response = client.get_secret_value(SecretId=secret_name)
    except ClientError as e:
        # For a list of exceptions thrown, see
        # https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
        raise e

    secret = get_secret_value_response["SecretString"]

    return secret
