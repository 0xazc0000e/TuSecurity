const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const MockStrategy = require('passport-mock-strategy');
const { prisma } = require('../models/prismaDatabase');
const { generateVerificationCode } = require('../services/emailService');

// Helper to find or create user from social profile
const findOrCreateUser = async (profile, provider, role = 'student') => {
    try {
        const email = profile.emails[0].value;

        // Check if user exists
        let user = await prisma.users.findUnique({
            where: { email }
        });

        if (user) {
            // User exists - just return user
            return user;
        } else {
            // Create new user
            const username = profile.displayName.replace(/\s+/g, '_').toLowerCase() + '_' + Math.floor(Math.random() * 1000);

            // For social login, we mark email as verified since the provider did it
            const newUser = await prisma.users.create({
                data: {
                    full_name: profile.displayName,
                    username,
                    email,
                    role,
                    email_verified: true,
                    created_at: new Date(),
                    provider
                }
            });

            return newUser;
        }
    } catch (error) {
        console.error('findOrCreateUser error:', error);
        throw error;
    }
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

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.users.findUnique({
            where: { id: parseInt(id) }
        });
        done(null, user);
    } catch (err) {
        done(err);
    }
});

module.exports = passport;
