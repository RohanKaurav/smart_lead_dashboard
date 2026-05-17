# API Reference

Base URL (local): `http://localhost:4000/api`

## Auth

### POST `/auth/register`
Create a sales user account.

Request body:
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "password123"
}
```

### POST `/auth/login`
Login with email/password.

Request body:
```json
{
  "email": "rahul@example.com",
  "password": "password123"
}
```

### GET `/auth/me`
Get current user profile.

Headers:
- `Authorization: Bearer <token>`

## Admin

### GET `/admin/overview`
Admin-only overview of users and role counts.

Headers:
- `Authorization: Bearer <admin-token>`

## Health

### GET `/health`
Service and database connectivity status.

## Leads

All lead endpoints require:
- `Authorization: Bearer <token>`

### GET `/leads`
List leads with filters and pagination.

Query parameters:
- `page` (number, default `1`)
- `status` (`new` | `contacted` | `qualified` | `lost`)
- `source` (`website` | `instagram` | `referral`)
- `search` (string; searches `name` and `email`)
- `sort` (`latest` | `oldest`, default `latest`)

Example:
```bash
curl "http://localhost:4000/api/leads?status=qualified&source=instagram&search=rahul&sort=latest&page=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### GET `/leads/export`
Export all filtered leads to CSV (no pagination in export).

Query parameters:
- `status`
- `source`
- `search`
- `sort`

Example:
```bash
curl "http://localhost:4000/api/leads/export?status=qualified&sort=latest" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o leads.csv
```

### GET `/leads/:id`
Fetch one lead by id.

### POST `/leads`
Create a lead.

Request body:
```json
{
  "name": "Priya Singh",
  "email": "priya@example.com",
  "status": "new",
  "source": "website"
}
```

### PATCH `/leads/:id`
Update one or more lead fields.

Request body example:
```json
{
  "status": "contacted",
  "source": "referral"
}
```

### DELETE `/leads/:id`
Delete a lead (admin only).

## Response shape

Success:
```json
{
  "success": true,
  "data": {}
}
```

Paginated success (`GET /leads`):
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

Error:
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    { "field": "email", "message": "Invalid email address" }
  ]
}
```
