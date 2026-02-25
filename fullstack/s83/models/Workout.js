const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'UserId is required']
  },
  name: {
    type: String,
    required: [true, 'Name is Required']
  },
  duration: {
    type: String,
    required: [true, 'Duration is Required']
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'completed']
  },
  dateAdded: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Workout', workoutSchema);