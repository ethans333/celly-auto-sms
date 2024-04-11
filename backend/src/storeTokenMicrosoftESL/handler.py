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
        # Initialize MSAL app
        app = msal.PublicClientApplication(client_id=CLIENT_ID, authority=AUTHORITY)

        # Initiate auth code flow
        session = requests.Session()
        session.flow = app.initiate_auth_code_flow(
            scopes=SCOPES, redirect_uri=REDIRECT_PATH
        )

        # send login url to frontend
        login_url = session.flow["auth_uri"]

    except Exception as e:
        return {"statusCode": 500, "body": str(e)}

    return {
        "statusCode": 200,
        "body": json.dumps(
            {
                "url": login_url,
                "flow": session.flow,
            }
        ),
    }
