import json
import os
import sys
from datetime import datetime

import boto3
import requests
from jose import jwt


def handler(event, context):
    try:
        # read booked event as date time from event body
        # contact_method
        # contact_value
        # start_time
        # end_time

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

        events_response = requests.post(  # events for the next week
            f"https://graph.microsoft.com/v1.0/me/calendar/events",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
            },
            data=json.dumps(
                {
                    "subject": f"{workspace_name} meeting",
                    "body": {
                        "contentType": "HTML",
                        "content": f"{workspace_name} meeting. Scheduled via Celly.",
                    },
                    "start": {
                        "dateTime": start_time,
                        "timeZone": "Pacific Standard Time",
                    },
                    "end": {
                        "dateTime": end_time,
                        "timeZone": "Pacific Standard Time",
                    },
                    "location": {"displayName": "Online Meeting"},
                    "attendees": [
                        {
                            "emailAddress": {
                                "address": "jdoe@contoso.com",
                                "name": "John Doe",
                            },
                            "type": "required",
                        }
                    ],
                }
            ),
        ).json()

        # notify client of appointment
        if body["contact_method"] == "Email":
            email = body["contact_value"]
            print("email")
        elif body["contact_method"] == "Phone":
            day_of_week = datetime.fromtimestamp(
                float(body["start_time"]) / 1000
            ).strftime("%A")
            month_day = datetime.fromtimestamp(
                float(body["start_time"]) / 1000
            ).strftime("%B %-d")
            time = datetime.fromtimestamp(float(body["start_time"]) / 1000).strftime(
                "%-I:%M %p"
            )
            message = f"{workspace_name} is scheduled for {day_of_week}, {month_day} at {time}"

            send_text(body["contact_value"], message)

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
        print()
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
