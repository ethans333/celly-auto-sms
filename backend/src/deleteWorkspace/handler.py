import json
import os

import boto3


def handler(event, context):
    try:
        workspace_id = event["pathParameters"]["id"]

        dynamodb = boto3.resource("dynamodb")
        s3 = boto3.resource("s3")

        bucket = s3.Bucket(os.environ["WORKSPACESBUCKET_BUCKET_NAME"])
        table = dynamodb.Table(os.environ["WORKSPACESTABLE_TABLE_NAME"])

        # Get meta data from table
        workspace = table.get_item(Key={"id": workspace_id})["Item"]

        # Delete data from table
        table.delete_item(Key={"id": workspace_id})

        # Delete workspace from bucket
        bucket.delete_objects(
            Delete={"Objects": [{"Key": f"{workspace['user_id']}/{workspace_id}"}]}
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
                "message": f"{workspace['workspace_name']} deleted successfully",
            }
        ),
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*",
            "Content-Type": "application/json",
        },
    }
