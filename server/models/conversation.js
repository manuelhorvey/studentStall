const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema(
  {
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    messages: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    }],
  },
  { timestamps: true }
);

// Check if the model already exists, otherwise define it
const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);

module.exports = Conversation;
