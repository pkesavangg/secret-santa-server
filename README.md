# Secret Santa Server

A Node.js API server for managing Secret Santa gift exchanges.

## Planned Features

- User registration and authentication with Firebase
- Create and manage Secret Santa groups
- Add participants to groups
- Randomly assign Secret Santa pairs
- Set budget and exchange dates
- Manage wishlists

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- Firebase account (to be set up later)
- MongoDB (to be set up later)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/secret-santa-server.git
cd secret-santa-server
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory and add the following:
```
PORT=3000
NODE_ENV=development
# Firebase and MongoDB configuration will be added later
```

### Running the server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Current Functionality

- Basic Express server setup
- Health check endpoint at `GET /health`
- Placeholder for future API implementation

## Planned API Endpoints

### Users
- Firebase Authentication will be used for user management

### Groups
- `POST /api/groups` - Create a new Secret Santa group
- `GET /api/groups` - Get all groups
- `GET /api/groups/:id` - Get a specific group
- `PUT /api/groups/:id` - Update a group

## Testing

Run tests:
```bash
npm test
```

## Project Structure

```
secret-santa-server/
├── src/
│   ├── config/        # Configuration files
│   ├── controllers/   # Route controllers
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── middlewares/   # Middleware functions
│   ├── utils/         # Utility functions
│   └── index.js       # Main server file
├── tests/             # Test files
├── .env               # Environment variables
└── package.json       # Project dependencies
```

## License

This project is licensed under the ISC License.
