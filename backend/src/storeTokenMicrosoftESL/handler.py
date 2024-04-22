import base64
import json
import os

import boto3
import jwt
import msal

CLIENT_ID = "746d9d45-cad6-43ee-8677-a3942d0e3573"
AUTHORITY = "https://login.microsoftonline.com/common"


def handler(event, context):
    try:
        body = json.loads(event["body"])

        # Get user id from cognito access token
        cognito_access_token = event["headers"]["Authorization"]
        user_id = jwt.decode(cognito_access_token, options={"verify_signature": False})[
            "sub"
        ]

        # Get authentication code and flow from request body
        code = body["code"]
        flow = json.loads(body["flow"])

        # Initialize MSAL app
        app = msal.PublicClientApplication(client_id=CLIENT_ID, authority=AUTHORITY)

        auth_response = {
            "code": code,
            "state": flow["state"],
        }

        # Acquire token using auth code flow
        result = app.acquire_token_by_auth_code_flow(
            auth_code_flow=flow, auth_response=auth_response
        )

        # Check if successful
        if "access_token" in result:
            access_token = result["access_token"]
            refresh_token = result["refresh_token"]

            microsoft_tokens = {
                "access_token": access_token,
                "refresh_token": refresh_token,
            }

            secrets = boto3.client("secretsmanager")

            # Check if secret exists
            try:
                old_value = secrets.get_secret_value(SecretId=user_id)
            except secrets.exceptions.ResourceNotFoundException:
                # Secret not found, so create a new one
                secrets.create_secret(
                    Name=user_id,
                    SecretString=json.dumps(
                        {
                            "microsoft_tokens": microsoft_tokens,
                        }
                    ),
                    Description="Microsoft ESL access token",
                )
            else:
                # Secret found, update existing secret
                old_value = json.loads(old_value["SecretString"])
                old_value["microsoft_tokens"] = microsoft_tokens

                secrets.update_secret(
                    SecretId=user_id,
                    SecretString=json.dumps(old_value),
                )

            secrets.rotate_secret(
                SecretId=user_id,
                RotationLambdaARN=os.environ["ROTATEMICROSOFT_FUNCTION_ARN"],
            )

            # save tokens in secret manager
            return {
                "statusCode": 200,
                "body": json.dumps(
                    {
                        "message": "access token acquired and saved successfully",
                        "microsoft_tokens": microsoft_tokens,
                    }
                ),
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Allow-Methods": "*",
                    "Content-Type": "application/json",
                },
            }
        else:
            return {
                "statusCode": 500,
                "body": "Token acquisition failed.",
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Allow-Methods": "*",
                    "Content-Type": "application/json",
                },
            }

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
