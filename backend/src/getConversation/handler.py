import json
import os

import boto3


def handler(event, context):
    try:
        conversation_id = event["pathParameters"]["id"]

        dynamodb = boto3.resource("dynamodb")
        s3 = boto3.resource("s3")

        bucket = s3.Bucket(os.environ["CONVERSATIONSBUCKET_BUCKET_NAME"])
        table = dynamodb.Table(os.environ["CONVERSATIONSTABLE_TABLE_NAME"])

        # Get meta data from table
        conversation = table.get_item(Key={"id": conversation_id})["Item"]

        # Get workspace from bucket
        bucket_object = bucket.Object(
            f"{conversation['workspace_id']}/{conversation_id}"
        )
        conversation_raw = bucket_object.get()["Body"].read().decode("utf-8")
    except Exception as e:
        return {"statusCode": 500, "body": str(e)}

    return {
        "statusCode": 200,
        "body": json.dumps(
            {
                "message": f"Conversation fetched successfully",
                "item": conversation["Item"],
                "conversation_raw": conversation_raw,
            }
        ),
    }
