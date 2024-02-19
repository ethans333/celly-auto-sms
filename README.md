# Celly Auto SMS

Automated text messaging system.

[The GANNT Chart](https://docs.google.com/spreadsheets/d/1BHNAObOwO4VI0TWgIXEIb1LyrxmVR_9PMCc-vQX5WZY/edit#gid=0)

- [x] Register for Toll Free Number
- [ ] Toll free number acquired
- [ ] Admin Area
- [ ] Build out UI for the side bar of both cells.

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

### Conversation Table ❌

| id              | user_id            | workspace_id    | phone_number | date                             |
| --------------- | ------------------ | --------------- | ------------ | -------------------------------- |
| Conversation ID | User ID of creator | ID of Workspace | Phone number | Date conversation was first held |

### Conversation Bucket ❌

Saved into the S3 bucket under: `[workspace_id]/[conversation_id]`.
Saved as raw file containing JSON data of the conversation had with the number.

_Note: Pinpoint might save this information for you so keep that in mind._
