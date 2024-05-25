import React, { useEffect, useRef, useState } from "react";
import { Box, Container, Typography, Button, IconButton, TextField } from "@mui/material";
import { IoMdSend, IoMdChatbubbles } from "react-icons/io";
import ChatItem from "../components/chat/ChatItem";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getUserChats } from "../helpers/api-communicator"; // Ensure this function is defined or imported correctly.
import toast from "react-hot-toast";
import axios from 'axios'; // Make sure axios is imported

import aproposImage from "../Assets/Apropos_img.png";
import logo from '../Assets/technix-logo.png';

const Chat = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const auth = useAuth();
  const [chatMessages, setChatMessages] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [showQuestions, setShowQuestions] = useState(true); // Show predefined questions initially
  const [firstTimeOpen, setFirstTimeOpen] = useState(true); // Track if chat is opened for the first time

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  // Function to handle sending chat requests
  const sendChatRequest = async (content) => {
    try {
      const response = await axios.post('http://localhost:5005/api/v1/chat/v1/chat/completions', {
        message: content
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      // Update chat messages state based on the response
      if (response.data && response.data.chats) {
        setChatMessages(prev => [...prev, ...response.data.chats.map(chat => ({
          role: chat.role,
          content: chat.content
        }))]);
      }
  
      /*const replyMessage = {
        content: response.data.choices[0].message.content,
        role: 'assistant'
      };
      // Update the chat with the assistant's response
      setChatMessages(messages => [...messages, replyMessage]);*/
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error("Failed to send message");
    }
  };
  // Function to handle the form submit
  const handleSubmit = async () => {
    const content = inputRef.current?.value;
    if (!content) return;
    const newMessage = { role: "user", content };
    setChatMessages((prev) => [...prev, newMessage]); // Add user's message to chat
    inputRef.current.value = "";
  
    await sendChatRequest(content); // Send the request and handle the response inside
    setShowQuestions(false); // Hide predefined questions after sending a message
  };

  // Function to handle predefined question click
  const handleQuestionClick = async (question) => {
    inputRef.current.value = question;
    await handleSubmit();
  };

  // Function to toggle the chat visibility
  const toggleChat = () => {
    if (!chatOpen && firstTimeOpen) {
      setShowQuestions(true); // Show predefined questions only the first time the chat is opened
      setFirstTimeOpen(false);
    }
    setChatOpen((prev) => !prev);
  };

    // Effect to load chats on component mount
    useEffect(() => {
      if (!auth?.user) {
        navigate("/login");
      } else {
        toast.loading("Loading Chats", { id: "loadchats" });
        getUserChats()
          .then((data) => {
            setChatMessages(data.chats || []);
            toast.success("Successfully loaded chats", { id: "loadchats" });
          })
          .catch((error) => {
            console.error(error);
            setChatMessages([]);
            toast.error("Loading Failed", { id: "loadchats" });
          });
      }
    }, [auth, navigate]);

  const [buttonPosition] = useState({ bottom: 20, right: 20 });
  const predefinedQuestions = [
    "Do you ship internationally?",
    "Why are your prices so low?",
    "How do I track my order?",
    "How much is shipping?",
    "Other question"
  ];

  return (
    <>
      <Box
        style={{
          height: "10vh", // Définit la hauteur du container de chat à 25% de la hauteur de la page
        }}
      ></Box>
      <Container
        fixed
        maxWidth={false}
        style={{
          position: 'relative',
          height: '60vh',
          background: 'linear-gradient(to bottom, rgba(238, 247, 255, 0.5), rgba(255, 255, 255, 0.5))',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          marginTop: "100px",
          marginBottom: "0px",
          width: "100%",
          borderRadius: "20px",
          padding: '0',
          display: 'flex', // Ajouter la propriété display flex
          alignItems: 'center', // Aligner les éléments au centre verticalement
          justifyContent: 'center', // Aligner les éléments au centre horizontalement

        }}
      >
        <img src={logo} alt="Votre logo" style={{ position: 'absolute', top: '20px', left: '20px', width: '100px', zIndex: '1000' }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-around',
            padding: '2rem',
            gap: '2rem',
            height: '100vh',
            width: '80%',
            borderRadius: '10px',
            margin: '2rem 0',
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" gutterBottom style={{ color: '#0E46A3', fontFamily: 'Montserrat', fontWeight: 'bold' }}>
              OUR JOB IS TO HIGHLIGHT YOURS
            </Typography>
            <Box sx={{ width: '90px', height: '2px', backgroundColor: '#0E46A3', marginLeft: '8px', marginBottom: '20px' }} />

            <Typography sx={{ maxWidth: '500px', fontFamily: 'Poppins', fontWeight: 'bold' }}>
              Technix is a state-approved engineering company, which operates in the scientific software development sectors dedicated to education and business.

              Technix uses a national and international partnership, it is made up of a group of experts, engineers and consultants who have proven their high qualification in the field of engineering and project management.
            </Typography>
          </Box>

          <Box sx={{
            flex: 1,
            display: { xs: 'none', md: 'block' },
            maxWidth: '400px',
          }}>
            <img src={aproposImage} alt="Technix illustration" style={{ width: '100%' }} />
          </Box>
        </Box>
      </Container>

      <Box sx={{ position: "fixed", bottom: 0, right: 0, margin: "20px" }}>
        {chatOpen && (
          <Box sx={{
            position: 'absolute',
            bottom: 80,
            right: 60,
            display: "flex",
            flexDirection: "column",
            width: "55vh",
            height: "60vh",
            backgroundColor: "#f0f0f0",
            border: "1px solid #ccc",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          }}>

            <Box
              sx={{
                borderBottom: "1px solid #ccc",
                padding: "10px",
                backgroundColor: "#fff",
              }}
            >
              <Typography variant="h6" sx={{ textAlign: "center" }}>Chat with ChatBOT</Typography>
            </Box>
            <Box
              sx={{
                overflowY: "scroll",
                flex: 1,
                padding: "10px",
              }}
            >
              {chatMessages.length > 0 ? (
                chatMessages.map((chat, index) => (
                  <ChatItem content={chat.content} role={chat.role} key={index} avatar={chat.role === 'user' ? <IoMdChatbubbles /> : null}
                  />
                ))
              ) : (
                <>
                  <Typography sx={{ color: "black", textAlign: "center" }}>
                    No messages to display
                  </Typography>
                  {showQuestions && (
                    <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      padding: "20px",
                      gap: "10px",
                      borderRadius: "20px",
                    }}
                    >
                      {predefinedQuestions.map((question, index) => (
                        <Button
                          key={index}
                          variant="outlined"
                          onClick={() => handleQuestionClick(question)}
                          sx={{  flex: 1,
                            margin: "5px",
                            whiteSpace: "nowrap",
                            width: "auto",
                            borderRadius: "40px", 
                            background: '#E1F7F5',

                        }}
                        >
                          {question}
                        </Button>
                      ))}
                    </Box>
                  )}
                </>
              )}
            </Box>
            <Box
              sx={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
                backgroundColor: "#fff",
              }}
            >
              <TextField
                inputRef={inputRef}
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Type your message here..."
                onKeyDown={handleKeyPress}
                sx={{ marginRight: "10px" }}
              />
              <IconButton onClick={handleSubmit}>
                <IoMdSend />
              </IconButton>
            </Box>
          </Box>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={toggleChat}
          sx={{
            position: 'fixed',
            bottom: buttonPosition.bottom,
            right: buttonPosition.right,
            borderRadius: "50%",
            padding: "20px",
            margin: "0",
            zIndex: 1000,
          }}
        >
          <IoMdChatbubbles size={35} />
        </Button>
      </Box>
    </>
  );
};

export default Chat;
