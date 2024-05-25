const { Router } = require("express");
const { verifyToken } = require("../utils/token-manager.js");
const {
  deleteChats,
  generateChatCompletion,
  sendChatsToUser,
  rateMessage,
} = require("../controllers/chat-controllers.js");

// Protected API
const chatRoutes = Router();
chatRoutes.post( "/v1/chat/completions",verifyToken, generateChatCompletion);
chatRoutes.get("/all-chats", verifyToken, sendChatsToUser);
chatRoutes.delete("/delete", verifyToken, deleteChats);
chatRoutes.post("/rate/:messageId",rateMessage);

module.exports = chatRoutes;
