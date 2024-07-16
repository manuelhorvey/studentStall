const express = require("express");
const Conversation = require("../models/conversation");
const router = express.Router();

// Create Conversation
router.post("/", async (req, res) => {
  try {
    const { members } = req.body;

    // Check if a conversation already exists with the exact same members
    const existingConversation = await Conversation.findOne({
      members: { $all: members, $size: members.length }
    });

    if (existingConversation) {
      // Conversation already exists, return its ID
      return res.json({ conversationId: existingConversation._id });
    }

    // Create a new conversation
    const newConversation = new Conversation({ members });
    await newConversation.save();
    res.status(201).json({ conversationId: newConversation._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all conversations with member names
router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId; // Get userId from the URL parameter
    const conversations = await Conversation.find({ members: userId }).populate('members', 'name');
    res.json(conversations);
  } catch (err) {
    console.error('Error fetching conversations:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


// Update Conversation
router.put("/:conversationId", async (req, res) => {
  try {
    const { members } = req.body;
    const updatedConversation = await Conversation.findByIdAndUpdate(
      req.params.conversationId,
      { members },
      { new: true }
    );
    if (!updatedConversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    res.json(updatedConversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Conversation
router.delete("/conversations/:conversationId", async (req, res) => {
  try {
    const deletedConversation = await Conversation.findByIdAndDelete(req.params.conversationId);
    if (!deletedConversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    // Optionally, you can delete associated messages here as well
    res.json({ message: "Conversation deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
