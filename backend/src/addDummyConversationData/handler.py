import json
import os
import uuid

import boto3

dummy_workspace = [
    {
        "datetime": "2024-10-29T10:00:00",
        "message": "Hello, how are you?",
        "isClient": False,
    },
    {
        "datetime": "2024-10-29T10:00:00",
        "message": "Dolor exercitation eiusmod occaecat exercitation est mollit proident ut amet id esse pariatur consectetur aliqua.",
        "isClient": True,
    },
    {
        "datetime": "2024-10-29T10:00:00",
        "message": "Est esse incididunt amet anim minim reprehenderit Lorem culpa occaecat ipsum consectetur sit laboris. Commodo nisi ut sint exercitation pariatur nisi occaecat enim occaecat. Sint fugiat occaecat excepteur duis est eiusmod commodo duis ea irure eiusmod velit. Minim aliqua proident elit in amet sit ut excepteur. Elit cupidatat tempor labore occaecat cillum.",
        "isClient": False,
    },
    {
        "datetime": "2024-10-29T10:00:00",
        "message": "Dolore veniam nostrud ipsum reprehenderit pariatur adipisicing sunt consectetur occaecat incididunt cupidatat.",
        "isClient": True,
    },
    {
        "datetime": "2024-10-29T10:00:00",
        "message": "Nisi culpa ipsum officia officia. Consequat proident veniam aliquip voluptate qui occaecat. Est amet fugiat irure deserunt proident veniam pariatur aute minim adipisicing cillum proident incididunt cupidatat. Ullamco culpa ipsum elit labore dolore velit veniam id nulla id proident minim. Amet Lorem aute elit dolor occaecat laboris qui ullamco nostrud reprehenderit incididunt. In sunt magna proident consectetur tempor dolor.",
        "isClient": True,
    },
    {
        "datetime": "2024-10-29T10:00:00",
        "message": "Tempor cupidatat mollit exercitation non cillum quis dolor qui consectetur velit in irure.",
        "isClient": False,
    },
]


def handler(event, context):

    workspace_id = str(uuid.uuid4())
    conversation_id = str(uuid.uuid4())

    dynamodb = boto3.resource("dynamodb")
    s3 = boto3.resource("s3")

    bucket = s3.Bucket(os.environ["CONVERSATIONSBUCKET_BUCKET_NAME"])
    table = dynamodb.Table(os.environ["CONVERSATIONSTABLE_TABLE_NAME"])

    try:
        # Add meta data to table
        table.put_item(
            Item={
                "id": conversation_id,
                "phone": "123-456-7890",
                "date_registered": "10/29/2024",
                "last_contacted": "10/29/2024",
                "city": "Miami",
                "state": "FL",
                "workspace_id": workspace_id,
            }
        )

        # Add workspace to bucket
        bucket.put_object(
            Key=f"{workspace_id}/{conversation_id}", Body=json.dumps(dummy_workspace)
        )
    except Exception as e:
        return {"statusCode": 500, "body": str(e)}

    return {
        "statusCode": 200,
        "body": json.dumps(
            {
                "message": f"Conversation created successfully",
                "conversation_id": conversation_id,
            }
        ),
    }
