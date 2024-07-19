import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));






/* import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const PORT = 5000;
const URL = "mongodb+srv://nethhari:Chemma%40mongodb@cluster0.6co1avu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

mongoose.connect(URL)
   .then(() => {
        console.log("Connected")
    })
    .catch((e) => {
        console.log("DB error", e)
    }) 

app.post('/models/Customer', async (req, res) => {
    const { firstName, secondName, email, password } = req.body;
    
    try {
        const newCustomer = new Customer({ firstName, secondName, email, password });
        await newCustomer.save();
        res.status(201).send({ message: 'User signed up successfully' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

app.post('/models/Customer', async (req, res) => {
    const { email, password } = req.body;

    try {
        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }

        res.status(200).send({ message: 'User logged in successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`)); */