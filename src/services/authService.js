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
              email: existingUser.email,
              displayName: existingUser.displayName
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
}

module.exports = new AuthService();
