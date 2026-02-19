const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const MockStrategy = require('passport-mock-strategy');
const { db } = require('../models/database');
const { generateVerificationCode } = require('../services/emailService');

// Helper to find or create user from social profile
const findOrCreateUser = async (profile, provider, role = 'student') => {
    return new Promise((resolve, reject) => {
        const email = profile.emails[0].value;

        // Check if user exists
        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
            if (err) return reject(err);

            if (user) {
                // User exists - update provider ID if needed, or just return user
                return resolve(user);
            } else {
                // Create new user
                const username = profile.displayName.replace(/\s+/g, '_').toLowerCase() + '_' + Math.floor(Math.random() * 1000);

                // For social login, we mark email as verified since the provider did it
                db.run(
                    `INSERT INTO users (full_name, username, email, role, email_verified, created_at, provider) 
                     VALUES (?, ?, ?, ?, 1, datetime("now"), ?)`,
                    [profile.displayName, username, email, role, provider],
                    function (err) {
                        if (err) return reject(err);

                        // Return the new user object
                        resolve({
                            id: this.lastID,
                            username,
                            email,
                            role,
                            email_verified: 1
                        });
                    }
                );
            }
        });
    });
};

// Check if keys are present
const hasGoogleKeys = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CLIENT_ID !== 'mock_client_id';
const hasMicrosoftKeys = process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET && process.env.MICROSOFT_CLIENT_ID !== 'mock_client_id';

// Google Strategy
if (hasGoogleKeys) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback"
    },
        async function (accessToken, refreshToken, profile, cb) {
            try {
                const user = await findOrCreateUser(profile, 'google');
                return cb(null, user);
            } catch (err) {
                return cb(err);
            }
        }
    ));
} else {
    // Mock Google Strategy
    passport.use('google', new MockStrategy({
        name: 'google',
        user: {
            id: 'mock-google-id',
            displayName: 'Google Dev User',
            emails: [{ value: 'dev.google@example.com' }]
        }
    }, async (user, done) => {
        try {
            const dbUser = await findOrCreateUser(user, 'google');
            done(null, dbUser);
        } catch (err) {
            done(err);
        }
    }));
}

// Microsoft Strategy
if (hasMicrosoftKeys) {
    passport.use(new MicrosoftStrategy({
        clientID: process.env.MICROSOFT_CLIENT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        callbackURL: "/api/auth/microsoft/callback",
        scope: ['user.read']
    },
        async function (accessToken, refreshToken, profile, done) {
            try {
                const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : profile._json.mail || profile._json.userPrincipalName;
                if (!email) return done(new Error("No email found in Microsoft profile"));

                const userProfile = { ...profile, emails: [{ value: email }] };
                const user = await findOrCreateUser(userProfile, 'microsoft');
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    ));
} else {
    // Mock Microsoft Strategy
    passport.use('microsoft', new MockStrategy({
        name: 'microsoft',
        user: {
            id: 'mock-microsoft-id',
            displayName: 'Microsoft Dev User',
            emails: [{ value: 'dev.microsoft@example.com' }]
        }
    }, async (user, done) => {
        try {
            const dbUser = await findOrCreateUser(user, 'microsoft');
            done(null, dbUser);
        } catch (err) {
            done(err);
        }
    }));
}

// Serialize/Deserialize
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, user) => {
        done(err, user);
    });
});

module.exports = passport;
