import json
import os

import boto3


def handler(event, context):
    try:
        workspace_id = event["pathParameters"]["id"]

        # read booked event as date time from event body
        # add event times to microsoft graph calendar

    except Exception as e:
        return {"statusCode": 500, "body": str(e)}

    return {
        "statusCode": 200,
        "body": json.dumps(
            {
                "message": f"Event booked successfully",
            }
        ),
    }
