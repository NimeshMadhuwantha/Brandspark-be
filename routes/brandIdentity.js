import express from 'express';
import multer from 'multer';
import BrandIdentity from '../models/BrandIdentity.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to store uploaded files
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName); // Save file with a unique name
    },
});

const upload = multer({ storage });

// @route   POST /api/brandidentity/submit
// @desc    Submit brand identity form
// @access  Public
router.post('/submit', upload.single('logo'), async (req, res) => {
    const { brandName, category, suggestions, need } = req.body;

    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'Logo is required' });
        }

        const newBrandIdentity = new BrandIdentity({
            brandName,
            logo: req.file.filename, // Save the file name only
            category,
            suggestions,
            need: JSON.parse(need), // Parse "need" field into an array
        });

        await newBrandIdentity.save();
        res.status(201).json({ msg: 'Brand identity submitted successfully', newBrandIdentity });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error. Submission failed.', error: err.message });
    }
});

// @route   GET /api/brandidentity
// @desc    Get all brand identity submissions
// @access  Admin
router.get('/', async (req, res) => {
    try {
        const brandIdentities = await BrandIdentity.find().sort({ createdAt: -1 }); // Sorted by most recent
        res.json(brandIdentities);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// @route   GET /api/brandidentity/:id
// @desc    Get a single brand identity submission by ID
// @access  Admin
router.get('/:id', async (req, res) => {
    try {
        const brandIdentity = await BrandIdentity.findById(req.params.id);
        if (!brandIdentity) {
            return res.status(404).json({ msg: 'Brand identity not found' });
        }

        res.json({
            ...brandIdentity._doc,
            logo: `data:${brandIdentity.logo.contentType};base64,${brandIdentity.logo.data.toString('base64')}`,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});


// @route   DELETE /api/brandidentity/:id
// @desc    Delete a brand identity submission by ID
// @access  Admin
router.delete('/:id', async (req, res) => {
    try {
        const brandIdentity = await BrandIdentity.findById(req.params.id);
        if (!brandIdentity) {
            return res.status(404).json({ msg: 'Brand identity not found' });
        }

        await brandIdentity.remove();
        res.json({ msg: 'Brand identity removed successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

export default router;
