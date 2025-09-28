import { Conversation } from "../Model/conversationModel.js";
import { Message } from "../Model/messageModel.js";
import { getRecieverSocketId } from "../Socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { textMessage } = req.body;
    console.log(textMessage);
    

    // Validate that the message is not empty
    if (!textMessage || textMessage.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Message content cannot be empty",
      });
    }

    // Find an existing conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    // Create a new conversation if not found
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // Create a new message
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message: textMessage,  // Use the validated message
    });

    // Add the new message to the conversation
    if (newMessage) conversation.messages.push(newMessage._id);

    // Save the updated conversation and new message
    await Promise.all([conversation.save(), newMessage.save()]);

    const recieverSocketId = getRecieverSocketId(receiverId);
    if(recieverSocketId) {
      io.to(recieverSocketId).emit('newMessage', newMessage);
    }

    return res.status(201).json({
      message: "Message sent successfully",
      newMessage,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};

export const getMessage = async (req, res) => {
  try {
    const senderId = req.id; // Assuming this comes from an authenticated request
    const receiverId = req.params.id;

    // Debugging logs
    console.log("Sender ID:", senderId, "Receiver ID:", receiverId);

    // Find the conversation
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    }).populate('messages');

    console.log("Conversation:", conversation); // Log the found conversation

    if (!conversation) {
      return res.status(200).json({ success: true, messages: [] });
    }

    return res.status(200).json({
      success: true,
      messages: conversation.messages, // Return populated messages
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};

