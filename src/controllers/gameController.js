/**
 * Game Controller - Handles game-related operations
 */

// In-memory storage for games (temporary until MongoDB integration)
// const games = [
//   {
//     gameId: "game_1756314805403",
//     gameCode: "LOFYVF",
//     name: "newGame2025",
//     createdAt: "2025-08-27T17:13:24.891Z",
//     updatedAt: "2025-08-27T17:23:12.825Z",
//     admin: "HJPSKhXfnCcexYbZ2tFXUOqz9PP2",
//     status: "active", // created, active, completed
//     participants: [
//       {
//         userId: "HJPSKhXfnCcexYbZ2tFXUOqz9PP2",
//         displayName: "kesavan",
//         joinedAt: "2025-08-27T17:13:24.891Z",
//         isAdmin: true,
//         assignedUserId: "nhCPwKtD9pRIGvDtoKvhDkeQDCq2",
//         dareMessage: "",
//         dareCompleted: false,
//         childDisplayName: "Mas",
//         email: "kesavan@example.com",
//         photoURL: "https://fastly.picsum.photos/id/289/200/300.jpg?hmac=TVh4H_Hra3e1VSDPJz-mhCgep32qIa7T6DGQvbrjMb4"
//       },
//       {
//         userId: "2OsTNVdPv3V3NHBHU9bMIQGysJk2",
//         displayName: "Mas",
//         joinedAt: "2025-08-27T17:18:07.355Z",
//         isAdmin: false,
//         assignedUserId: "I50LswCEQMfIq8didHZAP2OYXDi1",
//         dareMessage: "sasdasdasd  https://openai.com/index/introducing-codex Asasdasd https://youtu.be/mmlnGnndVhI?si=0OxfSjGJfr--ZFrF",
//         dareCompleted: false,
//         childDisplayName: "Mas2",
//         email: "mas1@example.com",
//         photoURL: "https://fastly.picsum.photos/id/93/200/200.jpg?hmac=zg_Gq7olpOr79tOB65nmsvLWAIR_Ju8QQWkTKurbgJs"
//       },
//       {
//         userId: "nhCPwKtD9pRIGvDtoKvhDkeQDCq2",
//         displayName: "Mas",
//         joinedAt: "2025-08-27T17:19:21.694Z",
//         isAdmin: false,
//         assignedUserId: "HJPSKhXfnCcexYbZ2tFXUOqz9PP2",
//         dareMessage: "",
//         dareCompleted: false,
//         childDisplayName: "kesavan",
//         email: "mas2@example.com",
//         photoURL: "https://fastly.picsum.photos/id/174/200/300.jpg?hmac=QaIDLHcDtfSD0nDbTHmEYRm7_bAbvyCafyheoeR2ZB4"
//       },
//       {
//         userId: "I50LswCEQMfIq8didHZAP2OYXDi1",
//         displayName: "Mas2",
//         joinedAt: "2025-08-27T17:22:42.052Z",
//         isAdmin: false,
//         assignedUserId: "2OsTNVdPv3V3NHBHU9bMIQGysJk2",
//         dareMessage: "asdasdadsadadsasdas",
//         dareCompleted: false,
//         childDisplayName: "Mas",
//         email: "mas2.admin@example.com",
//         photoURL: "https://fastly.picsum.photos/id/348/200/200.jpg?hmac=3DFdqMmDkl3bpk6cV1tumcDAzASPQUSbXHXWZIbIvks"
//       },
//     ],
//     maxParticipants: 20,
//     minPrice: 0,
//     maxPrice: 0,
//     currency: "USD",
//     description: "Game for testing",
//     eventDate: "2025-08-27T17:12:17Z",
//     isMatchingDone: true,
//   },

//   // New game where Mas2 is admin
//   {
//     gameId: "game_1756314900000",
//     gameCode: "XYZZY2",
//     name: "newGame2025_Mas2",
//     createdAt: "2025-08-27T17:30:00.000Z",
//     updatedAt: "2025-08-27T17:35:00.000Z",
//     admin: "I50LswCEQMfIq8didHZAP2OYXDi1",
//     status: "created", // fresh game
//     participants: [
//       {
//         userId: "I50LswCEQMfIq8didHZAP2OYXDi1",
//         displayName: "Mas2",
//         joinedAt: "2025-08-27T17:30:00.000Z",
//         isAdmin: true, // now admin
//         assignedUserId: "2OsTNVdPv3V3NHBHU9bMIQGysJk2",
//         dareMessage: "asdasdadsadadsasdas",
//         dareCompleted: false,
//         childDisplayName: "Mas",
//       },
//       {
//         userId: "HJPSKhXfnCcexYbZ2tFXUOqz9PP2",
//         displayName: "kesavan",
//         joinedAt: "2025-08-27T17:13:24.891Z",
//         isAdmin: false,
//         assignedUserId: "nhCPwKtD9pRIGvDtoKvhDkeQDCq2",
//         dareMessage: "",
//         dareCompleted: false,
//         childDisplayName: "Mas",
//       },
//     ],
//     maxParticipants: 20,
//     minPrice: 0,
//     maxPrice: 0,
//     currency: "USD",
//     description: "Second game with Mas2 as admin",
//     eventDate: "2025-09-01T17:00:00Z",
//     isMatchingDone: false,
//   },
// ];

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
const Game = require('../models/Game');

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
        dareCompleted: false, // whether the dare has been completed or not
        email: (await authService.getUserPublicProfile(userId)).email || '',
        photoURL: (await authService.getUserPublicProfile(userId)).photoURL || ''
      }],
      maxParticipants: req.body.maxParticipants || 20,
      minPrice: req.body.minPrice || 0,
      maxPrice: req.body.maxPrice || 0,
      currency: req.body.currency || 'USD',
      description: req.body.description || '',
      eventDate: req.body.eventDate || null,
      isMatchingDone: false
    };

    // Persist to MongoDB
    const created = await Game.create(newGame);

    // Add the new game to in-memory storage (temporary fallback)
    games.push(created.toObject());

    // Return the created game (in a real implementation, we would save to MongoDB first)
    res.status(201).json({
      status: 'success',
      message: 'Game created successfully',
      data: {
        game: created
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
const getUserGames = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ 
        status: 'error',
        message: 'User ID is required'
      });
    }
    // Prefer MongoDB results
    try {
      const participatingGames = await Game.find({ 'participants.userId': userId }).sort({ updatedAt: -1 }).lean();
      const adminGames = await Game.find({ admin: userId }).sort({ updatedAt: -1 }).lean();
      return res.status(200).json({
        status: 'success',
        data: {
          participatingGames,
          adminGames,
          isParticipatingInAnyGame: participatingGames.length > 0
        }
      });
    } catch (e) {
      // fall back to in-memory for any DB issue
    }

    // Fallback to in-memory
    const userGames = games.filter(game => (game.participants || []).some(participant => participant.userId === userId));
    const adminGamesMem = games.filter(game => game.admin === userId);
    res.status(200).json({
      status: 'success',
      data: {
        participatingGames: userGames,
        adminGames: adminGamesMem,
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
    
    // Try MongoDB first
    try {
      const game = await Game.findOne({ $or: [ { gameId: gameCode }, { gameCode: gameCode } ] });
      if (!game) {
        return res.status(404).json({ status: 'error', message: 'Game not found' });
      }
      // Check constraints
      if ((game.participants || []).some(p => p.userId === userId)) {
        return res.status(400).json({ status: 'error', message: 'User is already a participant in this game' });
      }
      if ((game.participants || []).length >= game.maxParticipants) {
        return res.status(400).json({ status: 'error', message: 'Game has reached maximum number of participants' });
      }
      if (game.status !== 'created') {
        return res.status(400).json({ status: 'error', message: 'Game is not accepting new participants at this time' });
      }

      const currentDate = new Date();
      let resolvedDisplayName = userName;
      try {
        const firebaseName = await authService.getDisplayNameByUserId(userId);
        if (firebaseName && firebaseName.trim().length > 0) {
          resolvedDisplayName = firebaseName;
        }
      } catch (e) {}

      const profile = await authService.getUserPublicProfile(userId);
      const newParticipant = {
        userId,
        displayName: resolvedDisplayName || `User ${userId}`,
        joinedAt: currentDate,
        isAdmin: false,
        assignedUserId: null,
        dareMessage: '',
        dareCompleted: false,
        email: profile.email || '',
        photoURL: profile.photoURL || ''
      };

      game.participants.push(newParticipant);
      game.updatedAt = currentDate;
      await game.save();

      return res.status(200).json({
        status: 'success',
        message: 'Participant added successfully',
        data: { game }
      });
    } catch (e) {
      // fall back to in-memory
    }

    // In-memory fallback
    const gameIndex = games.findIndex(game => game.gameCode === gameCode);
    if (gameIndex === -1) {
      return res.status(404).json({ status: 'error', message: 'Game not found' });
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
    const profile = await authService.getUserPublicProfile(userId);
    const newParticipant = {
      userId,
      displayName: resolvedDisplayName || `User ${userId}`,
      joinedAt: currentDate,
      isAdmin: false,
      assignedUserId: null,
      dareMessage: '',
      dareCompleted: false,
      email: profile.email || '',
      photoURL: profile.photoURL || ''
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
 * Generate non-symmetric Secret Santa assignments (derangement)
 * Rules:
 * - User must be admin of an eligible game (status: created, isMatchingDone: false)
 * - At least 3 participants are required
 * - Each participant is assigned to a different participant (no self-assignments)
 * - After assignment: game.status becomes 'active' and isMatchingDone becomes true
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const generateChildren = async (req, res) => {
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

    // Try MongoDB first
    try {
      const targetGame = await Game.findOne({ $or: [ { gameId: gameId }, { gameCode: gameId } ] });
      if (!targetGame) {
        return res.status(404).json({ status: 'error', message: 'Game not found' });
      }
      if (targetGame.admin !== userId) {
        return res.status(403).json({ status: 'error', message: 'Only the game admin can generate assignments for this game' });
      }
      if (!(targetGame.status === 'created' && !targetGame.isMatchingDone)) {
        return res.status(400).json({ status: 'error', message: 'Game is not eligible for generating assignments' });
      }

      const participants = targetGame.participants || [];
      if (participants.length < 3) {
        return res.status(400).json({ status: 'error', message: 'At least 3 participants are required for non-symmetric assignments' });
      }

      // Sattolo's algorithm: produce a single cycle (derangement for n >= 3)
      const shuffled = [...participants];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i); // 0 <= j < i
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      for (const p of participants) { p.assignedUserId = null; }
      for (let i = 0; i < shuffled.length; i++) {
        const giver = shuffled[i];
        const receiver = shuffled[(i + 1) % shuffled.length];
        if (!giver || !receiver) { return res.status(500).json({ status: 'error', message: 'Unexpected assignment error' }); }
        if (giver.userId === receiver.userId) { return res.status(500).json({ status: 'error', message: 'Self-assignment detected; retry the operation' }); }
        giver.assignedUserId = receiver.userId;
      }
      const idToDisplayName = new Map(participants.map(p => [p.userId, p.displayName]));
      for (const p of participants) {
        p.childDisplayName = p.assignedUserId ? idToDisplayName.get(p.assignedUserId) || null : null;
      }
      targetGame.isMatchingDone = true;
      targetGame.status = 'active';
      targetGame.updatedAt = new Date();
      await targetGame.save();

      const assignments = targetGame.participants.map(p => ({
        userId: p.userId,
        childUserId: p.assignedUserId,
        displayName: p.displayName,
        email: p.email || '',
        photoURL: p.photoURL || ''
      }));

      return res.status(200).json({
        status: 'success',
        message: 'Assignments generated successfully',
        data: { game: targetGame, assignments }
      });
    } catch (e) {
      // fall back to in-memory
    }

    // In-memory fallback
    const targetGame = games.find(g => g.gameId === gameId) || games.find(g => g.gameCode === gameId);
    if (!targetGame) { return res.status(404).json({ status: 'error', message: 'Game not found' }); }

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
    if (participants.length < 3) {
      return res.status(400).json({
        status: 'error',
        message: 'At least 3 participants are required for non-symmetric assignments'
      });
    }

    // Sattolo's algorithm: produce a single cycle (derangement for n >= 3)
    const shuffled = [...participants];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i); // 0 <= j < i
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Reset any previous assignments defensively
    for (const p of participants) {
      p.assignedUserId = null;
    }

    // Assign each participant to the next in the cycle (non-symmetric)
    for (let i = 0; i < shuffled.length; i++) {
      const giver = shuffled[i];
      const receiver = shuffled[(i + 1) % shuffled.length];

      if (!giver || !receiver) {
        return res.status(500).json({
          status: 'error',
          message: 'Unexpected assignment error'
        });
      }

      if (giver.userId === receiver.userId) {
        return res.status(500).json({
          status: 'error',
          message: 'Self-assignment detected; retry the operation'
        });
      }

      giver.assignedUserId = receiver.userId;
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
      displayName: p.displayName,
      email: p.email || '',
      photoURL: p.photoURL || ''
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
const getChildDetailsByUserId = async (req, res) => {
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

    // Prefer MongoDB
    try {
      let game;
      if (resolvedGameId) {
        game = await Game.findOne({ gameId: resolvedGameId }).lean();
        if (!game) { return res.status(404).json({ status: 'error', message: 'Game not found' }); }
      } else {
        game = await Game.findOne({ status: 'active', isMatchingDone: true, 'participants.userId': userId })
          .sort({ updatedAt: -1 })
          .lean();
        if (!game) { return res.status(404).json({ status: 'error', message: 'No active game with assignments found for this user' }); }
      }
      const me = (game.participants || []).find(p => p.userId === userId);
      if (!me) { return res.status(404).json({ status: 'error', message: 'User not found in the selected game' }); }
      if (!me.assignedUserId) { return res.status(400).json({ status: 'error', message: 'Assignments not available for this user yet' }); }
      const child = (game.participants || []).find(p => p.userId === me.assignedUserId) || null;
      return res.status(200).json({
        status: 'success',
        data: {
          game: { gameId: game.gameId, gameCode: game.gameCode, name: game.name, status: game.status, isMatchingDone: game.isMatchingDone, updatedAt: game.updatedAt },
          user: { userId: me.userId, displayName: me.displayName, email: me.email || '', photoURL: me.photoURL || '', dareMessage: me.dareMessage || '', dareCompleted: !!me.dareCompleted },
          child: child ? { userId: child.userId, displayName: child.displayName, email: child.email || '', photoURL: child.photoURL || '', dareMessage: child.dareMessage || '', dareCompleted: !!child.dareCompleted } : null
        }
      });
    } catch (e) {
      // fall back to in-memory
    }

    // In-memory fallback
    let game;
    if (resolvedGameId) {
      game = games.find(g => g.gameId === resolvedGameId);
      if (!game) { return res.status(404).json({ status: 'error', message: 'Game not found' }); }
    } else {
      const candidateGames = games
        .filter(g => g.status === 'active' && g.isMatchingDone)
        .filter(g => (g.participants || []).some(p => p.userId === userId))
        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
      if (candidateGames.length === 0) { return res.status(404).json({ status: 'error', message: 'No active game with assignments found for this user' }); }
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
          email: me.email || '',
          photoURL: me.photoURL || '',
          dareMessage: me.dareMessage || '',
          dareCompleted: !!me.dareCompleted
        },
        child: child
          ? {
              userId: child.userId,
              displayName: child.displayName,
              email: child.email || '',
              photoURL: child.photoURL || '',
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
const getParticipantsByGameId = async (req, res) => {
  try {
    const { gameId } = req.params;
    if (!gameId) {
      return res.status(400).json({
        status: 'error',
        message: 'Game ID is required'
      });
    }

    // Prefer MongoDB
    try {
      const game = await Game.findOne({ gameId }).lean();
      if (!game) { return res.status(404).json({ status: 'error', message: 'Game not found' }); }
      const refreshed = (game.participants || []).map(p => ({ ...p, email: p.email || '', photoURL: p.photoURL || '' }));
      return res.status(200).json({
        status: 'success',
        data: {
          game: { gameId: game.gameId, gameCode: game.gameCode, name: game.name, status: game.status, isMatchingDone: game.isMatchingDone, updatedAt: game.updatedAt },
          participants: refreshed
        }
      });
    } catch (e) {
      // fall back to in-memory
    }

    const game = games.find(g => g.gameId === gameId);
    if (!game) { return res.status(404).json({ status: 'error', message: 'Game not found' }); }

    // Return stored participant data without fetching from Firebase on each request
    const refreshed = (game.participants || []).map(p => ({
      ...p,
      email: p.email || '',
      photoURL: p.photoURL || ''
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
        participants: refreshed
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
const getDaresByGameId = async (req, res) => {
  try {
    const { gameId } = req.params;
    if (!gameId) {
      return res.status(400).json({
        status: 'error',
        message: 'Game ID is required'
      });
    }

    // Prefer MongoDB
    try {
      const game = await Game.findOne({ $or: [ { gameId }, { gameCode: gameId } ] }).lean();
      if (!game) { return res.status(404).json({ status: 'error', message: 'Game not found' }); }
      const dares = (game.participants || []).map(p => ({ userId: p.userId, displayName: p.displayName, dareMessage: p.dareMessage || '', dareCompleted: !!p.dareCompleted, email: p.email || '', photoURL: p.photoURL || '' }));
      return res.status(200).json({
        status: 'success',
        data: { game: { gameId: game.gameId, gameCode: game.gameCode, name: game.name, status: game.status, isMatchingDone: game.isMatchingDone, updatedAt: game.updatedAt }, dares }
      });
    } catch (e) {
      // fall back to in-memory
    }

    const game = games.find(g => g.gameId === gameId) || games.find(g => g.gameCode === gameId);
    if (!game) { return res.status(404).json({ status: 'error', message: 'Game not found' }); }

    const dares = (game.participants || []).map(p => ({
      userId: p.userId,
      displayName: p.displayName,
      dareMessage: p.dareMessage || '',
      dareCompleted: !!p.dareCompleted,
      email: p.email || '',
      photoURL: p.photoURL || ''
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
 * Update stored user profile fields (email, photoURL, optional displayName) across all games
 * where the user participates. This avoids fetching from Firebase on every read.
 *
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const updateUserDetailsInGames = async (req, res) => {
  try {
    const { userId } = req.params;
    const { email, photoURL, displayName } = req.body || {};

    if (!userId) {
      return res.status(400).json({
        status: 'error',
        message: 'User ID is required'
      });
    }

    if (typeof email === 'undefined' && typeof photoURL === 'undefined' && typeof displayName === 'undefined') {
      return res.status(400).json({
        status: 'error',
        message: 'At least one of email, photoURL, or displayName is required'
      });
    }

    // Prefer MongoDB bulk updates
    try {
      const setObject = {};
      if (typeof email !== 'undefined') setObject['participants.$[p].email'] = typeof email === 'string' ? email : String(email);
      if (typeof photoURL !== 'undefined') setObject['participants.$[p].photoURL'] = typeof photoURL === 'string' ? photoURL : String(photoURL);
      if (typeof displayName !== 'undefined') setObject['participants.$[p].displayName'] = typeof displayName === 'string' ? displayName : String(displayName);

      let gamesTouched = 0;
      let participantsUpdated = 0; // best-effort (modifiedCount across ops)

      if (Object.keys(setObject).length > 0) {
        const result = await Game.updateMany(
          { 'participants.userId': userId },
          { $set: setObject, $currentDate: { updatedAt: true } },
          { arrayFilters: [ { 'p.userId': userId } ] }
        );
        gamesTouched += result.modifiedCount || 0;
        participantsUpdated += result.modifiedCount || 0;
      }

      if (typeof displayName !== 'undefined') {
        const result2 = await Game.updateMany(
          { 'participants.assignedUserId': userId },
          { $set: { 'participants.$[p].childDisplayName': typeof displayName === 'string' ? displayName : String(displayName) }, $currentDate: { updatedAt: true } },
          { arrayFilters: [ { 'p.assignedUserId': userId } ] }
        );
        gamesTouched += result2.modifiedCount || 0;
      }

      return res.status(200).json({
        status: 'success',
        message: 'User details updated in games',
        data: { userId, gamesTouched, participantsUpdated }
      });
    } catch (e) {
      // fall back to in-memory
    }

    // In-memory fallback
    let gamesTouched = 0;
    let participantsUpdated = 0;
    for (const game of games) {
      let gameUpdated = false;
      for (const participant of game.participants || []) {
        if (participant.userId === userId) {
          if (typeof email !== 'undefined') participant.email = typeof email === 'string' ? email : String(email);
          if (typeof photoURL !== 'undefined') participant.photoURL = typeof photoURL === 'string' ? photoURL : String(photoURL);
          if (typeof displayName !== 'undefined') participant.displayName = typeof displayName === 'string' ? displayName : String(displayName);
          participantsUpdated += 1;
          gameUpdated = true;
        }
      }
      if (typeof displayName !== 'undefined') {
        for (const participant of game.participants || []) {
          if (participant.assignedUserId === userId) {
            participant.childDisplayName = typeof displayName === 'string' ? displayName : String(displayName);
            gameUpdated = true;
          }
        }
      }
      if (gameUpdated) {
        game.updatedAt = new Date();
        gamesTouched += 1;
      }
    }
    return res.status(200).json({ status: 'success', message: 'User details updated in games', data: { userId, gamesTouched, participantsUpdated } });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update user details in games',
      error: error.message
    });
  }
};

module.exports.updateUserDetailsInGames = updateUserDetailsInGames;

/**
 * Update dare details for a participant (child) in a specific game by its ID/code
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const updateChildDare = async (req, res) => {
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

    // Prefer MongoDB
    try {
      const setObject = {};
      if (typeof dareMessage !== 'undefined') setObject['participants.$[p].dareMessage'] = typeof dareMessage === 'string' ? dareMessage : String(dareMessage);
      if (typeof dareCompleted !== 'undefined') setObject['participants.$[p].dareCompleted'] = !!dareCompleted;
      const result = await Game.findOneAndUpdate(
        { $or: [ { gameId }, { gameCode: gameId } ], 'participants.userId': userId },
        { $set: setObject, $currentDate: { updatedAt: true } },
        { arrayFilters: [ { 'p.userId': userId } ], new: true }
      );
      if (!result) { return res.status(404).json({ status: 'error', message: 'Game or participant not found' }); }
      const participant = (result.participants || []).find(p => p.userId === userId);
      return res.status(200).json({
        status: 'success',
        message: 'Dare details updated successfully',
        data: {
          game: { gameId: result.gameId, gameCode: result.gameCode, name: result.name, status: result.status, isMatchingDone: result.isMatchingDone, updatedAt: result.updatedAt },
          participant
        }
      });
    } catch (e) {
      // fall back to in-memory
    }

    // In-memory fallback
    const game = games.find(g => g.gameId === gameId) || games.find(g => g.gameCode === gameId);
    if (!game) { return res.status(404).json({ status: 'error', message: 'Game not found' }); }
    const participant = (game.participants || []).find(p => p.userId === userId);
    if (!participant) { return res.status(404).json({ status: 'error', message: 'Participant not found in this game' }); }
    if (typeof dareMessage !== 'undefined') { participant.dareMessage = typeof dareMessage === 'string' ? dareMessage : String(dareMessage); }
    if (typeof dareCompleted !== 'undefined') { participant.dareCompleted = !!dareCompleted; }
    game.updatedAt = new Date();
    return res.status(200).json({ status: 'success', message: 'Dare details updated successfully', data: { game: { gameId: game.gameId, gameCode: game.gameCode, name: game.name, status: game.status, isMatchingDone: game.isMatchingDone, updatedAt: game.updatedAt }, participant } });
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
const resetGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    if (!gameId) {
      return res.status(400).json({
        status: 'error',
        message: 'Game ID is required'
      });
    }

    // Prefer MongoDB
    try {
      const result = await Game.findOneAndDelete({ $or: [ { gameId }, { gameCode: gameId } ] });
      if (!result) { return res.status(404).json({ status: 'error', message: 'Game not found' }); }
      return res.status(200).json({ status: 'success', message: 'Game deleted successfully', data: { gameId: result.gameId, gameCode: result.gameCode, name: result.name } });
    } catch (e) {
      // fall back to in-memory
    }

    // In-memory fallback
    const index = games.findIndex(g => g.gameId === gameId || g.gameCode === gameId);
    if (index === -1) { return res.status(404).json({ status: 'error', message: 'Game not found' }); }
    const [removed] = games.splice(index, 1);
    return res.status(200).json({ status: 'success', message: 'Game deleted successfully', data: { gameId: removed.gameId, gameCode: removed.gameCode, name: removed.name } });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete game',
      error: error.message
    });
  }
};

module.exports.resetGame = resetGame;