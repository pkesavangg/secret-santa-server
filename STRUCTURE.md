# Project Structure

This document outlines the project structure for the Secret Santa API server.

```
secret-santa-server/
├── src/
│   ├── config/            # Configuration files
│   │   ├── firebase.js    # Firebase configuration (to be implemented)
│   │   └── db.js          # Database configuration (to be implemented)
│   │
│   ├── controllers/       # Route controllers (to be implemented)
│   │   ├── userController.js
│   │   └── groupController.js
│   │
│   ├── models/            # Data models (to be implemented)
│   │   ├── userModel.js
│   │   └── groupModel.js
│   │
│   ├── routes/            # API routes (to be implemented)
│   │   ├── userRoutes.js
│   │   └── groupRoutes.js
│   │
│   ├── middlewares/       # Middleware functions (to be implemented)
│   │   └── authMiddleware.js
│   │
│   ├── utils/             # Utility functions (to be implemented)
│   │   └── secretSantaUtils.js
│   │
│   └── index.js           # Main server file
│
├── tests/                 # Test files (to be implemented)
│
├── .env                   # Environment variables
├── .gitignore             # Git ignore file
├── package.json           # Project dependencies
├── README.md              # Project documentation
└── ROADMAP.md             # Implementation roadmap
```

This structure follows a modular approach that separates concerns and makes the codebase maintainable and scalable.
