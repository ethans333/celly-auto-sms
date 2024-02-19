import json
import os
import uuid

import boto3


def handler(event, context):
    body = json.loads(event["body"])
    user_id = body["user_id"]
    workspace_name = body["workspace_name"]
    workspace_description = body["workspace_description"]
    workspace_raw = body["workspace_raw"]

    workspace_id = str(uuid.uuid4())

    dynamodb = boto3.resource("dynamodb")
    s3 = boto3.resource("s3")

    bucket = s3.Bucket(os.environ["WORKSPACESBUCKET_BUCKET_NAME"])
    table = dynamodb.Table(os.environ["WORKSPACESTABLE_TABLE_NAME"])

    try:
        # Add meta data to table
        table.put_item(
            Item={
                "id": workspace_id,
                "user_id": user_id,
                "workspace_name": workspace_name,
                "workspace_description": workspace_description,
            }
        )

        # Add workspace to bucket
        bucket.put_object(Key=f"{user_id}/{workspace_id}", Body=workspace_raw)
    except Exception as e:
        return {"statusCode": 500, "body": str(e)}

    return {
        "statusCode": 200,
        "body": json.dumps(
            {
                "message": f"{workspace_name} created successfully",
                "workspace_id": workspace_id,
            }
        ),
    }
