const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the user schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: false, // Keep this as false
    },
    googleId: {
        type: String,
    },
}, { timestamps: true });

// Password hashing
userSchema.pre('save', async function (next) {
    const user = this;

    // Only hash the password if it exists and has been modified
    if (user.isModified('password') && user.password) {
        try {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        } catch (error) {
            return next(error);
        }
    }

    next();
});

// Create the model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
