import json
import os

import boto3


def handler(event, context):
    try:
        s3 = boto3.resource("s3")
        client = boto3.client("cognito-idp")
        bucket = s3.Bucket(os.environ["WORKSPACESBUCKET_BUCKET_NAME"])

        # get user id from access token
        access_token = event["headers"]["Authorization"]
        user_id = client.get_user(AccessToken=access_token)["Username"]

        # get all objects in bucket that exist under the directory starting with user_id
        workspaces = []

        for obj in bucket.objects.filter(Prefix=f"{user_id}/"):
            workspace_metadata = bucket.Object(obj.key).get()["Metadata"]

            # convert unicode to emoji string
            workspace_metadata["workspace_emoji"] = chr(
                int(workspace_metadata["workspace_emoji"][2:], 16)
            )

            # edit bools
            workspace_metadata["is_deployed"] = (
                workspace_metadata["is_deployed"] == "True"
            )

            workspace_metadata["is_favorite"] = (
                workspace_metadata["is_favorite"] == "True"
            )

            workspaces.append(workspace_metadata)

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
            {"workspaces": workspaces},
        ),
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*",
            "Content-Type": "application/json",
        },
    }
