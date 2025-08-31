const mongoose = require('mongoose');

const ParticipantSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  displayName: { type: String, default: '' },
  joinedAt: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: false },
  assignedUserId: { type: String, default: null },
  childDisplayName: { type: String, default: null },
  dareMessage: { type: String, default: '' },
  dareCompleted: { type: Boolean, default: false },
  email: { type: String, default: '' },
  photoURL: { type: String, default: '' }
}, { _id: false });

const GameSchema = new mongoose.Schema({
  gameId: { type: String, required: true, unique: true, index: true },
  gameCode: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  admin: { type: String, required: true, index: true },
  status: { type: String, enum: ['created', 'active', 'completed'], default: 'created' },
  participants: { type: [ParticipantSchema], default: [] },
  maxParticipants: { type: Number, default: 20 },
  minPrice: { type: Number, default: 0 },
  maxPrice: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  description: { type: String, default: '' },
  eventDate: { type: Date, default: null },
  isMatchingDone: { type: Boolean, default: false }
});

// Useful compound indexes
GameSchema.index({ status: 1, updatedAt: -1 });
GameSchema.index({ 'participants.userId': 1 });
GameSchema.index({ admin: 1, updatedAt: -1 });

module.exports = mongoose.model('Game', GameSchema);


