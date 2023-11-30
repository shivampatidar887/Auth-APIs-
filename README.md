# Auth-APIs-
## Usage

### Install dependencies
```
npm install
```

### Run Server 
```
npm start
```
## Overview

This repository comprises the backend implementation of a user authentication system, leveraging Express.js, Node.js, and MongoDB. The project features secure APIs for user authentication, including login, logout, and account deletion. Passwords are encrypted using bcrypt.js for enhanced security, and JSON Web Tokens (JWT) facilitate secure session management.

## Technologies Used

- **Node.js:** A powerful runtime for server-side JavaScript.
- **Express.js:** A robust web application framework for Node.js.
- **MongoDB:** A NoSQL database utilized for storing user information securely.
- **bcrypt.js:** A library for hashing passwords, enhancing data protection.
- **JSON Web Tokens (JWT):** Ensures secure authentication and session management.
- **Environment Configuration:** Utilizes environment files for managing configuration variables.

## Key Features

1. **User Authentication:**
   - Secure APIs for user authentication, including login, logout, and account deletion.
   - Passwords encrypted using bcrypt.js for enhanced security.
   - JWT-based session management for a secure and scalable authentication system.

2. **MongoDB Model Validation:**
   - Robust validation integrated into MongoDB models for data integrity.
   - Ensures that only valid data is stored, reducing the risk of data inconsistencies.

## Project Structure

- **`models/`:** Houses Mongoose models for User data, ensuring data consistency.
- **`controllers/`:** Defines controllers to handle API logic related to user authentication.
- **`routes/`:** Configures Express Router for routing API requests to the corresponding controllers.
- **`.env`:** Environment file for securely storing configuration variables.

