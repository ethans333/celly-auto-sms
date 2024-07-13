import os
import uuid
from datetime import datetime

import boto3
import pytz
from boto3.dynamodb.conditions import Attr
from reminder_email import reminder_email
from util import increment_confirmations_sent, send_email, send_text


def handler(event, context):
    ddb = boto3.resource("dynamodb")
    table = ddb.Table(os.environ["SCHEDULEDMEETINGSTABLE_TABLE_NAME"])

    meetings = table.scan(
        FilterExpression=Attr("end_time").gt(
            int(datetime.now(pytz.timezone("UTC")).timestamp()) * 1000
        ),
    )["Items"]

    for meeting in meetings:
        email = meeting_reminder_email(
            meeting["start_time"],
            meeting["timezone"],
            meeting["meeting_name"],
            meeting["outbound_contact_value"],
            meeting["id"],
        )
        text = meeting_reminder_text(
            meeting["start_time"],
            meeting["timezone"],
            meeting["meeting_name"],
            meeting["outbound_contact_value"],
        )

        if meeting["contact_method"] == "Email":
            # send reminder via email
            send_email(meeting["contact_value"], email)
        elif meeting["contact_method"] == "Phone":
            # send reminder via phone
            send_text(meeting["contact_value"], text, meeting["id"])
        elif meeting["contact_method"] == "Phone & Email":
            # send reminder via email and phone
            send_email(meeting["contact_value"], email)
            send_text(meeting["contact_value"], text, meeting["id"])

        increment_confirmations_sent(meeting)
    return {
        "reminders_sent": len(meetings),
    }


def meeting_reminder_email(time, tz, meeting_name, outbound_contact, meeting_id):
    if meeting_name == "":
        meeting_name = "your meeting"

    # Convert timestamp to datetime object in UTC
    utc_dt = datetime.utcfromtimestamp(float(time) / 1000)

    # Get the timezone object for the desired timezone
    timezone = pytz.timezone(tz)

    # Convert UTC datetime to the desired timezone
    localized_dt = utc_dt.replace(tzinfo=pytz.utc).astimezone(timezone)

    # Format the localized datetime
    day_of_week = localized_dt.strftime("%A")
    month_day = localized_dt.strftime("%B %-d")
    t = localized_dt.strftime("%-I:%M %p")

    # generate confirmation token to track last confirmation sent
    confirmation_token = uuid.uuid4().hex

    # update table with confirmation token
    table = boto3.resource("dynamodb").Table(
        os.environ["SCHEDULEDMEETINGSTABLE_TABLE_NAME"]
    )
    table.update_item(
        Key={"id": meeting_id},
        UpdateExpression="SET confirmation_token = :val",
        ExpressionAttributeValues={":val": confirmation_token},
    )

    # build email body

    s = f"""
        Just a reminder that <a style='font-weight: 800'>{meeting_name}</a> starts on
          <a style='font-weight: 800'>{day_of_week}, {month_day} at {t}</a>.
    """

    if outbound_contact != "":
        s += f" You will be contacted by <a style='font-weight: 800'>{outbound_contact}</a>."

    return reminder_email(s, meeting_id, confirmation_token)


def meeting_reminder_text(time, tz, meeting_name, outbound_contact):
    if meeting_name == "":
        meeting_name = "your meeting"

    # Convert timestamp to datetime object in UTC
    utc_dt = datetime.utcfromtimestamp(float(time) / 1000)

    # Get the timezone object for the desired timezone
    timezone = pytz.timezone(tz)

    # Convert UTC datetime to the desired timezone
    localized_dt = utc_dt.replace(tzinfo=pytz.utc).astimezone(timezone)

    # Format the localized datetime
    day_of_week = localized_dt.strftime("%A")
    month_day = localized_dt.strftime("%B %-d")
    t = localized_dt.strftime("%-I:%M %p")

    s = f"Just a reminder that {meeting_name} starts on {day_of_week}, {month_day} at {t}."

    if outbound_contact != "":
        s += f" You will be contacted by {outbound_contact}."

    s += " Text C to confirm or X to cancel."

    return s
