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

3. Set up Firebase Admin SDK
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Select your project (or create a new one)
   - Go to Project Settings > Service accounts
   - Click "Generate new private key" and save the JSON file
   - Rename the file to `serviceAccountKey.json` and place it in a secure location

4. Create a `.env` file in the root directory using the example file as a template:
```bash
cp src/.env.example .env
```

5. Update the `.env` file with your Firebase configuration:
```
PORT=3000
NODE_ENV=development

# Option 1: Use service account file path
FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/serviceAccountKey.json

# Option 2: Use environment variables (recommended for production)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
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
- Firebase authentication integration
- User management API endpoints

## API Endpoints

### Authentication
Authentication is handled using Firebase Auth. To authenticate requests, include the Firebase ID token in the Authorization header:
```
Authorization: Bearer <firebase_id_token>
```

### Users
- `GET /api/users/profile` - Get current user profile
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:uid` - Get user by ID (admin only)
- `POST /api/users` - Create a new user (admin only)
- `PUT /api/users/:uid` - Update a user (admin only)
- `DELETE /api/users/:uid` - Delete a user (admin only)

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
