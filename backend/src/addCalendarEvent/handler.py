import json
import os
import sys
import uuid
from datetime import datetime

import boto3
import pytz
import requests
from jose import jwt


def handler(event, context):
    try:
        # get parameters
        body = json.loads(event["body"])
        user_id = body["user_id"]
        workspace_id = event["pathParameters"]["id"]

        bucket = boto3.resource("s3").Bucket(os.environ["WORKSPACESBUCKET_BUCKET_NAME"])
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
        now = datetime.now()
        is_expired = int(now.timestamp()) > expires_in
        if is_expired:
            secrets.rotate_secret(SecretId=user_id)

        # add event times to microsoft graph calendar
        # if token is valid then use microsoft graph api to get calendar events
        start_time = datetime.fromtimestamp(float(body["start_time"]) / 1000).strftime(
            "%Y-%m-%dT%H:%M:%S.%f"
        )
        end_time = datetime.fromtimestamp(float(body["end_time"]) / 1000).strftime(
            "%Y-%m-%dT%H:%M:%S.%f"
        )

        workspace_name = metadata["workspace_name"]
        meeting_name = body["meeting_name"]

        if meeting_name == "":
            meeting_name = "Your meeting"

        events_response = requests.post(  # events for the next week
            f"https://graph.microsoft.com/v1.0/me/calendar/events",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
            },
            data=json.dumps(
                {
                    "subject": f"{meeting_name}",
                    "body": {
                        "contentType": "HTML",
                        "content": f"{meeting_name}. Scheduled via Intwine.",
                    },
                    "start": {
                        "dateTime": start_time,
                        "timeZone": body["timezone"],
                    },
                    "end": {
                        "dateTime": end_time,
                        "timeZone": body["timezone"],
                    },
                    "location": {"displayName": "Over the Phone"},
                    "attendees": [
                        # {
                        #     "emailAddress": {
                        #         "address": "jdoe@contoso.com",
                        #         "name": "John Doe",
                        #     },
                        #     "type": "required",
                        # }
                    ],
                }
            ),
        ).json()

        # convert start and end times to utc
        start_time_utc = convert_to_utc(body["start_time"], body["timezone"])
        end_time_utc = convert_to_utc(body["end_time"], body["timezone"])

        # notify client of appointment
        if body["contact_method"] == "Email":
            email = body["contact_value"]
            html = get_schedule_email(body["start_time"], meeting_name)
            send_email(email, html)
        elif body["contact_method"] == "Phone":
            message = get_schedule_text(body["start_time"], meeting_name)
            send_text(body["contact_value"], message)
        elif body["contact_method"] == "Phone & Email":
            phone = body["contact_value"]
            email = body["second_contact_value"]

            # send text
            message = get_schedule_text(body["start_time"], meeting_name)
            send_text(phone, message)

            # send email
            html = get_schedule_email(body["start_time"], meeting_name)
            send_email(email, html)

        # add scheduled event to scheduled table.
        ddb = boto3.client("dynamodb")

        ddb.put_item(
            TableName=os.environ["SCHEDULEDMEETINGSTABLE_TABLE_NAME"],
            Item={
                "id": {"S": uuid.uuid4().hex},
                "user_id": {"S": user_id},
                "workspace_id": {"S": workspace_id},
                "workspace_name": {"S": workspace_name},
                "meeting_name": {"S": body["meeting_name"]},
                "event_id": {"S": events_response["id"]},
                "start_time": {"N": str(start_time_utc)},
                "end_time": {"N": str(end_time_utc)},
                "contact_method": {"S": body["contact_method"]},
                "contact_value": {"S": body["contact_value"]},
                "confirmations_confirmed": {"N": "0"},
                "confirmations_sent": {"N": "0"},
                "outbound_contact_value": {"S": metadata["contact"]},
                "latest_message_id": {"S": ""},
                "timezone": {"S": body["timezone"]},
            },
        )

        return {
            "statusCode": 200,
            "body": json.dumps(
                {
                    "message": f"Event booked successfully",
                    "events": events_response,
                }
            ),
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "*",
            },
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps(
                {
                    "error": str(e),
                    "traceback": f"ERROR: line {sys.exc_info()[-1].tb_lineno}, {str(e)}",
                }
            ),
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "*",
            },
        }


def send_text(phone, message):
    pinpoint = boto3.client("pinpoint-sms-voice-v2")

    # get sender_id
    phone_nums = pinpoint.describe_phone_numbers()

    if len(phone_nums["PhoneNumbers"]) == 0:
        raise Exception(
            "No phone numbers found. You need to register a phone number in pinpoint."
        )

    originator_id = phone_nums["PhoneNumbers"][0]["PhoneNumberId"]

    pinpoint.send_text_message(
        DestinationPhoneNumber=f"+1{phone}",
        OriginationIdentity=originator_id,
        MessageBody=message,
        MessageType="TRANSACTIONAL",
    )


def send_email(email, html):
    ses = boto3.client("ses")

    ses.send_email(
        Source="no-reply@intwine.app",
        Destination={
            "ToAddresses": [email],
        },
        Message={
            "Subject": {
                "Data": "Meeting Reminder - Intwine",
            },
            "Body": {
                "Html": {
                    "Data": html,
                },
            },
        },
    )


def get_schedule_text(time, meeting_name="Your meeting"):
    day_of_week = datetime.fromtimestamp(float(time) / 1000).strftime("%A")
    month_day = datetime.fromtimestamp(float(time) / 1000).strftime("%B %-d")
    t = datetime.fromtimestamp(float(time) / 1000).strftime("%-I:%M %p")
    return f"{meeting_name} is scheduled for {day_of_week}, {month_day} at {t}"


def get_schedule_email(time, meeting_name="Your meeting"):
    day_of_week = datetime.fromtimestamp(float(time) / 1000).strftime("%A")
    month_day = datetime.fromtimestamp(float(time) / 1000).strftime("%B %-d")
    t = datetime.fromtimestamp(float(time) / 1000).strftime("%-I:%M %p")

    return f"""
        <html>
    <body>
    <p>
        {meeting_name} is scheduled for {day_of_week}, {month_day} at {t}.
    </p>
    </body>
    </html>
    """


def convert_to_utc(unix_timestamp, timezone_str):
    """
    unix_timestamp: int, in milliseconds
    timezone_str: string, e.g. "America/New_York"

    returns: int, in milliseconds
    """
    # Create a timezone object from the provided timezone string
    local_timezone = pytz.timezone(timezone_str)

    # Convert the Unix timestamp to a naive datetime object
    naive_datetime = datetime.fromtimestamp(float(unix_timestamp / 1000))

    # Localize the naive datetime to the provided timezone
    local_datetime = local_timezone.localize(naive_datetime)

    # Convert the localized datetime to UTC
    utc_datetime = local_datetime.astimezone(pytz.utc)

    # Convert the UTC datetime to a Unix timestamp in milliseconds
    utc_timestamp = int(utc_datetime.timestamp()) * 1000

    return utc_timestamp
