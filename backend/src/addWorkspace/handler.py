import json
import os
import uuid

import boto3
import jwt


def handler(event, context):
    body = json.loads(event["body"])

    workspace_name = body["workspace_name"]
    workspace_description = body["workspace_description"]
    workspace_raw = body["workspace_raw"]
    workspace_emoji = body["workspace_emoji"]

    access_token = event["headers"]["Authorization"]
    user_id = jwt.decode(access_token, options={"verify_signature": False})["sub"]

    workspace_id = str(uuid.uuid4())

    s3 = boto3.resource("s3")

    bucket = s3.Bucket(os.environ["WORKSPACESBUCKET_BUCKET_NAME"])

    try:
        workspace_metadata = {
            "workspace_emoji": "U+{:X}".format(ord(workspace_emoji)),
            "workspace_name": workspace_name,
            "workspace_description": workspace_description,
            "user_id": user_id,
            "id": workspace_id,
            "is_deployed": "False",
            "is_favorite": "False",
            "meeting_window_start": "9",
            "meeting_window_end": "18",
            "blackout_days": str([0, 6]),
        }

        # Add workspace to bucket
        bucket.put_object(
            Key=f"{user_id}/{workspace_id}",
            Body=workspace_raw,
            ContentType="application/json",
            Metadata=workspace_metadata,
        )

        workspace_metadata["workspace_emoji"] = workspace_emoji
        workspace_metadata["is_deployed"] = False
        workspace_metadata["is_favorite"] = False

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
                "message": f"{workspace_name} created successfully",
                "workspace_id": workspace_id,
                "workspace_metadata": workspace_metadata,
            },
        ),
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*",
            "Content-Type": "application/json",
        },
    }
