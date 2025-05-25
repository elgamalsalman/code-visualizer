# Development Notes

## Authentication

types:

- email password
- university login (coming soon)

## Authorization

JWTs were used, forming access and refresh tokens:

- access tokens:
  - short-lived
  - hash-based verified so no hits on speed
  - can't be revoked since hash-based verified and therefore has to be short-lived
- refresh tokens:
  - long-lived (day or more)
  - can be used to re-generate access tokens
  - require re-logging-in when they expire
  - hash-based verified with secret key looked up from table (authorization_secret)
  - can be revoked by changing the authorization_secret of the user

all tokens are saved in http-only cookies

process:

1. when user logs in generate access token and new refresh token
2. when a request is received verify access token
   - verified: process request
   - denied: verify refresh token
     - verified: produce new access token and process request
     - denied: return unauthorised and ask to re-login

security analysis:

1. if access token is compromised then hacker has inevitable access for short-period
2. if refresh token is compromised then hacker has acces for long period which if
   reported can be stopped by changing user's authorization_secret
3. if user's authorization_secret is compromised (highly unlikely since it doesn't go
   through network), then hacker has potentially forever access unless reported by
   user

Also DB is only accessed after every refresh of access token and therefore after every
short-lived duration which is acceptable.

**Advantages of this system:**

- secure
- fast
- revokable
