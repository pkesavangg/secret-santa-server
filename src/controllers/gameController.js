/**
 * Game Controller - Handles game-related operations
 */

// In-memory storage for games (temporary until MongoDB integration)
const games = [
  {
    gameId: "game_1756314805403",
    gameCode: "LOFYVF",
    name: "newGame2025",
    createdAt: "2025-08-27T17:13:24.891Z",
    updatedAt: "2025-08-27T17:23:12.825Z",
    admin: "HJPSKhXfnCcexYbZ2tFXUOqz9PP2",
    status: "active", // created, active, completed
    participants: [
      {
        userId: "HJPSKhXfnCcexYbZ2tFXUOqz9PP2",
        displayName: "kesavan",
        joinedAt: "2025-08-27T17:13:24.891Z",
        isAdmin: true,
        assignedUserId: "nhCPwKtD9pRIGvDtoKvhDkeQDCq2",
        dareMessage: "",
        dareCompleted: false,
        childDisplayName: "Mas",
      },
      {
        userId: "2OsTNVdPv3V3NHBHU9bMIQGysJk2",
        displayName: "Mas",
        joinedAt: "2025-08-27T17:18:07.355Z",
        isAdmin: false,
        assignedUserId: "I50LswCEQMfIq8didHZAP2OYXDi1",
        dareMessage: "sasdasdasd  https://openai.com/index/introducing-codex Asasdasd https://youtu.be/mmlnGnndVhI?si=0OxfSjGJfr--ZFrF",
        dareCompleted: false,
        childDisplayName: "Mas2",
      },
      {
        userId: "nhCPwKtD9pRIGvDtoKvhDkeQDCq2",
        displayName: "Mas",
        joinedAt: "2025-08-27T17:19:21.694Z",
        isAdmin: false,
        assignedUserId: "HJPSKhXfnCcexYbZ2tFXUOqz9PP2",
        dareMessage: "",
        dareCompleted: false,
        childDisplayName: "kesavan",
      },
      {
        userId: "I50LswCEQMfIq8didHZAP2OYXDi1",
        displayName: "Mas2",
        joinedAt: "2025-08-27T17:22:42.052Z",
        isAdmin: false,
        assignedUserId: "2OsTNVdPv3V3NHBHU9bMIQGysJk2",
        dareMessage: "asdasdadsadadsasdas",
        dareCompleted: false,
        childDisplayName: "Mas",
      },
    ],
    maxParticipants: 20,
    minPrice: 0,
    maxPrice: 0,
    currency: "USD",
    description: "Game for testing",
    eventDate: "2025-08-27T17:12:17Z",
    isMatchingDone: true,
  },

  // New game where Mas2 is admin
  {
    gameId: "game_1756314900000",
    gameCode: "XYZZY2",
    name: "newGame2025_Mas2",
    createdAt: "2025-08-27T17:30:00.000Z",
    updatedAt: "2025-08-27T17:35:00.000Z",
    admin: "I50LswCEQMfIq8didHZAP2OYXDi1",
    status: "created", // fresh game
    participants: [
      {
        userId: "I50LswCEQMfIq8didHZAP2OYXDi1",
        displayName: "Mas2",
        joinedAt: "2025-08-27T17:30:00.000Z",
        isAdmin: true, // now admin
        assignedUserId: "2OsTNVdPv3V3NHBHU9bMIQGysJk2",
        dareMessage: "asdasdadsadadsasdas",
        dareCompleted: false,
        childDisplayName: "Mas",
      },
      {
        userId: "HJPSKhXfnCcexYbZ2tFXUOqz9PP2",
        displayName: "kesavan",
        joinedAt: "2025-08-27T17:13:24.891Z",
        isAdmin: false,
        assignedUserId: "nhCPwKtD9pRIGvDtoKvhDkeQDCq2",
        dareMessage: "",
        dareCompleted: false,
        childDisplayName: "Mas",
      },
    ],
    maxParticipants: 20,
    minPrice: 0,
    maxPrice: 0,
    currency: "USD",
    description: "Second game with Mas2 as admin",
    eventDate: "2025-09-01T17:00:00Z",
    isMatchingDone: false,
  },
];


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
    const { userId, gameId } = req.params;

    if (!userId) {
      return res.status(400).json({
        status: 'error',
        message: 'User ID is required'
      });
    }

    if (!gameId) {
      return res.status(400).json({
        status: 'error',
        message: 'Game ID is required'
      });
    }

    // Find the specific game by id (fallback to code for robustness)
    const targetGame = games.find(g => g.gameId === gameId) || games.find(g => g.gameCode === gameId);

    if (!targetGame) {
      return res.status(404).json({
        status: 'error',
        message: 'Game not found'
      });
    }

    // Ensure the user is the admin of this game
    if (targetGame.admin !== userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Only the game admin can generate assignments for this game'
      });
    }

    // Ensure the game is eligible
    if (!(targetGame.status === 'created' && !targetGame.isMatchingDone)) {
      return res.status(400).json({
        status: 'error',
        message: 'Game is not eligible for generating assignments'
      });
    }

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
    const { userId, gameId } = req.params;
    const gameIdFromQuery = req.query && req.query.gameId ? req.query.gameId : undefined;
    const resolvedGameId = gameId || gameIdFromQuery;
    if (!userId) {
      return res.status(400).json({
        status: 'error',
        message: 'User ID is required'
      });
    }

    // If specific gameId provided, use that game; else use most recent active one
    let game;
    if (resolvedGameId) {
      game = games.find(g => g.gameId === resolvedGameId);
      if (!game) {
        return res.status(404).json({
          status: 'error',
          message: 'Game not found'
        });
      }
    } else {
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

      game = candidateGames[0];
    }
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
          displayName: me.displayName,
          dareMessage: me.dareMessage || '',
          dareCompleted: !!me.dareCompleted
        },
        child: child
          ? {
              userId: child.userId,
              displayName: child.displayName,
              dareMessage: child.dareMessage || '',
              dareCompleted: !!child.dareCompleted
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

/**
 * Get participants for a specific game by its ID/code
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const getParticipantsByGameId = (req, res) => {
  try {
    const { gameId } = req.params;
    if (!gameId) {
      return res.status(400).json({
        status: 'error',
        message: 'Game ID is required'
      });
    }

    const game = games.find(g => g.gameId === gameId);
    if (!game) {
      return res.status(404).json({
        status: 'error',
        message: 'Game not found'
      });
    }

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
        participants: game.participants
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get participants',
      error: error.message
    });
  }
};

module.exports.getParticipantsByGameId = getParticipantsByGameId;

/**
 * Get dare details for all participants in a specific game by its ID/code
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const getDaresByGameId = (req, res) => {
  try {
    const { gameId } = req.params;
    if (!gameId) {
      return res.status(400).json({
        status: 'error',
        message: 'Game ID is required'
      });
    }

    // Support both gameId and gameCode for robustness
    const game = games.find(g => g.gameId === gameId) || games.find(g => g.gameCode === gameId);
    if (!game) {
      return res.status(404).json({
        status: 'error',
        message: 'Game not found'
      });
    }

    const dares = (game.participants || []).map(p => ({
      userId: p.userId,
      displayName: p.displayName,
      dareMessage: p.dareMessage || '',
      dareCompleted: !!p.dareCompleted
    }));

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
        dares
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get dares',
      error: error.message
    });
  }
};

module.exports.getDaresByGameId = getDaresByGameId;

/**
 * Update dare details for a participant (child) in a specific game by its ID/code
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const updateChildDare = (req, res) => {
  try {
    const { gameId, userId } = req.params;
    if (!gameId) {
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

    const { dareMessage, dareCompleted } = req.body || {};

    // Support both gameId and gameCode for robustness
    const game = games.find(g => g.gameId === gameId) || games.find(g => g.gameCode === gameId);
    if (!game) {
      return res.status(404).json({
        status: 'error',
        message: 'Game not found'
      });
    }

    const participant = (game.participants || []).find(p => p.userId === userId);
    if (!participant) {
      return res.status(404).json({
        status: 'error',
        message: 'Participant not found in this game'
      });
    }

    // Apply updates if provided
    if (typeof dareMessage !== 'undefined') {
      participant.dareMessage = typeof dareMessage === 'string' ? dareMessage : String(dareMessage);
    }
    if (typeof dareCompleted !== 'undefined') {
      participant.dareCompleted = !!dareCompleted;
    }

    game.updatedAt = new Date();

    return res.status(200).json({
      status: 'success',
      message: 'Dare details updated successfully',
      data: {
        game: {
          gameId: game.gameId,
          gameCode: game.gameCode,
          name: game.name,
          status: game.status,
          isMatchingDone: game.isMatchingDone,
          updatedAt: game.updatedAt
        },
        participant
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update dare details',
      error: error.message
    });
  }
};

module.exports.updateChildDare = updateChildDare;

/**
 * Reset (delete) a game by its ID or code
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const resetGame = (req, res) => {
  try {
    const { gameId } = req.params;
    if (!gameId) {
      return res.status(400).json({
        status: 'error',
        message: 'Game ID is required'
      });
    }

    // Find by id or code
    const index = games.findIndex(g => g.gameId === gameId || g.gameCode === gameId);
    if (index === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Game not found'
      });
    }

    const [removed] = games.splice(index, 1);

    return res.status(200).json({
      status: 'success',
      message: 'Game deleted successfully',
      data: {
        gameId: removed.gameId,
        gameCode: removed.gameCode,
        name: removed.name
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete game',
      error: error.message
    });
  }
};

module.exports.resetGame = resetGame;