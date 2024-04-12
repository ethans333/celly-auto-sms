import base64
import json
import os

import msal

CLIENT_ID = "746d9d45-cad6-43ee-8677-a3942d0e3573"
AUTHORITY = "https://login.microsoftonline.com/common"
REDIRECT_PATH = "http://127.0.0.1:5173/"  # Your app's redirect URI
SCOPES = ["User.Read.All", "Calendars.ReadWrite"]


def handler(event, context):
    try:
        body = json.loads(event["body"])
        # Authentication code for msal token acquisition
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

        # Use the access token (e.g., call Microsoft Graph API)
        if "access_token" in result:
            access_token = result["access_token"]
            refresh_token = result["refresh_token"]

            print("\n\n" + access_token + "\n\n")
            print("\n\n" + refresh_token + "\n\n")

            # save tokens in secret manager
            return {
                "statusCode": 200,
                "body": json.dumps(
                    {
                        "message": "access token acquired successfully",
                        "token": access_token,
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
