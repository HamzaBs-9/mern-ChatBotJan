const axios = require('axios');
const User = require("../models/User.js");

const generateChatCompletion = async (req, res, next) => {
  const { message } = req.body;
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not registered OR Token malfunctioned" });
    }

    const chats = user.chats.map(({ role, content }) => ({
      role,
      content,
    }));
    chats.push({ content: message, role: "user" });
    user.chats.push({ content: message, role: "user" });

    const options = {
      method: 'POST',
      url: 'http://127.0.0.1:1338/v1/chat/completions',
      headers: { 'Content-Type': 'application/json' },
      data: {
          messages:[{role: "system", 
          content:"You are a support chatbot for Technix company that provides result-oriented and cost-effective support and maintenance services. Your tasks include handling customer inquiries related to these services and managing client reclamations on products. Common issues include:Authentication issues and others " },  ...chats],
          model: "openchat-3.5-7b",
          max_tokens: 4048,
          stop: [
            "hello"
          ],
          frequency_penalty: 0,
          presence_penalty: 0,
          temperature: 0.7,
          top_p: 0.95
      }
    };
    

    const response = await axios(options);
    console.log("API Response:", response.data); // Log the entire response for debugging

    const assistantMessage = response.data.choices[0].message;
    
    console.log("Assistant Message:", assistantMessage.role); // Log the assistant message for debugging

    user.chats.push({...assistantMessage, content:assistantMessage.content.replace("<|end_of_turn|>" , "")});
    await user.save();
    return res.status(200).json({ chats: user.chats });
  } catch (error) {
    console.log("Error:", error.message); // Log the error message
    if (error.response) {
      console.log("API Response Error Data:", error.response.data); // Log the response error data
    }
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

const sendChatsToUser = async (req, res, next) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    return res.status(200).json({ message: "OK", chats: user.chats });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};
///////////like///////////
// Update the rating for a specific chat message
const rateMessage = async (req, res) => {
  const { messageId } = req.params;
  const { liked } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { _id: res.locals.jwtData.id, "chats.id": messageId },
      { $set: { "chats.$.liked": liked } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "Message not found" });
    } 

    res.status(200).json({ message: "Rating updated successfully" });
  } catch (error) {
    console.error("Error updating rating:", error);
    res.status(500).json({ error: error.message }); // Send the error message to the frontend
  }
};
//////////////////////////////
const deleteChats = async (req, res, next) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    user.chats = [];
    await user.save();
    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

module.exports = {
  generateChatCompletion,
  sendChatsToUser,
  deleteChats,rateMessage,
};
