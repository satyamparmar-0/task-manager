const mongoose = require('mongoose');

const dbconnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true, // You can omit this now
        });
        console.log('Connected to database');
    } catch (error) {
        console.error('Error connecting to database', error);
    }
};

module.exports = dbconnection;
