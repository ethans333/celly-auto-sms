import json
import os

import msal
import requests

CLIENT_ID = "746d9d45-cad6-43ee-8677-a3942d0e3573"
AUTHORITY = "https://login.microsoftonline.com/common"
REDIRECT_PATH = "http://localhost:5173"  # Your app's redirect URI
SCOPES = ["User.Read.All", "Calendars.ReadWrite"]


def handler(event, context):
    try:

        # Authentication code for msal token acquisition
        code = event["body"]["code"]
        state = event["body"]["state"]
        flow = event["body"]["flow"]

        # Initialize MSAL app
        app = msal.PublicClientApplication(client_id=CLIENT_ID, authority=AUTHORITY)

        auth_response = {
            "code": code,
            "state": state,
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
        else:
            return {"statusCode": 500, "body": "Token acquisition failed."}

    except Exception as e:
        return {"statusCode": 500, "body": str(e)}

    return {
        "statusCode": 200,
        "body": json.dumps(
            {
                "message": "access token acquired successfully",
            }
        ),
    }
