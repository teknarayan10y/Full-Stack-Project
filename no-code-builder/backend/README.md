# No-Code App Builder Backend

This is the backend API for the No-Code App Builder platform, allowing users to create applications without writing code.

## Features

- User authentication and authorization
- Project management (create, read, update, delete)
- Component management (built-in and custom components)
- Page management within projects
- Project publishing

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/no-code-builder
   JWT_SECRET=your_jwt_secret_key
   ```

### Running the Server

Development mode:
```
npm run dev
```

Production mode:
```
npm start
```

### Seeding the Database

To seed the database with initial components:
```
node src/utils/seedComponents.js
```

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login and get token
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)
- `PUT /api/users/password` - Change password (protected)

### Projects

- `GET /api/projects` - Get all projects (protected)
- `GET /api/projects/user/:userId` - Get projects by user (protected)
- `GET /api/projects/:id` - Get a single project (protected)
- `POST /api/projects` - Create a new project (protected)
- `PUT /api/projects/:id` - Update a project (protected)
- `DELETE /api/projects/:id` - Delete a project (protected)
- `POST /api/projects/:id/pages` - Add a page to a project (protected)
- `PUT /api/projects/:id/pages/:pageId` - Update a page (protected)
- `DELETE /api/projects/:id/pages/:pageId` - Delete a page (protected)
- `PUT /api/projects/:id/publish` - Publish a project (protected)

### Components

- `GET /api/components` - Get all components
- `GET /api/components/category/:category` - Get components by category
- `GET /api/components/user/:userId` - Get user's custom components (protected)
- `GET /api/components/:id` - Get a single component
- `POST /api/components` - Create a new component (protected)
- `PUT /api/components/:id` - Update a component (protected)
- `DELETE /api/components/:id` - Delete a component (protected)
- `POST /api/components/:id/clone` - Clone a component (protected)

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── server.js        # Express app
├── .env                 # Environment variables
└── package.json         # Dependencies and scripts
```
