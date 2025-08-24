const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

/**
 * Initializes Firebase Admin SDK
 * 
 * This can be done in two ways:
 * 1. Using a service account file
 * 2. Using environment variables (recommended for production)
 */
const initFirebase = () => {
  try {
    // Check if we already initialized
    if (admin.apps.length > 0) {
      return admin;
    }

    // Method 1: Using a service account file
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    
    if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
      const serviceAccount = require(serviceAccountPath);
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL
      });
      
      console.log('Firebase Admin initialized successfully using service account file');
    } 
    // Method 2: Using environment variables
    else if (process.env.FIREBASE_PROJECT_ID) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL
      });
      
      console.log('Firebase Admin initialized successfully using environment variables');
    } else {
      console.error('Firebase credentials not found. Please check your environment variables or service account file.');
    }
    
    return admin;
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    throw error;
  }
};

module.exports = { 
  initFirebase,
  admin
};
