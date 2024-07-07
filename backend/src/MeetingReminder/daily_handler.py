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

    meetings = table.scan(
        FilterExpression=Attr("end_time").gt(
            int(datetime.now(pytz.timezone("US/Eastern")).timestamp()) * 1000
        ),
    )["Items"]

    for meeting in meetings:
        email = meeting_reminder_email(
            meeting["start_time"],
            meeting["meeting_name"],
            meeting["outbound_contact_value"],
        )
        text = meeting_reminder_text(
            meeting["start_time"],
            meeting["meeting_name"],
            meeting["outbound_contact_value"],
        )

        if meeting["contact_method"] == "Email":
            # send reminder via email
            send_email(meeting["contact_value"], email)
        elif meeting["contact_method"] == "Phone":
            # send reminder via phone
            send_text(meeting["contact_value"], text, meeting["meeting_id"])
        elif meeting["contact_method"] == "Phone & Email":
            # send reminder via email and phone
            send_email(meeting["contact_value"], email)
            send_text(meeting["contact_value"], text, meeting["meeting_id"])
    return {
        "reminders_sent": len(meetings),
    }


def send_text(phone, message, meeting_id):
    pinpoint = boto3.client("pinpoint-sms-voice-v2")

    # get sender_id
    phone_nums = pinpoint.describe_phone_numbers()

    if len(phone_nums["PhoneNumbers"]) == 0:
        raise Exception(
            "No phone numbers found. You need to register a phone number in pinpoint."
        )

    originator_id = phone_nums["PhoneNumbers"][0]["PhoneNumberId"]

    response = pinpoint.send_text_message(
        DestinationPhoneNumber=f"+1{phone}",
        OriginationIdentity=originator_id,
        MessageBody=message,
        MessageType="TRANSACTIONAL",
    )

    # update latest message id
    table = boto3.resource("dynamodb").Table(
        os.environ["SCHEDULEDMEETINGSTABLE_TABLE_NAME"]
    )
    table.update_item(
        Key={"id": meeting_id},
        UpdateExpression="SET latest_message_id = :val",
        ExpressionAttributeValues={":val": response["MessageId"]},
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


def meeting_reminder_email(time, meeting_name, outbound_contact):
    if meeting_name == "":
        meeting_name = "your meeting"

    day_of_week = datetime.fromtimestamp(float(time) / 1000).strftime("%A")
    month_day = datetime.fromtimestamp(float(time) / 1000).strftime("%B %-d")
    t = datetime.fromtimestamp(float(time) / 1000).strftime("%-I:%M %p")

    s = f"Just a reminder that {meeting_name} starts on {day_of_week}, {month_day} at {t}."

    if outbound_contact != "":
        s += f" You will be contacted by {outbound_contact}."

    return f"""
    <html>
    <body>
    <p>
        {s}
    </p>
    </body>
    </html>
    """


def meeting_reminder_text(time, meeting_name, outbound_contact):
    if meeting_name == "":
        meeting_name = "your meeting"

    day_of_week = datetime.fromtimestamp(float(time) / 1000).strftime("%A")
    month_day = datetime.fromtimestamp(float(time) / 1000).strftime("%B %-d")
    t = datetime.fromtimestamp(float(time) / 1000).strftime("%-I:%M %p")

    s = f"Just a reminder that {meeting_name} starts on {day_of_week}, {month_day} at {t}."

    if outbound_contact != "":
        s += f" You will be contacted by {outbound_contact}."

    s += " Text C to confirm or X to cancel."

    return s
