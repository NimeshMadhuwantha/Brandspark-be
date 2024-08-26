import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import Customer from '../models/Customer.js';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Define a constant for the login image URL
const LOGIN_IMAGE_URL = '../../assets/login.png';

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const customer = await Customer.findOne({ email });

        if (!customer) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, customer.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            customer: {
                id: customer.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    customer: {
                        firstName: customer.firstName,
                        lastName: customer.lastName,
                        email: customer.email,
                        image: LOGIN_IMAGE_URL // Use the constant image URL
                    }
                });
            }
        );
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Signup route
router.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        let customer = await Customer.findOne({ email });

        if (customer) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        customer = new Customer({
            firstName,
            lastName,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);
        customer.password = await bcrypt.hash(password, salt);

        await customer.save();

        const payload = {
            customer: {
                id: customer.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    customer: {
                        firstName: customer.firstName,
                        lastName: customer.lastName,
                        email: customer.email,
                        image: LOGIN_IMAGE_URL // Use the constant image URL
                    }
                });
            }
        );
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Google Auth route
router.post('/google', async (req, res) => {
    const { tokenId } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const { name, email } = ticket.getPayload();

        let customer = await Customer.findOne({ email });

        if (!customer) {
            customer = new Customer({
                firstName: name.split(' ')[0],
                lastName: name.split(' ')[1],
                email,
                password: 'google-auth'
            });

            await customer.save();
        }

        const payload = {
            customer: {
                id: customer.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    customer: {
                        firstName: customer.firstName,
                        lastName: customer.lastName,
                        email: customer.email,
                        image: LOGIN_IMAGE_URL // Use the constant image URL
                    }
                });
            }
        );
    } catch (err) {
        res.status(500).send('Server error');
    }
});

export default router;
