const express = require('express');
const router = express.Router();
const { createGame, getUserGames, addParticipant, generateChildren, getChildDetailsByUserId, getParticipantsByGameId, getDaresByGameId, updateChildDare, resetGame } = require('../controllers/gameController');

// Route to create a new game
router.post('/create', createGame);

// Route to get all games a user is participating in
router.get('/user/:userId', getUserGames);

// Route to add a participant to an existing game
router.post('/:gameId/participants', addParticipant);

// Route to get participants for a game by id/code
router.get('/:gameId/participants', getParticipantsByGameId);

// Route to get dares for a game by id/code
router.get('/:gameId/dares', getDaresByGameId);

// Route to update dare details for a specific participant (child) in a game
router.put('/:gameId/participants/:userId/dare', updateChildDare);

// Route to reset (delete) a game by id/code
router.delete('/:gameId', resetGame);

// Route to generate symmetric child assignments for a specific game (requires admin)
router.post('/admin/:userId/game/:gameId/generate-children', generateChildren);

// Back-compat: generate for latest eligible admin game (deprecated)
router.post('/admin/:userId/generate-children', generateChildren);

// Route to get a user's child details in their most recent active game
router.get('/user/:userId/child', getChildDetailsByUserId);

// Route to get a user's child details for a specific game
router.get('/user/:userId/game/:gameId/child', getChildDetailsByUserId);

module.exports = router;
