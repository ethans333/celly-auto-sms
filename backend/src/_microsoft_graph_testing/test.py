import json
from datetime import datetime

# def load_json_file(file_path):
#     with open(file_path, "r") as file:
#         data = json.load(file)
#     return data


# events = load_json_file("./events.json")
# events = json.loads(events["events"])

events = [
    {
        "@odata.etag": 'W/"j+wN8IpZqke3ACGZmhQoygAASs9CpQ=="',
        "id": "AAMkAGUzYTgzNGU2LTRhYjEtNDNlYS04NTA3LThkZjJkYjE4NDAzMgBGAAAAAAD7iYGdFQ8fQLMoUULSQWRLBwCP7A3wilmqR7cAIZmaFCjKAAAAAAENAACP7A3wilmqR7cAIZmaFCjKAABK1TbOAAA=",
        "createdDateTime": "2024-04-16T15:03:01.4891023Z",
        "lastModifiedDateTime": "2024-04-16T15:03:02.5929454Z",
        "changeKey": "j+wN8IpZqke3ACGZmhQoygAASs9CpQ==",
        "categories": [],
        "transactionId": "DA5470BA-CD03-8A48-9EFD-3E33EBBAA688",
        "originalStartTimeZone": "Eastern Standard Time",
        "originalEndTimeZone": "Eastern Standard Time",
        "iCalUId": "040000008200E00074C5B7101A82E00800000000170F072D0F90DA0100000000000000001000000065342E68DCFDD046B399CC01309644D5",
        "reminderMinutesBeforeStart": 15,
        "isReminderOn": True,
        "hasAttachments": False,
        "subject": "Gotta eat lunch ",
        "bodyPreview": "",
        "importance": "normal",
        "sensitivity": "normal",
        "isAllDay": False,
        "isCancelled": False,
        "isOrganizer": True,
        "responseRequested": True,
        "seriesMasterId": None,
        "showAs": "busy",
        "type": "singleInstance",
        "webLink": "https://outlook.office365.com/owa/?itemid=AAMkAGUzYTgzNGU2LTRhYjEtNDNlYS04NTA3LThkZjJkYjE4NDAzMgBGAAAAAAD7iYGdFQ8fQLMoUULSQWRLBwCP7A3wilmqR7cAIZmaFCjKAAAAAAENAACP7A3wilmqR7cAIZmaFCjKAABK1TbOAAA%3D&exvsurl=1&path=/calendar/item",
        "onlineMeetingUrl": "",
        "isOnlineMeeting": False,
        "onlineMeetingProvider": "unknown",
        "allowNewTimeProposals": True,
        "occurrenceId": None,
        "isDraft": False,
        "hideAttendees": False,
        "responseStatus": {"response": "organizer", "time": "0001-01-01T00:00:00Z"},
        "body": {"contentType": "html", "content": ""},
        "start": {"dateTime": "2024-04-16T16:00:00.0000000", "timeZone": "UTC"},
        "end": {"dateTime": "2024-04-16T17:00:00.0000000", "timeZone": "UTC"},
        "location": {
            "displayName": "",
            "locationType": "default",
            "uniqueIdType": "unknown",
            "address": {},
            "coordinates": {},
        },
        "locations": [],
        "recurrence": None,
        "attendees": [],
        "organizer": {
            "emailAddress": {
                "name": "Ethan Stein",
                "address": "ethan.stein@techthinktank.com",
            }
        },
        "onlineMeeting": None,
    },
    {
        "@odata.etag": 'W/"j+wN8IpZqke3ACGZmhQoygAAJWN3bw=="',
        "id": "AAMkAGUzYTgzNGU2LTRhYjEtNDNlYS04NTA3LThkZjJkYjE4NDAzMgFRAAgI3F5xUzQAAEYAAAAA_4mBnRUPH0CzKFFC0kFkSwcAj_wN8IpZqke3ACGZmhQoygAAAAABDQAAj_wN8IpZqke3ACGZmhQoygAAH1-5swAAEA==",
        "createdDateTime": "2024-02-06T15:30:20.9494842Z",
        "lastModifiedDateTime": "2024-02-14T18:55:49.733218Z",
        "changeKey": "j+wN8IpZqke3ACGZmhQoygAAJWN3bw==",
        "categories": [],
        "transactionId": None,
        "originalStartTimeZone": "Eastern Standard Time",
        "originalEndTimeZone": "Eastern Standard Time",
        "iCalUId": "040000008200E00074C5B7101A82E00807E804110013E153E758DA010000000000000000100000008C5EAEB7D46D5B44A8CFDACAD8401298",
        "reminderMinutesBeforeStart": 15,
        "isReminderOn": True,
        "hasAttachments": False,
        "subject": "On-going Dev Meeting",
        "bodyPreview": "On-going meeting for Project Celly\\r\\n________________________________________________________________________________\\r\\nMicrosoft Teams meeting\\r\\nJoin on your computer, mobile app or room device\\r\\nClick here to join the meeting\\r\\nMeeting ID: 274 077 657 674\\r\\nP",
        "importance": "normal",
        "sensitivity": "normal",
        "isAllDay": False,
        "isCancelled": False,
        "isOrganizer": False,
        "responseRequested": True,
        "seriesMasterId": "AAMkAGUzYTgzNGU2LTRhYjEtNDNlYS04NTA3LThkZjJkYjE4NDAzMgBGAAAAAAD7iYGdFQ8fQLMoUULSQWRLBwCP7A3wilmqR7cAIZmaFCjKAAAAAAENAACP7A3wilmqR7cAIZmaFCjKAAAfX-mzAAA=",
        "showAs": "tentative",
        "type": "occurrence",
        "webLink": "https://outlook.office365.com/owa/?itemid=AAMkAGUzYTgzNGU2LTRhYjEtNDNlYS04NTA3LThkZjJkYjE4NDAzMgFRAAgI3F5xUzQAAEYAAAAA%2B4mBnRUPH0CzKFFC0kFkSwcAj%2BwN8IpZqke3ACGZmhQoygAAAAABDQAAj%2BwN8IpZqke3ACGZmhQoygAAH1%2F5swAAEA%3D%3D&exvsurl=1&path=/calendar/item",
        "onlineMeetingUrl": None,
        "isOnlineMeeting": True,
        "onlineMeetingProvider": "teamsForBusiness",
        "allowNewTimeProposals": True,
        "occurrenceId": "OID.AAMkAGUzYTgzNGU2LTRhYjEtNDNlYS04NTA3LThkZjJkYjE4NDAzMgBGAAAAAAD7iYGdFQ8fQLMoUULSQWRLBwCP7A3wilmqR7cAIZmaFCjKAAAAAAENAACP7A3wilmqR7cAIZmaFCjKAAAfX-mzAAA=.2024-04-17",
        "isDraft": False,
        "hideAttendees": False,
        "responseStatus": {
            "response": "notResponded",
            "time": "2024-02-06T16:50:28.1953376Z",
        },
        "body": {
            "contentType": "html",
            "content": '<html>\\r\\n<head>\\r\\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\\r\\n<meta name="Generator" content="Microsoft Word 15 (filtered medium)">\\r\\n<style>\\r\\n<!--\\r\\n@font-face\\r\\n\\t{font-family:"Cambria Math"}\\r\\n@font-face\\r\\n\\t{font-family:Calibri}\\r\\n@font-face\\r\\n\\t{font-family:"Segoe UI"}\\r\\n@font-face\\r\\n\\t{font-family:"Segoe UI Semibold"}\\r\\np.MsoNormal, li.MsoNormal, div.MsoNormal\\r\\n\\t{margin:0in;\\r\\n\\tfont-size:11.0pt;\\r\\n\\tfont-family:"Calibri",sans-serif}\\r\\na:link, span.MsoHyperlink\\r\\n\\t{color:#0563C1;\\r\\n\\ttext-decoration:underline}\\r\\nspan.EmailStyle18\\r\\n\\t{}\\r\\n.MsoChpDefault\\r\\n\\t{font-size:10.0pt}\\r\\n@page WordSection1\\r\\n\\t{margin:1.0in 1.0in 1.0in 1.0in}\\r\\ndiv.WordSection1\\r\\n\\t{}\\r\\n-->\\r\\n</style>\\r\\n</head>\\r\\n<body lang="EN-US" link="#0563C1" vlink="#954F72" style="word-wrap:break-word">\\r\\n<div class="WordSection1">\\r\\n<p class="MsoNormal">On-going meeting for Project Celly</p>\\r\\n<div>\\r\\n<p class="MsoNormal"><span style="color:#5F5F5F">________________________________________________________________________________</span>\\r\\n</p>\\r\\n</div>\\r\\n<div>\\r\\n<div style="margin-top:.25in; margin-bottom:15.0pt">\\r\\n<p class="MsoNormal"><span style="font-size:18.0pt; font-family:&quot;Segoe UI&quot;,sans-serif; color:#252424">Microsoft Teams meeting</span><span style="font-family:&quot;Segoe UI&quot;,sans-serif; color:#252424">\\r\\n</span></p>\\r\\n</div>\\r\\n<div style="margin-bottom:15.0pt">\\r\\n<div>\\r\\n<p class="MsoNormal"><b><span style="font-size:10.5pt; font-family:&quot;Segoe UI&quot;,sans-serif; color:#252424">Join on your computer, mobile app or room device</span></b><b><span style="font-family:&quot;Segoe UI&quot;,sans-serif; color:#252424">\\r\\n</span></b></p>\\r\\n</div>\\r\\n<p class="MsoNormal"><span style="font-family:&quot;Segoe UI&quot;,sans-serif; color:#252424"><a href="https://teams.microsoft.com/l/meetup-join/19%3ameeting_MWZjMzhkNTYtMWRkMC00MDcxLWI5OTQtYmE3MzExMjNlZWMx%40thread.v2/0?context=%7b%22Tid%22%3a%223ad366d6-82f4-4d9a-a95a-95bede9afda3%22%2c%22Oid%22%3a%22b5f50d54-d106-465f-9971-b27227b81e25%22%7d"><span style="font-size:10.5pt; font-family:&quot;Segoe UI Semibold&quot;,sans-serif; color:#6264A7">Click\\r\\n here to join the meeting</span></a> </span></p>\\r\\n</div>\\r\\n<div style="margin-top:15.0pt; margin-bottom:15.0pt">\\r\\n<div style="margin-bottom:3.0pt">\\r\\n<p class="MsoNormal"><span style="font-size:10.5pt; font-family:&quot;Segoe UI&quot;,sans-serif; color:#252424">Meeting ID:\\r\\n</span><span style="font-size:12.0pt; font-family:&quot;Segoe UI&quot;,sans-serif; color:#252424">274 077 657 674</span><span style="font-size:10.5pt; font-family:&quot;Segoe UI&quot;,sans-serif; color:#252424">\\r\\n</span><span style="font-family:&quot;Segoe UI&quot;,sans-serif; color:#252424"><br>\\r\\n</span><span style="font-size:10.5pt; font-family:&quot;Segoe UI&quot;,sans-serif; color:#252424">Passcode:\\r\\n</span><span style="font-size:12.0pt; font-family:&quot;Segoe UI&quot;,sans-serif; color:#252424">9Kejsh\\r\\n</span><span style="font-family:&quot;Segoe UI&quot;,sans-serif; color:#252424"></span></p>\\r\\n<div>\\r\\n<p class="MsoNormal"><span style="font-size:10.5pt; font-family:&quot;Segoe UI&quot;,sans-serif; color:#252424"><a href="https://www.microsoft.com/en-us/microsoft-teams/download-app"><span style="color:#6264A7">Download Teams</span></a> |\\r\\n<a href="https://www.microsoft.com/microsoft-teams/join-a-meeting"><span style="color:#6264A7">Join on the web</span></a></span></p>\\r\\n</div>\\r\\n</div>\\r\\n</div>\\r\\n<div style="margin-top:15.0pt; margin-bottom:.25in">\\r\\n<p class="MsoNormal"><span style="font-family:&quot;Segoe UI&quot;,sans-serif; color:#252424"><a href="https://aka.ms/JoinTeamsMeeting"><span style="font-size:10.5pt; color:#6264A7">Learn More</span></a> |\\r\\n<a href="https://teams.microsoft.com/meetingOptions/?organizerId=b5f50d54-d106-465f-9971-b27227b81e25&amp;tenantId=3ad366d6-82f4-4d9a-a95a-95bede9afda3&amp;threadId=19_meeting_MWZjMzhkNTYtMWRkMC00MDcxLWI5OTQtYmE3MzExMjNlZWMx@thread.v2&amp;messageId=0&amp;language=en-US">\\r\\n<span style="font-size:10.5pt; color:#6264A7">Meeting options</span></a> </span></p>\\r\\n</div>\\r\\n</div>\\r\\n<div>\\r\\n<p class="MsoNormal"><span style="color:#5F5F5F">________________________________________________________________________________</span>\\r\\n</p>\\r\\n</div>\\r\\n<p class="MsoNormal">&nbsp;</p>\\r\\n</div>\\r\\n</body>\\r\\n</html>\\r\\n',
        },
        "start": {"dateTime": "2024-04-17T17:30:00.0000000", "timeZone": "UTC"},
        "end": {"dateTime": "2024-04-17T18:00:00.0000000", "timeZone": "UTC"},
        "location": {
            "displayName": "Microsoft Teams Meeting",
            "locationType": "default",
            "uniqueId": "Microsoft Teams Meeting",
            "uniqueIdType": "private",
        },
        "locations": [
            {
                "displayName": "Microsoft Teams Meeting",
                "locationType": "default",
                "uniqueId": "Microsoft Teams Meeting",
                "uniqueIdType": "private",
            }
        ],
        "recurrence": None,
        "attendees": [
            {
                "type": "required",
                "status": {"response": "none", "time": "0001-01-01T00:00:00Z"},
                "emailAddress": {
                    "name": "Josh Lazar",
                    "address": "josh@techthinktank.com",
                },
            },
            {
                "type": "required",
                "status": {"response": "none", "time": "0001-01-01T00:00:00Z"},
                "emailAddress": {
                    "name": "Ethan Stein",
                    "address": "ethan.stein@techthinktank.com",
                },
            },
            {
                "type": "optional",
                "status": {"response": "none", "time": "0001-01-01T00:00:00Z"},
                "emailAddress": {
                    "name": "Arthur Thompson",
                    "address": "arthurwthompson@gmail.com",
                },
            },
        ],
        "organizer": {
            "emailAddress": {"name": "Josh Lazar", "address": "josh@techthinktank.com"}
        },
        "onlineMeeting": {
            "joinUrl": "https://teams.microsoft.com/l/meetup-join/19%3ameeting_MWZjMzhkNTYtMWRkMC00MDcxLWI5OTQtYmE3MzExMjNlZWMx%40thread.v2/0?context=%7b%22Tid%22%3a%223ad366d6-82f4-4d9a-a95a-95bede9afda3%22%2c%22Oid%22%3a%22b5f50d54-d106-465f-9971-b27227b81e25%22%7d"
        },
    },
]


def datetime_to_milliseconds(datetime_str):
    datetime_str = datetime_str.split(".")[0]
    dt_object = datetime.strptime(datetime_str, "%Y-%m-%dT%H:%M:%S")

    # Convert datetime object to milliseconds since the epoch
    milliseconds = int(dt_object.timestamp() * 1000)
    return milliseconds


def convert_time_to_milliseconds(start_time, end_time):
    start_ms = datetime_to_milliseconds(start_time["dateTime"])
    end_ms = datetime_to_milliseconds(end_time["dateTime"])
    return start_ms, end_ms


event_times = []

for event in events:
    start_ms, end_ms = convert_time_to_milliseconds(event["start"], event["end"])
    event_times.append((start_ms, end_ms))

print(event_times)
