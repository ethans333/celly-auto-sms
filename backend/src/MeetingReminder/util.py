import os

import boto3


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


def increment_confirmations_sent(meeting):
    table = boto3.resource("dynamodb").Table(
        os.environ["SCHEDULEDMEETINGSTABLE_TABLE_NAME"]
    )
    table.update_item(
        Key={"id": meeting["id"]},
        UpdateExpression="SET confirmations_sent = confirmations_sent + :val",
        ExpressionAttributeValues={":val": 1},
    )
