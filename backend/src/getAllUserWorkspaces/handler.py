import json
import os

import boto3


def handler(event, context):
    try:
        s3 = boto3.resource("s3")
        dynamodb = boto3.resource("dynamodb")

        table = dynamodb.Table(os.environ["WORKSPACESTABLE_TABLE_NAME"])
        client = boto3.client("cognito-idp")

        bucket = s3.Bucket(os.environ["WORKSPACESBUCKET_BUCKET_NAME"])

        # get user id from access token
        access_token = event["headers"]["Authorization"]
        user_id = client.get_user(AccessToken=access_token)["Username"]

        # get all objects in bucket that exist under the directory starting with user_id
        objects = []
        for obj in bucket.objects.filter(Prefix=f"{user_id}/"):
            workspace_metadata = bucket.Object(obj.key).get()["Metadata"]
            if "workspace_emoji" in workspace_metadata:
                workspace_metadata["workspace_emoji"] = chr(
                    int(workspace_metadata["workspace_emoji"][2:], 16)
                )
            objects.append(workspace_metadata)

        # Get workspaces from table
        workspaces = table.scan(
            FilterExpression=boto3.dynamodb.conditions.Attr("user_id").eq(user_id)
        )["Items"]
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
            {"workspaces": workspaces, "objects": objects},
        ),
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*",
            "Content-Type": "application/json",
        },
    }
