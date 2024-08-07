import inspect
import json
import os
import sys

import boto3
import jwt

# originator_id = "phone-f39b9491484e41f4aeb11a163419e5e9"


def handler(event, context):
    workspace_id = event["pathParameters"]["id"]

    access_token = event["headers"]["Authorization"]
    user_id = jwt.decode(access_token, options={"verify_signature": False})["sub"]

    s3 = boto3.resource("s3")
    secrets = boto3.client("secretsmanager")
    # pinpoint = boto3.client("pinpoint-sms-voice-v2")
    # lex = boto3.client("lexv2-models")

    bucket = s3.Bucket(os.environ["WORKSPACESBUCKET_BUCKET_NAME"])

    try:
        # Check if workspace uses calendar integration
        cell_types = []

        # load workspace data
        workspace_raw = (
            bucket.Object(f"{user_id}/{workspace_id}")
            .get()["Body"]
            .read()
            .decode("utf-8")
        )

        workspace_raw = json.loads(workspace_raw)

        # loop through all cell types
        for cell in workspace_raw:
            cell_types.append(cell["type"])

        if "calendar" in cell_types:
            # check if user linked calendar
            tokens = secrets.get_secret_value(SecretId=user_id)["SecretString"]
            tokens = json.loads(tokens)

            # if not, raise exception
            if tokens["microsoft_tokens"] is None:
                raise Exception("User has not linked calendar")

        # Update is_deployed status to true
        metadata = bucket.Object(f"{user_id}/{workspace_id}").metadata
        metadata["is_deployed"] = "true"

        bucket.put_object(
            Key=f"{user_id}/{workspace_id}",
            Body=json.dumps(workspace_raw),
            ContentType="application/json",
            Metadata=metadata,
        )

        # # Get workspace from bucket
        # bucket_object = bucket.Object(f"{user_id}/{workspace_id}")
        # workspace_raw = bucket_object.get()["Body"].read().decode("utf-8")

        # create new version within user alias
        # lex.create_bot_version(
        #     botId=os.environ["BOT_ID"],
        #     botVersionLocaleId="en_US",
        #     botVersionName=workspace_id,
        # )

    except Exception as e:
        error_type, error_value, error_traceback = sys.exc_info()
        error_line = error_traceback.tb_lineno
        error_line_code = inspect.getframeinfo(error_traceback.tb_frame).code_line

        return {
            "statusCode": 500,
            "body": f"{e}\nLine: {error_line}\nCode: {error_line_code}",
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
                "message": f"Workspace deployed successfully",
                "workspace_id": workspace_id,
            },
        ),
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*",
            "Content-Type": "application/json",
        },
    }
