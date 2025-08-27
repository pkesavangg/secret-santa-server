const express = require('express');
const router = express.Router();
const { createGame, getUserGames, addParticipant, generateChildren, getChildDetailsByUserId } = require('../controllers/gameController');

// Route to create a new game
router.post('/create', createGame);

// Route to get all games a user is participating in
router.get('/user/:userId', getUserGames);

// Route to add a participant to an existing game
router.post('/:gameId/participants', addParticipant);

// Route to generate symmetric child assignments for the latest eligible admin game
router.post('/admin/:userId/generate-children', generateChildren);

// Route to get a user's child details in their most recent active game
router.get('/user/:userId/child', getChildDetailsByUserId);

module.exports = router;
