const express = require('express');
const router = express.Router();
const { createGame, getUserGames, addParticipant } = require('../controllers/gameController');

// Route to create a new game
router.post('/create', createGame);

// Route to get all games a user is participating in
router.get('/user/:userId', getUserGames);

// Route to add a participant to an existing game
router.post('/:gameId/participants', addParticipant);

module.exports = router;
