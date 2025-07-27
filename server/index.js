const express = require('express');
const cors = require('cors'); 
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.route');
const messageRoutes = require('./routes/message.route');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();
const app = express();
const fs = require('fs');
const path = require('path');

console.log('__dirname:', __dirname);
console.log('Resolved path:', path.resolve(__dirname, '../models/Conversation.js'));

connectDB();



app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api/message', messageRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>  
  
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
