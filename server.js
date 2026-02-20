require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const admin = require('firebase-admin');

// --- Firebase Admin SDK Initialization ---
const serviceAccount = require(path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS));
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Connect to the database the Python script just updated (non-blocking)
mongoose.connect('mongodb://localhost:27017/fraud_detection')
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => console.warn('⚠️  MongoDB not available:', err.message, '\n   Auth will still work, but /api/stats needs MongoDB.'));

// --- Authentication Middleware ---
async function ensureAuthenticated(req, res, next) {
    const sessionCookie = req.cookies.session || '';
    if (!sessionCookie) {
        return res.redirect('/login');
    }
    try {
        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
        req.user = decodedClaims;
        next();
    } catch (error) {
        res.redirect('/login');
    }
}

// --- Auth Routes ---

// Login page
app.get('/login', (req, res) => {
    res.render('login', { firebaseApiKey: process.env.FIREBASE_API_KEY });
});

// Session login: receives Firebase ID token from the client, creates a server-side session cookie
app.post('/sessionLogin', async (req, res) => {
    const idToken = req.body.idToken;
    // Set session expiration to 5 days
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    try {
        const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
        const options = { maxAge: expiresIn, httpOnly: true, secure: false /* set to true in production with HTTPS */ };
        res.cookie('session', sessionCookie, options);
        res.json({ status: 'success' });
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized request. Failed to create session.' });
    }
});

// Logout
app.get('/logout', (req, res) => {
    res.clearCookie('session');
    res.redirect('/login');
});

// --- Protected Routes ---

app.get('/api/stats', ensureAuthenticated, async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const col = db.collection('transactions');

        const totalTransactions = await col.countDocuments();
        const fraudsDetected = await col.countDocuments({ isFraud: true });

        const result = await col.aggregate([
            { $group: { _id: null, avgRisk: { $avg: "$riskScore" } } }
        ]).toArray();

        res.json({
            totalTransactions,
            fraudsDetected,
            globalRiskScore: result.length > 0 ? Math.round(result[0].avgRisk) : 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/', ensureAuthenticated, (req, res) => {
    res.render('dashboard', { user: req.user });
});

app.listen(5000, () => console.log('Dashboard Server Running: http://localhost:5000'));