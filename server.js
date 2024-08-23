const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes.mjs');

dotenv.config();

connectDB();

const app = express();

connectDB();

app.use(express.json());
app.use(cors());

app.use('/api/users', userRoutes);

app.get('/', (req, res) => res.send('API Running'));

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
