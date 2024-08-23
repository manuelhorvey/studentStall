const mongoose = require("mongoose");

// Message Schema
const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read'],
      default: 'sent'
    },
  },
  { timestamps: true }
);


const Message = mongoose.models.Message || mongoose.model("Message", MessageSchema);

module.exports = Message;
