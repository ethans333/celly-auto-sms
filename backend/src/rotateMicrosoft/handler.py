import json

import boto3
import msal

CLIENT_ID = "746d9d45-cad6-43ee-8677-a3942d0e3573"
AUTHORITY = "https://login.microsoftonline.com/common"
SCOPES = ["User.Read.All", "Calendars.ReadWrite"]


# def handler(event, context):
#     # Log the event argument for debugging and for use in local development.
#     print(json.dumps(event))

#     secrets_client = boto3.client("secretsmanager")
#     secret_id = event["SecretId"]
#     stage = event["ClientRequestToken"]

#     # Get current secret
#     current_secret = secrets_client.get_secret_value(SecretId=secret_id)
#     current_secret_string = current_secret["SecretString"]

#     # Get current secret tokens
#     current_tokens = json.loads(current_secret_string)
#     refresh_token = current_tokens["microsoft_tokens"]["refresh_token"]

#     # Exchange the refresh token for new access and refresh tokens
#     app = msal.PublicClientApplication(client_id=CLIENT_ID, authority=AUTHORITY)
#     result = app.acquire_token_by_refresh_token(refresh_token, scopes=SCOPES)

#     new_tokens = {
#         "microsoft_tokens": {
#             "access_token": result["access_token"],
#             "refresh_token": result["refresh_token"],
#         }
#     }

#     # Store new secret in secrets manager
#     secrets_client.put_secret_value(
#         SecretId=secret_id, SecretString=json.dumps(new_tokens), VersionStages=[stage]
#     )

#     return {}


# import boto3


def handler(event, context):
    arn = event["SecretId"]
    token = event["ClientRequestToken"]
    step = event["Step"]

    # Setup the client
    service_client = boto3.client("secretsmanager")

    # Make sure the version is staged correctly
    metadata = service_client.describe_secret(SecretId=arn)
    if not metadata["RotationEnabled"]:
        raise ValueError("Secret %s is not enabled for rotation" % arn)

    if step == "createSecret":
        print("No database user credentials to create...")
    elif step == "setSecret":
        set_secret(service_client, arn, token)
    elif step == "testSecret":
        test_secret(service_client, arn, token)

    elif step == "finishSecret":
        finish_secret(service_client, arn, token)

    else:
        raise ValueError("Invalid step parameter")


def set_secret(secrets_client, secret_id, token):
    # Get current secret
    current_secret = secrets_client.get_secret_value(SecretId=secret_id)
    current_secret_string = current_secret["SecretString"]

    # Get current secret tokens
    current_tokens = json.loads(current_secret_string)
    refresh_token = current_tokens["microsoft_tokens"]["refresh_token"]

    # Exchange the refresh token for new access and refresh tokens
    app = msal.PublicClientApplication(client_id=CLIENT_ID, authority=AUTHORITY)
    result = app.acquire_token_by_refresh_token(refresh_token, scopes=SCOPES)

    new_tokens = {
        "microsoft_tokens": {
            "access_token": result["access_token"],
            "refresh_token": result["refresh_token"],
        }
    }

    # Store new secret in secrets manager
    secrets_client.put_secret_value(
        SecretId=secret_id,
        SecretString=json.dumps(new_tokens),
        VersionStages=["AWSCURRENT"],
    )


def test_secret(service_client, arn, token):
    print("No need to testing against any service...")


def finish_secret(service_client, arn, token):

    # First describe the secret to get the current version
    metadata = service_client.describe_secret(SecretId=arn)

    for version in metadata["VersionIdsToStages"]:
        if "AWSCURRENT" in metadata["VersionIdsToStages"][version]:
            if version == token:
                # The correct version is already marked as current, return
                return

            # Finalize by staging the secret version current
            service_client.update_secret_version_stage(
                SecretId=arn,
                VersionStage="AWSCURRENT",
                MoveToVersionId=token,
                RemoveFromVersionId=version,
            )
            break
