# Intwine

Workflow System

## Usage

```cd frontend```
```npm run dev```

## Todo Board

Done:

- [x] Register for Toll Free Number
- [x] /user/login
- [x] /user/resend_code
- [x] Fix sending Access Token, not working for getUser
- [x] Attatch microsoft graph api to cognito
- [x] Toll free number acquired
- [x] Build out UI for login and register
- [x] Fix token only working for one action issue.
- [x] Fix checking if token expired.
- [x] Expiration check for JWT Authorizer.
- [x] Migrate workspace metadata over to S3 Metadata and remove table.
- [x] When check if msft linked you try to link it automatically if it's not linked
- [x] Make the Cells class based


---

To Do:

- [ ] Write out API docs
- [ ] Add comments to functions
- [ ] Build landing page.
- [ ] Add versioning to workspaces and workspace deployments
- [ ] Calendar data shouldn't be in workspace metadata it should be in workspace json
- [ ] Add time zone support for scheduling
- [ ] Redirection
- [ ] When view scaled and cells moved curves dont properly align




















### Authorization URL For Azure AD Authentication

```
https://celly-microsoft-pool.auth.us-east-1.amazoncognito.com/oauth2/authorize?identity_provider=cellymicrosoftpool&redirect_uri=http://localhost:5173&response_type=TOKEN&client_id=5dfi8s06l6ephu5e5c6vri4aqe&scope=email openid phone
```
