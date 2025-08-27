/**
 * Game Controller - Handles game-related operations
 */

// In-memory storage for games (temporary until MongoDB integration)
const games = [];

// Generate a unique game code
const generateGameCode = () => {
  // Generate a random 6-character alphanumeric code
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

/**
 * Create a new game with the requesting user as admin and participant
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const authService = require('../services/authService');

const createGame = async (req, res) => {
  try {
    // Extract userId and userName from request body
    const { userId, userName } = req.body;
    
    if (!userId) {
      return res.status(400).json({ 
        status: 'error',
        message: 'User ID is required to create a game'
      });
    }

    // Create a new game object (for now, just in memory)
    const gameCode = generateGameCode();
    const currentDate = new Date();
    
    // Resolve admin display name: prefer Firebase name via userId, then provided userName, else fallback
    let resolvedDisplayName = userName;
    try {
      const firebaseName = await authService.getDisplayNameByUserId(userId);
      if (firebaseName && firebaseName.trim().length > 0) {
        resolvedDisplayName = firebaseName;
      }
    } catch (e) {
      // Ignore and use provided or fallback
    }

    const newGame = {
      gameId: `game_${Date.now()}`,
      gameCode,
      name: req.body.name || `Secret Santa Game ${gameCode}`,
      createdAt: currentDate,
      updatedAt: currentDate,
      admin: userId,
      status: 'created', // created, active, completed
      participants: [{
        userId,
        displayName: resolvedDisplayName || `User ${userId}`,
        joinedAt: currentDate,
        isAdmin: true,
        assignedUserId: null, // will be assigned during matching
        dareMessage: '', // dare message to complete
        dareCompleted: false // whether the dare has been completed or not
      }],
      maxParticipants: req.body.maxParticipants || 20,
      minPrice: req.body.minPrice || 0,
      maxPrice: req.body.maxPrice || 0,
      currency: req.body.currency || 'USD',
      description: req.body.description || '',
      eventDate: req.body.eventDate || null,
      isMatchingDone: false
    };

    // Add the new game to our in-memory storage
    games.push(newGame);

    // Return the created game (in a real implementation, we would save to MongoDB first)
    res.status(201).json({
      status: 'success',
      message: 'Game created successfully',
      data: {
        game: newGame
      }
    });
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create game',
      error: error.message
    });
  }
};

/**
 * Get all games a user is participating in
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserGames = (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ 
        status: 'error',
        message: 'User ID is required'
      });
    }
    
    // Find all games where user is a participant
    const userGames = games.filter(game => 
      game.participants.some(participant => participant.userId === userId)
    );
    
    // Find all games where user is an admin
    const adminGames = games.filter(game => game.admin === userId);
    
    res.status(200).json({
      status: 'success',
      data: {
        participatingGames: userGames,
        adminGames: adminGames,
        isParticipatingInAnyGame: userGames.length > 0
      }
    });
  } catch (error) {
    console.error('Error fetching user games:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user games',
      error: error.message
    });
  }
};

/**
 * Add a participant to an existing game
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const addParticipant = async (req, res) => {
  try {
    const { gameId: gameCode } = req.params;
    const { userId, userName } = req.body;
    
    if (!gameCode) {
      return res.status(400).json({
        status: 'error',
        message: 'Game ID is required'
      });
    }
    
    if (!userId) {
      return res.status(400).json({
        status: 'error',
        message: 'User ID is required'
      });
    }
    
    // Find the game by code
    const gameIndex = games.findIndex(game => game.gameCode === gameCode);
    
    if (gameIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Game not found'
      });
    }
    
    const game = games[gameIndex];
    
    // Check if the game has reached max participants
    if (game.participants.length >= game.maxParticipants) {
      return res.status(400).json({
        status: 'error',
        message: 'Game has reached maximum number of participants'
      });
    }
    
    // Check if user is already a participant
    if (game.participants.some(participant => participant.userId === userId)) {
      return res.status(400).json({
        status: 'error',
        message: 'User is already a participant in this game'
      });
    }
    
    // Check if game is still accepting participants
    if (game.status !== 'created') {
      return res.status(400).json({
        status: 'error',
        message: 'Game is not accepting new participants at this time'
      });
    }
    
    const currentDate = new Date();

    // Resolve participant display name from Firebase using userId; fall back to provided or generic
    let resolvedDisplayName = userName;
    try {
      const firebaseName = await authService.getDisplayNameByUserId(userId);
      if (firebaseName && firebaseName.trim().length > 0) {
        resolvedDisplayName = firebaseName;
      }
    } catch (e) {
      // Ignore and use provided or fallback
    }

    // Add the new participant
    const newParticipant = {
      userId,
      displayName: resolvedDisplayName || `User ${userId}`,
      joinedAt: currentDate,
      isAdmin: false,
      assignedUserId: null,
      dareMessage: '',
      dareCompleted: false
    };
    
    // Add participant to the game
    games[gameIndex].participants.push(newParticipant);
    games[gameIndex].updatedAt = currentDate;
    
    res.status(200).json({
      status: 'success',
      message: 'Participant added successfully',
      data: {
        game: games[gameIndex]
      }
    });
  } catch (error) {
    console.error('Error adding participant:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to add participant',
      error: error.message
    });
  }
};

module.exports = {
  createGame,
  getUserGames,
  addParticipant
};

/**
 * Generate symmetric assignments (pairings) for the latest eligible admin game
 * Rules:
 * - User must be admin of an eligible game (status: created, isMatchingDone: false)
 * - Participants count must be even and >= 2
 * - Pairings are symmetric: if A -> B then B -> A
 * - After assignment: game.status becomes 'active' and isMatchingDone becomes true
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const generateChildren = (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        status: 'error',
        message: 'User ID is required'
      });
    }

    // Find games where user is admin
    const adminGames = games.filter(g => g.admin === userId);

    if (adminGames.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No games found where user is admin'
      });
    }

    // Pick the most recently created eligible game (status created and not matched yet)
    const eligibleGames = adminGames
      .filter(g => g.status === 'created' && !g.isMatchingDone)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (eligibleGames.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No eligible games to generate children (already active/completed or none exists)'
      });
    }

    const targetGame = eligibleGames[0];

    // Basic validations
    const participants = targetGame.participants || [];
    if (participants.length <= 3) {
      return res.status(400).json({
        status: 'error',
        message: 'At least 4 participants are required'
      });
    }

    if (participants.length % 2 !== 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Participants count must be even for symmetric pairing'
      });
    }

    // Create a shuffled copy of participants (references to same objects)
    const shuffled = [...participants];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Reset any previous assignments defensively
    for (const p of participants) {
      p.assignedUserId = null;
    }

    // Pair 0-1, 2-3, ... ensuring symmetry
    for (let i = 0; i < shuffled.length; i += 2) {
      const a = shuffled[i];
      const b = shuffled[i + 1];

      if (!a || !b) {
        return res.status(500).json({
          status: 'error',
          message: 'Unexpected pairing error'
        });
      }

      if (a.userId === b.userId) {
        // Extremely unlikely with proper shuffle and even count, but guard anyway
        return res.status(500).json({
          status: 'error',
          message: 'Self-pairing detected; retry the operation'
        });
      }

      a.assignedUserId = b.userId;
      b.assignedUserId = a.userId;
    }

    // Populate child display names for easier reads
    const idToDisplayName = new Map(participants.map(p => [p.userId, p.displayName]));
    for (const p of participants) {
      p.childDisplayName = p.assignedUserId ? idToDisplayName.get(p.assignedUserId) || null : null;
    }

    targetGame.isMatchingDone = true;
    targetGame.status = 'active';
    targetGame.updatedAt = new Date();

    // Build a compact mapping for response clarity
    const assignments = targetGame.participants.map(p => ({
      userId: p.userId,
      childUserId: p.assignedUserId,
      displayName: p.displayName
    }));

    return res.status(200).json({
      status: 'success',
      message: 'Assignments generated successfully',
      data: {
        game: targetGame,
        assignments
      }
    });
  } catch (error) {
    console.error('Error generating children:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to generate children',
      error: error.message
    });
  }
};

module.exports.generateChildren = generateChildren;

/**
 * Get the child details for a user in their most recent active game
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const getChildDetailsByUserId = (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        status: 'error',
        message: 'User ID is required'
      });
    }

    // Find active, matched games containing this user
    const candidateGames = games
      .filter(g => g.status === 'active' && g.isMatchingDone)
      .filter(g => (g.participants || []).some(p => p.userId === userId))
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));

    if (candidateGames.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No active game with assignments found for this user'
      });
    }

    const game = candidateGames[0];
    const me = game.participants.find(p => p.userId === userId);
    if (!me) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found in the selected game'
      });
    }

    if (!me.assignedUserId) {
      return res.status(400).json({
        status: 'error',
        message: 'Assignments not available for this user yet'
      });
    }

    const child = game.participants.find(p => p.userId === me.assignedUserId) || null;

    return res.status(200).json({
      status: 'success',
      data: {
        game: {
          gameId: game.gameId,
          gameCode: game.gameCode,
          name: game.name,
          status: game.status,
          isMatchingDone: game.isMatchingDone,
          updatedAt: game.updatedAt
        },
        user: {
          userId: me.userId,
          displayName: me.displayName
        },
        child: child
          ? {
              userId: child.userId,
              displayName: child.displayName
            }
          : null
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get child details',
      error: error.message
    });
  }
};

module.exports.getChildDetailsByUserId = getChildDetailsByUserId;
