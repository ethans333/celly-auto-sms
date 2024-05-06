import json
import os

import boto3
import jwt


def handler(event, context):
    body = json.loads(event["body"])
    workspace_id = event["pathParameters"]["id"]

    s3 = boto3.resource("s3")

    bucket = s3.Bucket(os.environ["WORKSPACESBUCKET_BUCKET_NAME"])

    try:
        access_token = event["headers"]["Authorization"]
        user_id = jwt.decode(access_token, options={"verify_signature": False})["sub"]

        # Update metdata
        metadata = bucket.Object(f"{user_id}/{workspace_id}").metadata

        metadata["workspace_emoji"] = "U+{:X}".format(ord(body["workspace_emoji"]))
        metadata["is_favorite"] = str(body["is_favorite"])
        metadata["workspace_description"] = body["workspace_description"]
        metadata["is_deployed"] = str(body["is_deployed"])
        metadata["workspace_name"] = body["workspace_name"]

        bucket.put_object(
            Key=f"{user_id}/{workspace_id}",
            Body=body["workspace_raw"],
            Metadata=metadata,
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
                "message": f"Workspace updated successfully",
                "workspace_id": workspace_id,
            }
        ),
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*",
            "Content-Type": "application/json",
        },
    }
