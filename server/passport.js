    const passport = require('passport');
    const GoogleStrategy = require('passport-google-oauth20').Strategy;
    const User = require('./models/user.auth');
    const jwt = require('jsonwebtoken');

    // Configure Google Strategy
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ googleId: profile.id });

            if (!user) {
                user = new User({
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                });
                await user.save();
            }

            // Generate a JWT token
            const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1y' });
            return done(null, { user, token });
        } catch (err) {
            return done(err, null);
        }
    }));

    passport.serializeUser((data, done) => {
        done(null, data.user._id); // Serialize only the user ID
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
