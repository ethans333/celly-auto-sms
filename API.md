# Api Documentation

## User

### POST `/user`

Creates a new user. Password must contain uppercase, lowercase, number and special symbol.

```json
{
  "email": "string",
  "password": "string"
}
```

### POST `/user/confirm`

Confirms a users email. `code` comes from email sent to user.

```json
{
  "email": "string",
  "code": "string"
}
```

### POST `/user/login`

Logins in a user, returning relevant information for auth.

```json
{
  "email": "string",
  "password": "string"
}
```

### GET `/user`

Headers:

```json
{
  "Authorization": "string"
}
```

```body
```

## Workspace

## GET `/workspace/{id}`

Gets workspace data.

Headers:

```json
{
  "Authorization": "string"
}
```

Returns:

```json
{
  "message": "string",
  "workspace_description": "string",
  "workspace_name": "string",
  "workspace_raw": "string",
  "is_favorite": "bool"
}
```

## POST `/workspace`

Adds a new workspace.

Headers:

```json
{
  "Authorization": "string"
}
```

Body:

```json
{
  "workspace_description": "string",
  "workspace_name": "string",
  "workspace_raw": "string",
  "is_favorite": "bool"
}
```

Returns:

```json
{
  "message": "string",
  "workspace_id": "string",
}
```

## PUT `/workspace/{id}`

Updates an existing workspace.

Headers:

```json
{
  "Authorization": "string"
}
```

Body:

```json
{
  "workspace_description": "string",
  "workspace_name": "string",
  "workspace_raw": "string",
  "is_favorite": "bool"
}
```

Returns:

```json
{
  "message": "string",
  "workspace_id": "string",
}
```

## GET `/workspace/all`

Gets all user workspaces created by the user.

Headers:

```json
{
  "Authorization": "string"
}
```

Returns:

```json
[
  {
    "workspace_description": "string",
    "workspace_name": "string",
    "is_favorite": "bool"
  },
  ...
]
```