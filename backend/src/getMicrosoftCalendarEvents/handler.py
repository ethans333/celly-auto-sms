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

        # check if token is expired & then refresh it
        is_expired = time.time() > expires_in
        if is_expired:
            secrets.rotate_secret(SecretId=user_id)

        # if token is valid then use microsoft graph api to get calendar events
        events_response = requests.get(  # events for the next week
            "https://graph.microsoft.com/v1.0/me/calendarview?startdatetime=2024-04-16T13:51:01.787Z&enddatetime=2024-04-23T13:51:01.787Z",
            headers={"Authorization": f"Bearer {access_token}"},
        ).json()["value"]

        event_times = []

        for event in events_response:
            start_ms, end_ms = convert_time_to_milliseconds(
                event["start"], event["end"]
            )
            event_times.append({"start": start_ms, "end": end_ms})

        return {
            "statusCode": 200,
            "body": json.dumps({"events": event_times}),
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


def datetime_to_milliseconds(datetime_str):
    datetime_str = datetime_str.split(".")[0]
    dt_object = datetime.strptime(datetime_str, "%Y-%m-%dT%H:%M:%S")

    # Convert datetime object to milliseconds since the epoch
    milliseconds = int(dt_object.timestamp() * 1000)
    return milliseconds


def convert_time_to_milliseconds(start_time, end_time):
    start_ms = datetime_to_milliseconds(start_time["dateTime"])
    end_ms = datetime_to_milliseconds(end_time["dateTime"])
    return start_ms, end_ms
