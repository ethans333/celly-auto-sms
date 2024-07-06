import json
import os
import sys
from datetime import datetime

import boto3
import requests
from jose import jwt


def handler(event, context):
    try:
        ddb = boto3.resource("dynamodb")
        table = ddb.Table(os.environ["SCHEDULEDMEETINGSTABLE_TABLE_NAME"])

        # get user id from access token
        client = boto3.client("cognito-idp")
        access_token = event["headers"]["Authorization"]
        user_id = client.get_user(AccessToken=access_token)["Username"]

        body = event["body"]

        if isinstance(event["body"], str):
            body = json.loads(event["body"])

        meetings_to_cancel = body["meetings"]

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

        # cancel each meeting in graph
        for meeting in meetings_to_cancel:
            requests.delete(  # delete a meeting
                "https://graph.microsoft.com/v1.0/me/calendar/events/"
                + meeting["event_id"],
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Content-Type": "application/json",
                },
            )

            # remove meeting from meetings table
            table.delete_item(
                Key={
                    "id": meeting["id"],
                }
            )

            # send message to client that meeting have been canceled
            meeting_name = (
                meeting["meeting_name"]
                if meeting["meeting_name"] != ""
                else "Your Meeting"
            )

            if meeting["contact_method"] == "Phone":
                send_text(meeting["contact_value"], get_cancellation_text(meeting_name))
            elif meeting["contact_method"] == "Email":
                send_email(
                    meeting["contact_value"], get_cancellation_email(meeting_name)
                )
            elif meeting["contact_method"] == "Phone & Email":
                send_text(meeting["contact_value"], get_cancellation_text(meeting_name))
                send_email(
                    meeting["contact_value"], get_cancellation_email(meeting_name)
                )

        return {
            "statusCode": 200,
            "body": json.dumps(
                {
                    "Meetings Canceled": len(meetings_to_cancel),
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
            "body": str(e),
            "traceback": f"ERROR: line {sys.exc_info()[-1].tb_lineno}, {str(e)}",
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "*",
                "Content-Type": "application/json",
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
                "Data": "Meeting Canceled - Intwine",
            },
            "Body": {
                "Html": {
                    "Data": html,
                },
            },
        },
    )


def get_cancellation_text(meeting_name):
    return f"{meeting_name} has been canceled."


def get_cancellation_email(meeting_name):
    return f"""
    <p>{meeting_name} has been canceled.</p>
    """
