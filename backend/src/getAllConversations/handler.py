import json
import os

import boto3


def handler(event, context):
    try:
        limit = int(event["queryStringParameters"]["limit"])

        dynamodb = boto3.resource("dynamodb")

        table = dynamodb.Table(os.environ["CONVERSATIONTABLE_TABLE_NAME"])

        # Get meta data from table
        response = table.scan(
            Limit=limit,
            AttributesToGet=[
                "phone",
                "date_registered",
                "last_contacted",
                "city",
                "state",
                "id",
            ],
        )
    except Exception as e:
        return {"statusCode": 500, "body": str(e)}

    return {
        "statusCode": 200,
        "body": json.dumps(
            {
                "message": f"{response['Count']} item(s) fetched successfully",
                "data": response["Items"],
                "lastEvaluatedKey": response.get("LastEvaluatedKey"),
            }
        ),
    }
