import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import Customer from './models/Customer.js'; // Adjust the path as necessary

const app = express();
const PORT = 5000;
const URL = "mongodb+srv://nethhari:Chemma%40mongodb@cluster0.6co1avu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((e) => {
        console.log("DB error", e);
    });

app.post('/api/signup', async (req, res) => {
    const { firstName, secondName, email, password } = req.body;
    
    try {
        const newCustomer = new Customer({ firstName, secondName, email, password });
        await newCustomer.save();
        res.status(201).send({ message: 'User signed up successfully' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
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

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
