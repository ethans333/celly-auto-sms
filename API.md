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
