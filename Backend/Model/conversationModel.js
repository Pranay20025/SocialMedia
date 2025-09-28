import mongoose from "mongoose";

// Define the schema for Conversation
const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  }],
});

// Create and export the Conversation model
export const Conversation = mongoose.model("Conversation", conversationSchema);
