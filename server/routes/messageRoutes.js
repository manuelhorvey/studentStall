const express = require("express");
const router = express.Router();
const { Message } = require("../models/MessagE");
const Conversation = require("../models/conversation");

// Create Message
router.post("/", async (req, res) => {
  try {
    const { conversationId, sender, text } = req.body;

    // Check if the conversation exists
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Create the message
    const newMessage = new Message({ conversationId, sender, text });
    await newMessage.save();

    // Add the message ID to the conversation's messages array
    conversation.messages.push(newMessage._id);
    await conversation.save();

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send a message from one user to another
router.post("/sendMessage", async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;

    // Check if a conversation between the two users exists
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] }
    });

    // If no conversation exists, create a new one
    if (!conversation) {
      conversation = new Conversation({ members: [senderId, receiverId] });
      await conversation.save();
    }

    // Create and save the new message
    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      text: text
    });
    await newMessage.save();

    res.status(201).json({ message: "Message sent successfully", conversationId: conversation._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Messages for Conversation
router.get("/:conversationId", async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId).populate("messages");
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    res.json(conversation.messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Message
router.put("/:messageId", async (req, res) => {
  try {
    const { text } = req.body;
    const updatedMessage = await Message.findByIdAndUpdate(
      req.params.messageId,
      { text },
      { new: true }
    );
    if (!updatedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.json(updatedMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Message
router.delete("/:messageId", async (req, res) => {
  try {
    const deletedMessage = await Message.findByIdAndDelete(req.params.messageId);
    if (!deletedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Remove the message ID from the associated conversation's messages array
    const conversation = await Conversation.findOneAndUpdate(
      { messages: req.params.messageId },
      { $pull: { messages: req.params.messageId } }
    );

    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
