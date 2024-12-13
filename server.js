import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import brandIdentityRoutes from './routes/BrandIdentity.js'; 

dotenv.config();

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Test API endpoint
app.get('/', (req, res) => res.send('API Running'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/brandIdentity', brandIdentityRoutes); 

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));