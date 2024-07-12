import decimal
import json
import os

import boto3
from boto3.dynamodb.conditions import Attr


# meeting confirmation via text
def handler(event, context):
    table = boto3.resource("dynamodb").Table(
        os.environ["SCHEDULEDMEETINGSTABLE_TABLE_NAME"]
    )

    try:
        # get messages sent to SNS topic
        messages = []

        for r in event["Records"]:
            messages.append(json.loads(r["Sns"]["Message"]))

        # for each message
        for m in messages:
            reply = m["messageBody"].upper().strip()
            number = m["originationNumber"]
            meeting = get_meeting(m["previousPublishedMessageId"])

            response_message = ""
            meeting_name = meeting["meeting_name"]

            if meeting_name == "":
                meeting_name = "Your meeting"

            if reply == "C":
                meeting["confirmations_confirmed"] = (
                    int(meeting["confirmations_confirmed"]) + 1
                )
                response_message = (
                    f"{meeting_name} has been confirmed. Your host has been notified."
                )

                # send confirmation message
                send_text(number, response_message)

                # update number of confirmations confirmed by user
                table.update_item(
                    Key={"id": meeting["id"]},
                    UpdateExpression="set confirmations_confirmed = confirmations_confirmed + :val, latest_message_id = :empty_s",
                    ExpressionAttributeValues={
                        ":val": 1,
                        ":empty_s": "",
                    },
                )
            elif reply == "X":
                # cancel meeting via lambda
                cancel_meeting(meeting)
    except Exception as e:
        return {
            "error": str(e),
        }

    return {
        "message": "success",
    }


def get_meeting(latest_message_id):
    # get meeting from scheduled meetings table via latest_message_id
    ddb = boto3.resource("dynamodb")
    table = ddb.Table(os.environ["SCHEDULEDMEETINGSTABLE_TABLE_NAME"])

    meetings = table.scan(
        FilterExpression=Attr("latest_message_id").eq(latest_message_id),
    )["Items"]

    if len(meetings) == 0:
        raise Exception("No meetings found")

    return meetings[0]


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
        DestinationPhoneNumber=phone,
        OriginationIdentity=originator_id,
        MessageBody=message,
        MessageType="TRANSACTIONAL",
    )


def cancel_meeting(meeting):
    lambda_client = boto3.client("lambda")

    # Cancel meetings
    lambda_client.invoke(
        FunctionName=os.environ["CANCELSCHEDULEDMEETINGS_FUNCTION_NAME"],
        InvocationType="RequestResponse",
        Payload=bytes(
            json.dumps(
                {
                    "body": {"meetings": [meeting]},
                    "user_id": meeting["user_id"],
                },
                cls=DecimalEncoder,
            ),
            encoding="utf8",
        ),
    )


# decimal encoder for calling json.dumps. Used when given there exists a variable of type decimal
class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            return str(o)
        return super().default(o)
