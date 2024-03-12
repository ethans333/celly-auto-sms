# A simple token-based authorizer example to demonstrate how to use an authorization token
# to allow or deny a request. In this example, the caller named 'user' is allowed to invoke
# a request if the client-supplied token value is 'allow'. The caller is not allowed to invoke
# the request if the token value is 'deny'. If the token value is 'unauthorized' or an empty
# string, the authorizer function returns an HTTP 401 status code. For any other token value,
# the authorizer returns an HTTP 500 status code.
# Note that token values are case-sensitive.

import json

import boto3

client = boto3.client("cognito-idp")


def handler(event, context):
    token = event["authorizationToken"]

    try:
        client.get_user(AccessToken=token)  # get user via token

        response = generatePolicy("user", "Allow", event["methodArn"])
    except Exception as e:  # invalid token
        response = generatePolicy("user", "Deny", event["methodArn"])

    try:
        return json.loads(response)
    except BaseException:
        return "unauthorized"  # Return a 500 error


def generatePolicy(principalId, effect, resource):
    authResponse = {}
    authResponse["principalId"] = principalId
    if effect and resource:
        policyDocument = {}
        policyDocument["Version"] = "2012-10-17"
        policyDocument["Statement"] = []
        statementOne = {}
        statementOne["Action"] = "execute-api:Invoke"
        statementOne["Effect"] = effect
        statementOne["Resource"] = resource
        policyDocument["Statement"] = [statementOne]
        authResponse["policyDocument"] = policyDocument
    authResponse["context"] = {
        "stringKey": "stringval",
        "numberKey": 123,
        "booleanKey": True,
    }
    authResponse["headers"] = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
        "Content-Type": "application/json",
    }
    authResponse_JSON = json.dumps(authResponse)
    return authResponse_JSON
