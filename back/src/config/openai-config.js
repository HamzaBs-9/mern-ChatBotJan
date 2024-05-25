const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors()); 
// This function returns a new instance of OpenAIApi configured with your API key.
/*function getOpenAIInstance() {
  return new OpenAIApi({
    apiKey: process.env.OPEN_AI_SECRET,
    organization: process.env.OPENAI_ORAGANIZATION_ID // Ensure this env variable is correctly spelled and set
  });
}

module.exports = { getOpenAIInstance };*/
app.post('/v1/chat/completions', (req, res) => {
  // This is just a simple handler that echoes the request back.
  // You can modify it to perform whatever processing you need.
  // Simulate generating a response
  const userMessage = req.body.messages.find(msg => msg.role === 'user').content;
  const reply = `Echoing back your message: ${userMessage}`;

  console.log("Received data:", req.body);
  res.status(200).json({
    id: "example_id",
    object: "chat.completion",
    created: Math.floor(Date.now() / 1000),
    model: "text-davinci-002",
    choices: [
      {
        message: { text: reply },
        index: 0,
        logprobs: null,
        finish_reason: "stopped"
      }
    ],
    usage: {
      prompt_tokens: 10,
      completion_tokens: 5,
      total_tokens: 15
    }
  });
});
