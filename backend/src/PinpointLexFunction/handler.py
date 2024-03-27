import json
import boto3
import base64
import gzip 
import json

def handler(event, context):
    lex = boto3.client('lexv2-runtime')

    message = json.loads(event['Records'][0]['Sns']['Message'])
    origination_number = message['originationNumber']
    user_id = origination_number.replace("+1", "")
    message_body = message['messageBody']

    try:
        response = lex.recognize_utterance(
            botId='STPJGYCE7A',
            botAliasId='L2XMJ3KLRZ',
            localeId='en_US',
            sessionId=user_id,
            requestContentType='text/plain; charset=utf-8',
            inputStream=message_body,
        )
        
        # Extract interpretations 
        interpretations = response["interpretations"] 

        # Decode from base64
        decoded = base64.b64decode(interpretations)

        # Decompress gzip 
        decompressed = gzip.decompress(decoded)

        # Parse JSON  
        data = json.loads(decompressed)
        
        print(response)
        
        return {
            "result": str(data)
        }
        
    except Exception as e:
        print(e)
        return {
            "error": str(e)
        }