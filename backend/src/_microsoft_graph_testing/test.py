from urllib.parse import parse_qs, urlparse

import msal
import requests

CLIENT_ID = "746d9d45-cad6-43ee-8677-a3942d0e3573"
AUTHORITY = "https://login.microsoftonline.com/common"
REDIRECT_PATH = "http://localhost:5173"  # Your app's redirect URI
SCOPES = ["User.Read.All", "Calendars.ReadWrite"]

# Initialize MSAL app
app = msal.PublicClientApplication(client_id=CLIENT_ID, authority=AUTHORITY)

# Initiate auth code flow
session = requests.Session()
session.flow = app.initiate_auth_code_flow(scopes=SCOPES, redirect_uri=REDIRECT_PATH)

print("\n\n" + session.flow["auth_uri"] + "\n\n")

# Simulate user interaction (in a real app, this would be done via UI)
# Paste the URL containing the authorization code
auth_url = input("Paste the authorization URL: ")

# Extract auth code from the query string (auth_response)
parsed_url = urlparse(auth_url)
query_params = parse_qs(parsed_url.query)
auth_response = {
    "code": query_params.get("code")[0],
    "state": query_params.get("state")[0],
}

print("\n\n" + str(auth_response) + "\n\n")

# Acquire token using auth code flow
result = app.acquire_token_by_auth_code_flow(
    auth_code_flow=session.flow, auth_response=auth_response
)

# Use the access token (e.g., call Microsoft Graph API)
if "access_token" in result:
    print("Token acquisition successful.\n\n" + str(result))
    access_token = result["access_token"]
    refresh_token = result["refresh_token"]

    print("\n\n" + access_token + "\n\n")
    print("\n\n" + refresh_token + "\n\n")

    # Make API requests using the access token
    # Example: Get user profile from Microsoft Graph
    user_profile_response = requests.get(
        "https://graph.microsoft.com/v1.0/me",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    print(user_profile_response.json())
else:
    print("Token acquisition failed.")
