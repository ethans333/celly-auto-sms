import json

import boto3
import msal

CLIENT_ID = "746d9d45-cad6-43ee-8677-a3942d0e3573"
AUTHORITY = "https://login.microsoftonline.com/common"


def handler(event, context):
    # Log the event argument for debugging and for use in local development.
    print(json.dumps(event))

    secrets_client = boto3.client("secretsmanager")
    secret_id = event["SecretId"]
    stage = event["ClientRequestToken"]

    # Get current secret
    current_secret = secrets_client.get_secret_value(SecretId=secret_id)
    current_secret_string = current_secret["SecretString"]

    # Get current secret tokens
    current_tokens = json.loads(current_secret_string)
    access_token = current_tokens["microsoft_tokens"]["access_token"]
    refresh_token = current_tokens["microsoft_tokens"]["refresh_token"]

    # Exchange the refresh token for new access and refresh tokens
    app = msal.PublicClientApplication(client_id=CLIENT_ID, authority=AUTHORITY)
    result = app.acquire_token_by_refresh_token(refresh_token)

    new_tokens = {
        "microsoft_tokens": {
            "access_token": result["access_token"],
            "refresh_token": result["refresh_token"],
        }
    }

    # Store new secret in secrets manager
    secrets_client.put_secret_value(
        SecretId=secret_id, SecretString=json.dumps(new_tokens), VersionStages=[stage]
    )

    return {}