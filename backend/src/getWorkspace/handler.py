import json
import os
import sys

import boto3
import jwt


def handler(event, context):
    try:
        workspace_id = event["pathParameters"]["id"]

        s3 = boto3.resource("s3")
        bucket = s3.Bucket(os.environ["WORKSPACESBUCKET_BUCKET_NAME"])

        access_token = event["headers"]["Authorization"]
        user_id = jwt.decode(access_token, options={"verify_signature": False})["sub"]

        # Get workspace from bucket
        bucket_object = bucket.Object(f"{user_id}/{workspace_id}")
        workspace_raw = bucket_object.get()["Body"].read().decode("utf-8")

        # Get meta data from bucket object
        workspace_metadata = bucket_object.get()["Metadata"]

        # convert unicode to emoji string
        if "workspace_emoji" in workspace_metadata:
            workspace_metadata["workspace_emoji"] = unicode_to_emoji(
                workspace_metadata["workspace_emoji"]
            )

    except Exception as e:
        return {
            "statusCode": 500,
            "body": f"{e}\nLine: {sys.exc_info()[-1].tb_lineno}",
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "*",
                "Content-Type": "application/json",
            },
        }

    return {
        "statusCode": 200,
        "body": json.dumps(
            {
                "id": workspace_id,
                "workspace_metadata": workspace_metadata,
                "workspace_raw": workspace_raw,
            },
        ),
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*",
            "Content-Type": "application/json",
        },
    }


def unicode_to_emoji(unicode_string):
    code_points = unicode_string.split(",")
    emoji = "".join(chr(int(code_point[2:], 16)) for code_point in code_points)
    return emoji
