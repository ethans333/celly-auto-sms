import json
import os
import uuid

import boto3


def handler(event, context):
    body = json.loads(event["body"])
    workspace_id = event["pathParameters"]["id"]
    workspace_name = body["workspace_name"]
    workspace_description = body["workspace_description"]
    workspace_raw = body["workspace_raw"]
    is_favorite = body["is_favorite"]

    dynamodb = boto3.resource("dynamodb")
    s3 = boto3.resource("s3")

    bucket = s3.Bucket(os.environ["WORKSPACESBUCKET_BUCKET_NAME"])
    table = dynamodb.Table(os.environ["WORKSPACESTABLE_TABLE_NAME"])

    try:
        workspace = table.get_item(Key={"id": workspace_id})["Item"]

        # Put meta data in table
        table.update_item(
            Key={"id": workspace_id},
            UpdateExpression="SET workspace_name = :n, workspace_description = :d, is_favorite = :f",
            ExpressionAttributeValues={
                ":n": workspace_name,
                ":d": workspace_description,
                ":f": is_favorite,
            },
        )

        # Add workspace to bucket
        bucket.put_object(
            Key=f"{workspace['user_id']}/{workspace_id}", Body=workspace_raw
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
                "message": f"{workspace_name} updated successfully",
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
