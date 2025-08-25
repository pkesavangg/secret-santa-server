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
const createGame = (req, res) => {
  try {
    // Extract userId from request body
    const { userId, displayName } = req.body;
    
    if (!userId) {
      return res.status(400).json({ 
        status: 'error',
        message: 'User ID is required to create a game'
      });
    }

    // Create a new game object (for now, just in memory)
    const gameCode = generateGameCode();
    const currentDate = new Date();
    
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
        displayName: displayName || `User ${userId}`,
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
const addParticipant = (req, res) => {
  try {
    const { gameId } = req.params;
    const { userId, displayName } = req.body;
    
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
    
    // Find the game by ID
    const gameIndex = games.findIndex(game => game.gameId === gameId);
    
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
    
    // Add the new participant
    const newParticipant = {
      userId,
      displayName: displayName || `User ${userId}`,
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
