import json
import os
import sys
import time
from datetime import datetime, timedelta

import boto3
import requests
from jose import jwt


def handler(event, context):
    try:
        # get path parameters
        user_id = event["pathParameters"]["user_id"]
        workspace_id = event["pathParameters"]["workspace_id"]

        bucket = boto3.resource("s3").Bucket(os.environ["WORKSPACESBUCKET_BUCKET_NAME"])

        # get cells from bucket
        bucket_raw = (
            bucket.Object(f"{user_id}/{workspace_id}")
            .get()["Body"]
            .read()
            .decode("utf-8")
        )

        bucket_raw = json.loads(bucket_raw)

        # find calendar cell
        calendar_cell = None

        for cell in bucket_raw:
            if cell["typename"] in ["calendar", "windowscheduling"]:
                calendar_cell = cell
                break

        if not calendar_cell:
            raise Exception("Calendar cell not found")

        # get workspace metadata
        metadata = bucket.Object(f"{user_id}/{workspace_id}").metadata

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
        today = datetime.today()
        delta_start = today - timedelta(days=1)
        delta_end = today + timedelta(days=60)
        start_datetime = delta_start.strftime("%Y-%m-%dT%H:%M:%S.%f")
        end_datetime = delta_end.strftime("%Y-%m-%dT%H:%M:%S.%f")

        events_response = requests.get(  # events for the next week
            f"https://graph.microsoft.com/v1.0/me/calendarview?startdatetime={start_datetime}&enddatetime={end_datetime}",
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
            "body": json.dumps(
                {
                    "blackout_days": calendar_cell["blackout_days"],
                    "start_time": calendar_cell["start_time"],
                    "end_time": calendar_cell["end_time"],
                    "meeting_description": calendar_cell["meeting_description"],
                    "workspace": metadata,
                    "events": event_times,
                    "meeting_title": calendar_cell["meeting_title"],
                    "meeting_length": calendar_cell["meeting_length"],
                }
            ),
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
            "body": f"Error on line {sys.exc_info()[2].tb_lineno}: {str(e)}",
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
