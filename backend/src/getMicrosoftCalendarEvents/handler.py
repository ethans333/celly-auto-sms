import json
import os
import time
from datetime import datetime

import boto3
import requests
from jose import jwt


def handler(event, context):
    try:
        # get workspace id from path parameters
        workspace_id = event["pathParameters"]["workspace_id"]

        # get user id via the workspace_id (creator of the workspace)
        dynamodb = boto3.resource("dynamodb")
        table = dynamodb.Table(os.environ["WORKSPACESTABLE_TABLE_NAME"])

        user_id = table.get_item(Key={"id": workspace_id})["Item"]["user_id"]

        # Get Microsoft tokens from Secrets Manager
        secrets = boto3.client("secretsmanager")
        secret = secrets.get_secret_value(SecretId=user_id)

        # microsoft_tokens = { "access_token": access_token, "refresh_token": refresh_token }
        microsoft_tokens = json.loads(secret["SecretString"])["microsoft_tokens"]
        access_token = microsoft_tokens["access_token"]

        # decode to get payload
        expires_in = jwt.get_unverified_claims(access_token)["exp"]

        # check if token is expired
        is_expired = time.time() > expires_in
        if is_expired:
            raise Exception("Token is expired")

        # if token is valid then use microsoft graph api to get calendar events
        events_response = requests.get(  # events for the next week
            "https://graph.microsoft.com/v1.0/me/calendarview?startdatetime=2024-04-16T13:51:01.787Z&enddatetime=2024-04-23T13:51:01.787Z",
            headers={"Authorization": f"Bearer {access_token}"},
        ).json()["value"]

        def event_to_datetime(e):
            e = json.loads(e)
            date_format = "%Y-%m-%dT%H:%M:%S.%f"
            return {
                "start": datetime.strptime(e["start"]["dateTime"], date_format),
                "end": datetime.strptime(e["end"]["dateTime"], date_format),
            }

        events = list(
            map(
                event_to_datetime,
                events_response,
            )
        )

        # return calendar events
        return {
            "statusCode": 200,
            "body": json.dumps({"events": str(events)}),
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
