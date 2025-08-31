/**
 * Route for checking if a display name exists
 */
const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const { updateUserDetailsInGames } = require('../controllers/gameController');

/**
 * @route   GET /check-display-name/:displayName
 * @desc    Check if a display name already exists
 * @access  Public
 */
router.get('/check-display-name/:displayName', async (req, res) => {
  try {
    const { displayName } = req.params;
    
    if (!displayName) {
      return res.status(400).json({
        success: false,
        message: 'Display name is required'
      });
    }
    
    // Use the authService to check if the display name already exists
    let result;
    
    try {
      result = await authService.checkDisplayNameExists(displayName);
    } catch (authError) {
      console.error('Error querying Firebase Auth:', authError);
      // If there's an error querying auth, we'll just return no match
      result = {
        exists: false,
        user: null
      };
    }
    
    return res.status(200).json({
      success: true,
      data: {
        exists: result.exists,
        user: result.user
          ? {
              uid: result.user.uid,
              email: result.user.email || '',
              displayName: result.user.displayName || '',
              photoURL: result.user.photoURL || ''
            }
          : null
      }
    });
  } catch (error) {
    console.error('Error checking display name:', error);
    return res.status(500).json({
      success: false,
      message: 'Error checking display name',
      error: error.message
    });
  }
});

module.exports = router;

/**
 * @route   PUT /users/sync-profile/:userId
 * @desc    Update user's email/photoURL (and optional displayName) across all games
 * @access  Authenticated (up to caller to protect)
 */
router.put('/sync-profile/:userId', updateUserDetailsInGames);
