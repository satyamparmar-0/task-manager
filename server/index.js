const express = require('express');
require('dotenv').config();
const cors = require('cors');
const passport = require('passport');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const passportSetup = require('./passport');
const authRoutes = require('./routes/user.auth.routes');
const taskRoutes = require('./routes/task.routes');
const dbconnection = require('./connection/database.config');

// Database connection
dbconnection();

app.use(session({
    secret: process.env.SESSION_SECRET, // Make sure this is set in your .env file
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: "http://localhost:3000", 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
