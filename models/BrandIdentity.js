import mongoose from 'mongoose';

const brandIdentitySchema = new mongoose.Schema({
    brandName: {
        type: String,
        required: [true, 'Brand name is required'],
        trim: true,
    },
    logo: {
        type: String,
        required: [true, 'Logo is required'], // Store file path or URL for the logo
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: [
            'Education',
            'Health',
            'Sport',
            'Agriculture',
            'Technology',
            'Food',
            'Other',
        ], // Ensures the value is one of the predefined categories
    },
    suggestions: {
        type: String,
        required: [true, 'Suggestions are required'],
        trim: true,
        maxlength: [500, 'Suggestions cannot exceed 500 characters'],
    },
    need: {
        type: [String],
        required: [true, 'At least one need must be selected'],
        validate: {
            validator: function (v) {
                return v.length > 0;
            },
            message: 'The "need" field must contain at least one item',
        },
    },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const BrandIdentity = mongoose.model('BrandIdentity', brandIdentitySchema);

export default BrandIdentity;
