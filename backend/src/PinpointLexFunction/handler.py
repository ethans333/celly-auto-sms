import json
import os

import boto3


def handler(event, context):
    lex = boto3.client("lexv2-runtime")
    pinpoint = boto3.client("pinpoint-sms-voice-v2")

    message = json.loads(event["Records"][0]["Sns"]["Message"])
    origination_number = message["originationNumber"]
    user_id = origination_number.replace("+1", "")
    message_body = message["messageBody"]

    try:
        response = lex.recognize_text(
            botId="STPJGYCE7A",
            botAliasId="L2XMJ3KLRZ",
            localeId="en_US",
            sessionId=user_id,
            text=message_body,
        )

        # Extract interpretations
        lex_response_message = response["messages"][0]["content"]

        # send message
        pinpoint.send_text_message(
            DestinationPhoneNumber=origination_number,
            OriginationIdentity=os.environ["ORIGINATION_NUMBER"],
            MessageBody=lex_response_message,
            MessageType="TRANSACTIONAL",
        )

        return {
            "message": response["messages"][0]["content"],
        }

    except Exception as e:
        print(e)
        return {"error": str(e)}
