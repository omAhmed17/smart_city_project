# Smart City Project — Auth & User API

A RESTful API for managing citizens in a Smart City platform. Built with Node.js and Express.

## Base URL

http://localhost:3000

---

## Endpoints

### Auth

| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/auth/register | Register a new citizen |
| POST | /api/auth/login | Login |
| POST | /api/auth/logout | Logout |
| POST | /api/auth/forgot-password | Request password reset code |
| POST | /api/auth/reset-password | Confirm password reset |

### Profile

| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/auth/profile?email= | Get profile by email |
| GET | /api/auth/profile?id= | Get profile by ID |
| PUT | /api/auth/profile | Edit own profile |

### Users (Admin)

| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/auth/users | Get all users |
| DELETE | /api/auth/users/:id | Delete a user |
| PUT | /api/auth/users/:id | Full replace a user |
| PATCH | /api/auth/users/:id | Partial update a user |

---

## Request Examples

### Register
POST /api/auth/register
{
  "fullName": "Omar Hassan",
  "email": "omar@smartcity.gov",
  "password": "Password123!",
  "role": "Citizen",
  "phone": "+20 100 000 0000",
  "district": "Sector 2",
  "bio": "Smart city resident."
}

### Login
POST /api/auth/login
{
  "email": "citizen@smartcity.gov",
  "password": "Password123!"
}

### Forgot Password
POST /api/auth/forgot-password
{
  "email": "citizen@smartcity.gov"
}

### Reset Password
POST /api/auth/reset-password
{
  "email": "citizen@smartcity.gov",
  "code": "123456",
  "newPassword": "NewPass456!"
}

### PUT (full update)
PUT /api/auth/users/SC-1001
{
  "fullName": "John Doe",
  "email": "john@smartcity.gov",
  "password": "newPass123",
  "role": "Admin",
  "phone": "+1 555 000 0000",
  "district": "Sector 2",
  "bio": "Updated bio"
}

### PATCH (partial update)
PATCH /api/auth/users/SC-1001
{
  "phone": "+20 111 222 3333"
}

---

## Default Test User

- ID: SC-1001
- Email: citizen@smartcity.gov
- Password: Password123!

---

## Run Locally

npm install
node server.js

Server runs on http://localhost:3000

---

## Tech Stack

- Node.js
- Express.js
