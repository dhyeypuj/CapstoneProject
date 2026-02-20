const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express(); // 1. INITIALIZE APP FIRST

// 2. DATABASE CONNECTION
mongoose.connect('mongodb://127.0.0.1:27017/fraud_detection')
    .then(() => console.log('MongoDB Connected to fraud_detection'))
    .catch(err => console.log('MongoDB Connection Error:', err));

// 3. MIDDLEWARE & SETTINGS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// 4. SESSION & AUTH CONFIGURATION
app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: false
}));

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// 5. API ROUTES (For your dashboard.js script)
app.get('/api/stats', async (req, res) => {
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

// 6. VIEW ROUTES (For navigating between pages)
app.use('/', require('./routes/auth'));

app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

// Alerts View (Anomaly Detection Output)
app.get('/alerts', async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const col = db.collection('transactions');
        // Fetch only flagged anomalies
        const alerts = await col.find({ isFraud: true }).sort({ _id: -1 }).limit(20).toArray();
        res.render('alerts', { alerts });
    } catch (err) {
        res.status(500).send("Error loading alerts: " + err.message);
    }
});

// Transactions View (Predictive Modeling History)
app.get('/transactions', async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const col = db.collection('transactions');
        // Fetch recent modeling history
        const transactions = await col.find().sort({ _id: -1 }).limit(50).toArray();
        res.render('transactions', { transactions });
    } catch (err) {
        res.status(500).send("Error loading transactions: " + err.message);
    }
});

// 7. START SERVER
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

