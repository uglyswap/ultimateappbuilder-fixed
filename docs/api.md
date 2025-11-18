# API Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication

Currently in development. All endpoints are publicly accessible.

## Endpoints

### Projects

#### Create Project

```http
POST /api/projects
```

**Request Body:**

```json
{
  "name": "my-app",
  "description": "My awesome app",
  "template": "SAAS",
  "features": [
    {
      "id": "auth",
      "name": "Authentication",
      "enabled": true
    }
  ],
  "database": {
    "type": "postgresql",
    "database": "myapp_db"
  },
  "auth": {
    "providers": ["email", "google"]
  }
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "id": "proj_123",
    "name": "my-app",
    "status": "DRAFT",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### List Projects

```http
GET /api/projects
```

#### Get Project

```http
GET /api/projects/:id
```

#### Generate Code

```http
POST /api/projects/:id/generate
```

#### Download Project

```http
GET /api/projects/:id/download
```

### Templates

#### List Templates

```http
GET /api/templates
```

#### Get Template

```http
GET /api/templates/:id
```

### Generations

#### List Generations

```http
GET /api/generations
```

#### Get Generation

```http
GET /api/generations/:id
```

## Error Responses

```json
{
  "status": "error",
  "message": "Error description"
}
```

## Rate Limiting

- 100 requests per 15 minutes per IP
- Configurable via environment variables
