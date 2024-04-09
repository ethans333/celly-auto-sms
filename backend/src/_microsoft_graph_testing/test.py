from urllib.parse import parse_qs, urlparse

from msal import PublicClientApplication

# Replace with your tenant ID and client ID
authority = "https://login.microsoftonline.com/common"
client_id = "746d9d45-cad6-43ee-8677-a3942d0e3573"

# Define the scopes (permissions) your server needs
scopes = ["User.Read.All", "Calendars.ReadWrite"]  # Replace with your desired scopes

# Create a PublicClientApplication instance
app = PublicClientApplication(client_id=client_id, authority=authority)

code_challenge = "Nj9Youq443xUOCe_HsmBXJy5dKC8YsqlUdn1sga3CR0"

# Initiate the authentication flow to acquire a token
flow = app.initiate_auth_code_flow(scopes=scopes, claims_challenge=code_challenge)

# Redirect the user to the Azure AD login page
url = flow["auth_uri"]

print("Navigate to this URL and login:")
print(url)

# Obtain the redirect URL from the user input
redirect_url = input("Enter the redirect URL from your browser: ")

# Parse the 'code' value from the redirect URL query string parameters
parsed_url = urlparse(redirect_url)
query_params = parse_qs(parsed_url.query)
code = query_params.get("code", [""])[0]  # Get the first 'code' parameter value

print("\n\nCode:", code)

response = app.acquire_token_by_authorization_code(
    code, scopes=scopes, claims_challenge=code_challenge
)
print("Token response:", str(response))
