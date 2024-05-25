const express = require("express");
const { config } = require("dotenv");
const morgan = require("morgan");
const appRouter = require("./routes/index.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const axios = require('axios').default;
const errorhandler = require('errorhandler')
config();

const app = express();

//middlewares
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser(COOKIE_SECRET='52777358'));
app.use(errorhandler({dumpException: true, showStack: true}));
app.use(morgan("dev"));

app.use("/api/v1", appRouter);
 /*app.post('/chat/v1/chat/completions', async (req, res) => {
     // URL of the secondary server
     const apiUrl = 'http://127.0.0.1:1338/v1/chat/completions';

     try {
        // Forward the request body from the incoming request to the secondary server
       const response = await axios.post(apiUrl, req.body);

        // Respond with the data received from the secondary server
        res.json(response.data);
    } catch (error) {
        // Handle errors, such as network errors or bad responses
        res.status(500).json({ error: error.message });
    }
 });*/

module.exports = app;
