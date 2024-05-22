const express = require("express");
const bcrypt = require("bcrypt");
const { MongoClient, ObjectId } = require("mongodb");
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 5000;

// MongoDB Connection URI
const uri = "mongodb+srv://vidhyasagargslv:FRKUMwD3eajoO4vD@cluster0.olgmmtl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a new MongoClient
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let db, usercollection;

// Connect the client to the server
client.connect()
    .then(() => {
        console.log("Connected to MongoDB");
        db = client.db("capstone");
        usercollection = db.collection("users");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });

// Register endpoint
app.post('/api/v1/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await usercollection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await usercollection.insertOne({ username, email, password: hashedPassword });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login endpoint
app.post('/api/v1/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await usercollection.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        res.status(200).json({ message: 'Login successful', userId: user._id });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to like/unlike products
app.post('/api/v1/user/like/:userId', async (req, res) => {
    const { userId } = req.params;
    const { productId } = req.body;
    try {
        const user = await usercollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        let updatedLikedProducts;
        if (user.likedProducts && user.likedProducts.includes(productId)) {
            updatedLikedProducts = user.likedProducts.filter(id => id !== productId);
        } else {
            updatedLikedProducts = [...(user.likedProducts || []), productId];
        }
        await usercollection.updateOne({ _id: new ObjectId(userId) }, { $set: { likedProducts: updatedLikedProducts } });
        res.status(200).json({ message: 'Product liked/unliked successfully' });
    } catch (error) {
        console.error('Error liking/unliking product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user's liked products
app.get('/api/v1/user/likedProducts/:userId', async (req, res) => {
    try {
        const userId = new ObjectId(req.params.userId);
        const user = await usercollection.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.likedProducts || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user data by ID
app.get('/api/v1/user/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await usercollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Get user's favorites
app.get('/api/v1/favorites/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await usercollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.likedProducts && user.likedProducts.length > 0) {
            res.status(200).json({ favorites: user.likedProducts });
        } else {
            res.status(200).json({ favorites: [] });
        }
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// add post endpoint to store room folder in user collection
// Add a new endpoint to create a room folder for the user
app.post('/api/v1/user/rooms/:userId', async (req, res) => {
    const { userId } = req.params;
    const { roomName } = req.body;
    try {
        const user = await usercollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Check if the 'rooms' field exists, if not, initialize it as an empty object
        if (!user.rooms) {
            user.rooms = {};
        }
        // Add the room name to the 'rooms' object
        user.rooms[roomName] = { username: user.username };
        await usercollection.updateOne({ _id: new ObjectId(userId) }, { $set: { rooms: user.rooms } });
        res.status(200).json({ message: 'Room added successfully' });
    } catch (error) {
        console.error('Error adding room:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user's room
app.get('/api/v1/user/rooms/:userId', async (req, res) => {
    try {
        const user = await usercollection.findOne({ _id: new ObjectId(req.params.userId) });
        if (user && user.rooms) {
            res.json({ rooms: user.rooms });
        } else {
            res.status(404).json({ message: 'Rooms not found' });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/api/v1/products/:productId', async (req, res) => {
    const { productId, roomName } = req.body;
  
    // Find the user
    const user = await User.findById(req.userId);
  
    // Add the product ID to the correct room
    user.rooms[roomName].push(productId);
  
    // Save the user
    await user.save();
  
    res.send('Product stored successfully');
  });


  // Add a product to a room
// Add a product to a room
app.post('/api/v1/user/rooms/:userId/addProduct', async (req, res) => {
    const { userId } = req.params;
    const { productId, roomName } = req.body;
  
    try {
      const user = await usercollection.findOne({ _id: new ObjectId(userId) });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      if (!user.rooms || !user.rooms[roomName]) {
        return res.status(404).json({ error: 'Room not found' });
      }
  
      if (!user.rooms[roomName].products) {
        user.rooms[roomName].products = [];
      }
  
      user.rooms[roomName].products.push(productId);
  
      await usercollection.updateOne({ _id: new ObjectId(userId) }, { $set: { rooms: user.rooms } });
  
      res.status(200).json({ message: 'Product added to room successfully' });
    } catch (error) {
      console.error('Error adding product to room:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/v1/user/rooms/:userId/productIds', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      // Assuming you have a method to find rooms by user ID in your Room model
      const rooms = await Room.find({ userId });
  
      // Extract product IDs from rooms data
      const productIds = rooms.reduce((ids, room) => {
        if (room.products) {
          // Assuming products is an array of product IDs in each room
          ids.push(...room.products);
        }
        return ids;
      }, []);
  
      res.status(200).json({ productIds });
    } catch (error) {
      console.error('Error fetching product IDs:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.put('/api/v1/user/rooms/:roomId', async (req, res) => {
    const { roomId } = req.params;
    const { newRoomName } = req.body;
  
    try {
      const user = await usercollection.findOne({ [`rooms.${roomId}`]: { $exists: true } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const updatedUser = await usercollection.updateOne(
        { [`rooms.${roomId}`]: { $exists: true } },
        { $rename: { [`rooms.${roomId}`]: `rooms.${newRoomName}` } }
      );
  
      if (updatedUser.modifiedCount === 1) {
        res.status(200).json({ message: 'Room name updated successfully' });
      } else {
        res.status(404).json({ error: 'Room not found' });
      }
    } catch (error) {
      console.error('Error updating room name:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.delete('/api/v1/user/rooms/:userId/:roomName', async (req, res) => {
    const { userId, roomName } = req.params;
  
    try {
      const user = await usercollection.findOne({ _id: new ObjectId(userId) });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      if (!user.rooms || !user.rooms[roomName]) {
        return res.status(404).json({ error: 'Room not found' });
      }
  
      // Remove the room from the user's rooms object
      delete user.rooms[roomName];
  
      await usercollection.updateOne({ _id: new ObjectId(userId) }, { $set: { rooms: user.rooms } });
  
      res.status(200).json({ message: 'Room deleted successfully' });
    } catch (error) {
      console.error('Error deleting room:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.delete('/api/v1/user/rooms/:userId/:roomName/:productId', async (req, res) => {
    const { userId, roomName, productId } = req.params;
  
    try {
        const user = await usercollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
  
        // Check if the room exists
        if (!user.rooms || !user.rooms[roomName]) {
            return res.status(404).json({ error: 'Room not found' });
        }
  
        // Remove the product from the room
        const updatedRooms = { ...user.rooms };
        updatedRooms[roomName].products = updatedRooms[roomName].products.filter(id => id.toString() !== productId);
  
        // Update the user in the database
        await usercollection.updateOne({ _id: new ObjectId(userId) }, { $set: { rooms: updatedRooms } });
  
        res.status(200).json({ message: 'Product removed successfully' });
    } catch (error) {
        console.error('Error removing product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
