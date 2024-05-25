import { useState } from "react";
import React from "react";
import { Box, Avatar, Typography } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
//import { IoMdChatbubbles } from "react-icons/io";
import { IoMdThumbsUp, IoMdThumbsDown } from "react-icons/io";
import { IconButton } from '@mui/material';
//import  { useState } from "react";
import axios from 'axios'
import ChatbotAvatar from "../../Assets/chatbot.png" ; 
function extractCodeFromString(message) {
  if (!message) return [];
  if (message.includes("```")) {
    const blocks = message.split("```");
    return blocks.filter((block, index) => index % 2 === 0);
  } else {
    return [message];
  }
}
function isCodeBlock(str) {
  return str.trim().startsWith("```") && str.trim().endsWith("```");
}

const ChatItem = ({ content, role, messageId, onRate }) => {
  const messageBlocks = extractCodeFromString(content);
  const [isLiked, setIsLiked] = useState(onRate);
  // eslint-disable-next-line no-unused-vars
  const auth = useAuth();
  //const [ratingSent, setRatingSent] = useState(false);
  const handleRate = (rating) => {

        axios.post(`http://localhost:5005/api/v1/chat/rate/${messageId}`, { liked: isLiked !==  Boolean(rating === 'like') ? Boolean(rating === 'like'): null })
            .then(response => {
                console.log('Rating sent:', response.data);
                setIsLiked(isLiked !==  Boolean(rating === 'like') ? rating === 'like': null);
            })
            .catch(error => console.error('Error updating rating:', error));
};
     
  return role === "assistant" ? (
    <Box
      sx={{
        display: "flex",
        p: 2,
        bgcolor: "#DDDDDD",
        gap: 2,
        borderRadius: 2,
        my: 1,
      }}
    >
    <Avatar sx={{ ml: "0" }}>
        <img src={ChatbotAvatar} alt="Chatbot" width={"30px"} />
      </Avatar>
      <Box>
        {!messageBlocks && (
          <Typography sx={{ fontSize: "20px" }}>{content}</Typography>
        )}
        {messageBlocks &&
          messageBlocks.length &&
          messageBlocks.map((block, index) =>
            isCodeBlock(block) ? (
              <SyntaxHighlighter
                key={index}
                style={coldarkDark}
                language="javascript"
              >
                {block}
              </SyntaxHighlighter>
            ) : (
              <Typography key={index} sx={{ fontSize: "20px" }}>
                {block}
              </Typography>
            )
          )}
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", ml: 1 }}>
        <IconButton color={isLiked === true ? "success" : "default"} onClick={() => handleRate("like")}>
          <IoMdThumbsUp />
        </IconButton>
        <IconButton color={isLiked === false ? "error" : "default"} onClick={() => handleRate("dislike")}>
          <IoMdThumbsDown />
        </IconButton>
      </Box>
    </Box>
  ) : (
    <Box
      sx={{
        display: "flex",
        p: 2,
        bgcolor: "#CAEDFF",
        gap: 2,
        borderRadius: 2,
        mb: 1, // Ajout de la marge basse ici
      }}
    >
      <Box>
        {!messageBlocks && (
          <Typography sx={{ fontSize: "20px" }}>{content}</Typography>
        )}
        {messageBlocks &&
          messageBlocks.length &&
          messageBlocks.map((block, index) =>
            isCodeBlock(block) ? (
              <SyntaxHighlighter
                key={index}
                style={coldarkDark}
                language="javascript"
              >
                {block}
              </SyntaxHighlighter>
            ) : (
              <Typography key={index} sx={{ fontSize: "20px" }}>
                {block}
              </Typography>
            )
          )}
      </Box>
    </Box>
  );
};

export default ChatItem;