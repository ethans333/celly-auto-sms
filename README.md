# Celly Auto SMS

Automated text messaging system.

[The GANNT Chart](https://docs.google.com/spreadsheets/d/1BHNAObOwO4VI0TWgIXEIb1LyrxmVR_9PMCc-vQX5WZY/edit#gid=0)

- [x] Register for Toll Free Number
- [ ] Toll free number acquired
- [ ] Admin Area
- [ ] Build out UI for the side bar of both cells.
- [ ] /user/login
- [ ] /user/resend_code
- [ ] Attatch microsoft graph api to cognito
- [ ] Build out UI for login and register
- [ ] Build landing page

| ✔️   | ❌       |
| ---- | -------- |
| Done | Not Done |

### WorkspacesTable ✔️

| id           | user_id            | workspace_name    | workspace_description    |
| ------------ | ------------------ | ----------------- | ------------------------ |
| Workspace ID | User ID of creator | Name of Workspace | Description of Workspace |

### Workspaces Bucket ✔️

Saved into the S3 bucket under: `[user_id]/[workspace_id]`.
Saved as raw file containing JSON data representing the state of workspace.

**Workspace structure**:

```ts
{
    [cell_id]: {
        "type": "texting" || "calendar",
        "title": String,
        "prompt": String,
        "emoji": String,
        "tags": String[],
        "position": {
            "x": Int,
            "y": Int
        },
        "nodes": {
            [node_id]: {
                "next": {
                    [node_id]: String,
                    ...
                },
                "prev": {
                    [node_id]: String,
                    ...
                }
            }
            ...
        }
    },
    ...
}

```

### Conversation Table ✔️

| id              | phone        | date_registered                            | last_contacted                 | city           | state           | workspace_id                            |
| --------------- | ------------ | ------------------------------------------ | ------------------------------ | -------------- | --------------- | --------------------------------------- |
| Conversation ID | Phone number | Date the number first registered for texts | Date the number last contacted | City of origin | State of origin | Workspace where conversation was based. |

### Conversation Bucket ✔️

Saved into the S3 bucket under: `[workspace_id]/[conversation_id]`.
Saved as raw file containing JSON data of the conversation had with the number.

_Note: Pinpoint might save this information for you so keep that in mind._

**Conversation structure**:

```ts
[
    {
        "datetime": String,
        "message": String,
        "isClient": Boolean,
    },
  ...
]
```
