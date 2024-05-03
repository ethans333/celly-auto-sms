import json
import os

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
            workspace_metadata["workspace_emoji"] = chr(
                int(workspace_metadata["workspace_emoji"][2:], 16)
            )

    except Exception as e:
        return {
            "statusCode": 500,
            "body": str(e),
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
