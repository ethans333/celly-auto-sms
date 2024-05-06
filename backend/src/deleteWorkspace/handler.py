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

        # Delete workspace from bucket
        bucket.delete_objects(
            Delete={"Objects": [{"Key": f"{user_id}/{workspace_id}"}]}
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
                "message": "Workspace deleted successfully",
            }
        ),
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*",
            "Content-Type": "application/json",
        },
    }
