# A simple token-based authorizer example to demonstrate how to use an authorization token
# to allow or deny a request. In this example, the caller named 'user' is allowed to invoke
# a request if the client-supplied token value is 'allow'. The caller is not allowed to invoke
# the request if the token value is 'deny'. If the token value is 'unauthorized' or an empty
# string, the authorizer function returns an HTTP 401 status code. For any other token value,
# the authorizer returns an HTTP 500 status code.
# Note that token values are case-sensitive.

import json
import os
from typing import Dict, List, Optional

import requests
from jose import jwk, jwt
from jose.utils import base64url_decode


def handler(event, context):

    try:
        token_valid = verify_jwt(event["authorizationToken"], get_jwks())

        if token_valid:
            # valid token
            response = generatePolicy("user", "Allow")
        else:
            # invalid token
            response = generatePolicy("user", "Deny")
    except BaseException:
        return "unauthorized"  # Return a 500 error

    return json.loads(response)


def generatePolicy(principalId, effect):
    authResponse = {}
    authResponse["principalId"] = principalId
    if effect:
        policyDocument = {}
        policyDocument["Version"] = "2012-10-17"
        policyDocument["Statement"] = []
        statementOne = {}
        statementOne["Action"] = "execute-api:Invoke"
        statementOne["Effect"] = effect
        statementOne["Resource"] = "arn:aws:execute-api:us-east-1:*:*"
        policyDocument["Statement"] = [statementOne]
        authResponse["policyDocument"] = policyDocument
    authResponse["context"] = {
        "stringKey": "stringval",
        "numberKey": 123,
        "booleanKey": True,
    }
    authResponse_JSON = json.dumps(authResponse)
    return authResponse_JSON


# https://gntrm.medium.com/jwt-authentication-with-fastapi-and-aws-cognito-1333f7f2729e

JWK = Dict[str, str]
JWKS = Dict[str, List[JWK]]


def get_jwks() -> JWKS:
    return requests.get(
        f"https://cognito-idp.{os.environ.get('USER_POOL_REGION')}.amazonaws.com/"
        f"{os.environ.get('USER_POOL_ID')}/.well-known/jwks.json"
    ).json()


def get_hmac_key(token: str, jwks: JWKS) -> Optional[JWK]:
    kid = jwt.get_unverified_header(token).get("kid")
    for key in jwks.get("keys", []):
        if key.get("kid") == kid:
            return key


def verify_jwt(token: str, jwks: JWKS) -> bool:
    hmac_key = get_hmac_key(token, jwks)

    if not hmac_key:
        raise ValueError("No pubic key found!")

    hmac_key = jwk.construct(get_hmac_key(token, jwks))

    message, encoded_signature = token.rsplit(".", 1)
    decoded_signature = base64url_decode(encoded_signature.encode())

    return hmac_key.verify(message.encode(), decoded_signature)


# A simple token-based authorizer example to demonstrate how to use an authorization token
# to allow or deny a request. In this example, the caller named 'user' is allowed to invoke
# a request if the client-supplied token value is 'allow'. The caller is not allowed to invoke
# the request if the token value is 'deny'. If the token value is 'unauthorized' or an empty
# string, the authorizer function returns an HTTP 401 status code. For any other token value,
# the authorizer returns an HTTP 500 status code.
# Note that token values are case-sensitive.

# import json


# def handler(event, context):
#     token = event["authorizationToken"]
#     if token == "allow":
#         print("authorized")
#         response = generatePolicy("user", "Allow", event["methodArn"])
#     elif token == "deny":
#         print("unauthorized")
#         response = generatePolicy("user", "Deny", event["methodArn"])
#     elif token == "unauthorized":
#         print("unauthorized")
#         raise Exception("Unauthorized")  # Return a 401 Unauthorized response
#         return "unauthorized"
#     try:
#         return json.loads(response)
#     except BaseException:
#         print("unauthorized")
#         return "unauthorized"  # Return a 500 error


# def generatePolicy(principalId, effect, resource):
#     authResponse = {}
#     authResponse["principalId"] = principalId
#     if effect and resource:
#         policyDocument = {}
#         policyDocument["Version"] = "2012-10-17"
#         policyDocument["Statement"] = []
#         statementOne = {}
#         statementOne["Action"] = "execute-api:Invoke"
#         statementOne["Effect"] = effect
#         statementOne["Resource"] = resource
#         policyDocument["Statement"] = [statementOne]
#         authResponse["policyDocument"] = policyDocument
#     authResponse["context"] = {
#         "stringKey": "stringval",
#         "numberKey": 123,
#         "booleanKey": True,
#     }
#     authResponse_JSON = json.dumps(authResponse)
#     return authResponse_JSON


# token_valid = verify_jwt(
#     "eyJraWQiOiJlUW93XC9JK0N1YVlZOEpjNThaaGFxQjFoV3F3Q25BeUV2SDFsNkVaQk5CYz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJlZDRiODAyNC00MWRiLTQ1ZmQtYTU5NC03N2NkYzY5OTRkZTYiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9ETUxta2tiZHoiLCJjbGllbnRfaWQiOiIyZDJuNTZkb2o4cmtyZjlkaTk4bTkzb2s3YyIsIm9yaWdpbl9qdGkiOiJhM2E1ZWU3Zi1hNjdjLTQwZDYtOWI4Yy0wNTUzMmYwNjg2NDQiLCJldmVudF9pZCI6ImViMGI3YThiLTIwZDctNGNjNC05YjA2LTM0ODUyNDBiNWRjZCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3MTA0MzQzNjIsImV4cCI6MTcxMDQzNzk2MiwiaWF0IjoxNzEwNDM0MzYyLCJqdGkiOiJlZjdjZTNjOC0zMWVhLTRjNWMtODFjNS01ZTY5OGY4MjIxNjYiLCJ1c2VybmFtZSI6ImVkNGI4MDI0LTQxZGItNDVmZC1hNTk0LTc3Y2RjNjk5NGRlNiJ9.jMUxjvdthp7PTWlpjgXLbAHREvOSRIoAYb8ht-0lf7KSVp_k-Cn-1HBDjUc2N9JMl-767d9Rw-_kNUQUWvElWN5PPc6BBoSp8H-wW8ZkBI6o6xB1oX6sA1bmVaukZ0FgMcr3rICSWFKGDhSpwL9l8_t7f69TfwmZf-7cdc56JZG-KAYS-FuUrdSpJ0l9lhThFGNJ9cqhrMvFSqRREwr7v20x5vYYSlQvBfw8G2qodU0fEZjeIuaEiPR_VS5YIEkn4XLw1iWZk02EzjkzRzRTD20Ne_-x4v01zkTOixHC-CrqLwykx91W_AviggK-aeQscRL07C3KpUbmR3SYwOTD5g",
#     get_jwks(),
# )

# print("token_valid", token_valid)
