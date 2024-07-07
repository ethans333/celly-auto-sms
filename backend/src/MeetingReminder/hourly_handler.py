import json
import os
import time
from datetime import datetime

import boto3
import pytz
from boto3.dynamodb.conditions import Attr


def handler(event, context):
    ddb = boto3.resource("dynamodb")
    table = ddb.Table(os.environ["SCHEDULEDMEETINGSTABLE_TABLE_NAME"])

    now = int(datetime.now(pytz.timezone("US/Eastern")).timestamp()) * 1000
    meetings = table.scan(
        FilterExpression=Attr("end_time").gt(now)
        & Attr("end_time").lt(now + 60 * 60 * 1000),
    )[
        "Items"
    ]  # between now and one hour from now

    for meeting in meetings:
        if meeting["contact_method"] == "Email":
            send_email(
                meeting["contact_value"], meeting_reminder_email(meeting["start_time"])
            )
        elif meeting["contact_method"] == "Phone":
            send_text(
                meeting["contact_value"], meeting_reminder_text(meeting["start_time"])
            )
        elif meeting["contact_method"] == "Phone & Email":
            send_email(
                meeting["contact_value"], meeting_reminder_email(meeting["start_time"])
            )
            send_text(
                meeting["contact_value"], meeting_reminder_text(meeting["start_time"])
            )

    return {
        "reminders_sent": len(meetings),
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
                "Data": "Meeting Reminder",
            },
            "Body": {
                "Html": {
                    "Data": html,
                },
            },
        },
    )


def meeting_reminder_email(start_time):
    t = datetime.fromtimestamp(float(start_time) / 1000)
    return f"""
    <html>
    <body>
    <p>
        Just a reminder than your meeting starts in less than an hour! ({t.date()} at {t.time()}).
    </p>
    </body>
    </html>
    """


def meeting_reminder_text(start_time):
    t = datetime.fromtimestamp(float(start_time) / 1000)
    return f"Just a reminder than your meeting starts in less than an hour! ({t.date()} at {t.time()}) ⌛"
