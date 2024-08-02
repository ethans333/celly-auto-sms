import json
import os
import sys

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
        new_metadata = json.loads(body["metadata"])

        new_metadata["workspace_emoji"] = ",".join(
            ["U+{:X}".format(ord(char)) for char in new_metadata["workspace_emoji"]]
        )

        # change everything to string
        for k in new_metadata:
            new_metadata[k] = str(new_metadata[k])

        bucket.put_object(
            Key=f"{user_id}/{workspace_id}",
            Body=body["workspace_raw"],
            Metadata=new_metadata,
        )

    except Exception as e:
        return {
            "statusCode": 500,
            "body": f"{str(e)}\nException occurred at line {sys.exc_info()[-1].tb_lineno}",
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
