const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

// Initialize Express App
const app = express();

// Middlewares


app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://blogify-rose-iota.vercel.app",
    "https://blogify-gcajsn4qn-college-projects2.vercel.app"
  ],
  credentials: true,
}));
app.use(express.json());

// Base Route
app.get('/', (req, res) => {
  res.send('Blogify Backend Running');
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// Handle undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Listen on configured port
const PORT = process.env.PORT || 5000;
app.listen /*Starts the backend server.*/ (PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
