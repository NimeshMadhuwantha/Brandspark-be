import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const expertSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters long'],
        validate: {
            validator: function (v) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[d]).+$/.test(v);
            },
            message: 'Password must contain at least one lowercase letter, one uppercase letter, and one number'
        }
    }
});

expertSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const Expert = mongoose.model('Expert', expertSchema);

export default Expert;
