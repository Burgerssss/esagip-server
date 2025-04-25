// Import dependencies
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const port = 3000;

// In-memory storage
let rescueRequests = [];
let messages = [];

// Middleware
app.use(express.json());

// Create HTTP server and Socket.IO instance
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (update for production)
    methods: ["GET", "POST"]
  }
});

// REST endpoint to create a rescue request
app.post('/request-rescue', (req, res) => {
  const { latitude, longitude } = req.body;
  const request = { latitude, longitude, timestamp: Date.now() };
  rescueRequests.push(request);

  const nearestRescuerLocation = {
    latitude: latitude + 0.01,
    longitude: longitude + 0.01
  };

  io.emit('new-rescue-request', { ...request, nearestRescuerLocation });
  res.json({ nearestRescuerLocation });
});

// REST endpoint to fetch all rescue requests
app.get('/get-rescue-requests', (req, res) => {
  res.json({ requests: rescueRequests });
});

// REST endpoint to fetch all chat messages
app.get('/get-messages', (req, res) => {
  res.json({ messages });
});

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Optional: Identify role (e.g., user or admin)
  socket.on('identify', (role) => {
    console.log(`Socket ${socket.id} identified as ${role}`);
    socket.data.role = role; // Store role on the socket
  });

  // Handle chat messages
  socket.on('send-chat-message', (message) => {
    console.log('Received chat message:', message);

    const fullMessage = {
      id: Date.now(),
      text: message.text,
      sender: message.sender || 'anonymous',
      timestamp: new Date().toISOString()
    };

    messages.push(fullMessage);

    // Broadcast to all other clients
    io.emit('receive-chat-message', fullMessage);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
