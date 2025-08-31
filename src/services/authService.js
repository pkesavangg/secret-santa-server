/**
 * Authentication Service
 * Simplified version that only checks for display names
 */

const { admin, initFirebase } = require('../config/firebase');

class AuthService {
  constructor() {
    // Initialize Firebase
    initFirebase();
    this.auth = admin.auth();
  }

  /**
   * Check if a display name already exists among users
   * @param {string} displayName - The display name to check
   * @returns {Promise<Object>} Object with exists flag and user data if found
   */
  async checkDisplayNameExists(displayName) {
    try {
      if (!displayName) {
        return false;
      }
      
      // Firebase Auth doesn't provide a direct way to query users by displayName
      // So we need to list all users and check each one
      const displayNameLower = displayName.toLowerCase();
      let existingUser = null;
      
      // Get all users (with pagination if needed)
      let pageToken = undefined;
      do {
        const result = await this.auth.listUsers(1000, pageToken);
        
        // Search for a user with the given display name
        existingUser = result.users.find(user => 
          user.displayName && user.displayName.toLowerCase() === displayNameLower
        );
        
        if (existingUser) {
          // Found a match
          return {
            exists: true,
            user: {
              uid: existingUser.uid,
              email: existingUser.email || '',
              displayName: existingUser.displayName,
              photoURL: existingUser.photoURL || ''
            }
          };
        }
        
        // Continue with next page if available
        pageToken = result.pageToken;
      } while (pageToken);
      
      // No match found
      return { 
        exists: false,
        user: null
      };
    } catch (error) {
      console.error('Error checking display name:', error);
      throw error;
    }
  }

  /**
   * Get a public profile for a Firebase user (uid, email, displayName, photoURL)
   * @param {string} userId
   * @returns {Promise<{uid: string, email: string, displayName: string, photoURL: string}>}
   */
  async getUserPublicProfile(userId) {
    try {
      if (!userId) {
        return { uid: '', email: '', displayName: '', photoURL: '' };
      }
      const userRecord = await this.auth.getUser(userId);
      return {
        uid: userRecord.uid,
        email: userRecord.email || '',
        displayName: userRecord.displayName || '',
        photoURL: userRecord.photoURL || ''
      };
    } catch (error) {
      // On failure, return minimal with uid and blanks
      return { uid: userId, email: '', displayName: '', photoURL: '' };
    }
  }

  /**
   * Get a user's display name by Firebase Auth user ID
   * @param {string} userId - Firebase Auth UID
   * @returns {Promise<string|null>} The display name if available, otherwise null
   */
  async getDisplayNameByUserId(userId) {
    try {
      if (!userId) {
        return null;
      }

      const userRecord = await this.auth.getUser(userId);
      return userRecord.displayName || null;
    } catch (error) {
      console.error('Error fetching user by ID from Firebase Auth:', error);
      // Return null so callers can decide a fallback
      return null;
    }
  }
}

module.exports = new AuthService();
