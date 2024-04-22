# Movie API

This API provides endpoints for managing movies.

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:

git clone https://github.com/glopezvs/MovieAPI.git

2. Navigate to the server directory:

cd api-final/server

3. Install dependencies:

npm install

4. Start the server:

npm run dev

5. Access Swagger documentation:

Swagger documentation is available at http://localhost:PORT/api-docs (replace `PORT` with the port number the server is running on).

## Endpoints

### User

- `POST /auth/users/register`: User registration (No authentication required)
- `POST /auth/users/login`: User login to obtain a JWT. (No authentication required)
- `GET /auth/users`: Fetch a list of users. (Authentication required: Admin)
- `PUT /auth/users/:id `: Update an existing user. (Authentication required: Admin)
- `DELETE /auth/user/:id`: Delete a user. (Authentication required: Admin)

### Movies

- `GET /api/movies`: Fetch all movies. (Only logged users)
- `GET /api/movies/:id`: Fetch a single movie by ID. (Authentication required: Admin)
- `POST /api/movies/create`: Create a new movie. (Authentication required: Admin)
- `PUT /api/movies/:id`: Update an existing movie. (Authentication required: Admin)
- `DELETE /api/movies/:id`: Delete a movie. (Authentication required: Admin)

### Authentication

- `POST /api/auth/register`: Generate JWT token used for further authentication.
