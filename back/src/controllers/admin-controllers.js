const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assurez-vous que le chemin est correct

// GET all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        console.log("Fetched users:", users);  // Add this line for debugging
        res.json(users);
    } catch (err) {
        console.error("Error fetching user data:", err.message);
        res.status(500).json({ message: err.message }); 
    }
});
//Get conversations 
/*router.get('/:userId/history', async (req, res) => {
    try {
      const chats = await chats.find({ userId: req.params.userId }).sort('timestamp');
      res.json({ chats });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });*/
  // Fonction pour envoyer les chats d'un utilisateur à l'admin
  /*router.get('/chats', async (req, res) => {
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
  });*/

  router.get('/:userId/chats', async (req, res) => {
    try {
        const userId = req.params.userId;
        
        // Récupérer l'utilisateur depuis la base de données
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Extraire les chats de l'utilisateur
        const userChats = user.chats;

        // Renvoyer les chats en réponse à la requête
        res.json({ chats: userChats });
    } catch (err) {
        console.error("Error fetching user chats:", err);
        res.status(500).json({ message: err.message });
    }
});

// GET one user by ID
router.get('/:id', getUser, (req, res) => {
    res.json(res.user);
});

// CREATE a new user
router.post('/', async (req, res) => {
    const user = new User(req.body);
    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE a user
router.put("/:id", getUser, async (req, res) => {
    try {
        console.log("Received update data:", req.body);
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        console.log("Updated user:", updatedUser);

        if (!updatedUser) {
            return res.status(404).json({ message: "Cannot find user" });
        }

        res.json(updatedUser);
    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ message: err.message });
    }
});

// DELETE a user
router.delete("/:id", async (req, res) => {
    try {
        const userId = req.params.id; // Get the ID from request parameters

        // Find the user by ID and remove
        const deletedUser = await User.findByIdAndDelete(userId); 

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' }); 
        }

        res.json({ message: 'User deleted successfully' }); 
    } catch (err) {
        console.error("Error deleting user:", err); 
        res.status(500).json({ 
            error: true,
            message: err.message,
            stackTrace: err.stack // Only for development
        });
    }
});

// Middleware to get a user by ID
async function getUser(req, res, next) {
    let user;
    try {
        user = await User.findOne({
            _id: req.params.id
        });
        if (user == null) {
            return res.status(404).json({ message: "Cannot find user" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.user = user;
    next();
}

module.exports = router;
