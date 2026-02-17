const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Connect to the database the Python script just updated
mongoose.connect('mongodb://localhost:27017/fraud_detection');

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

app.get('/', (req, res) => { res.render('dashboard'); });

app.listen(5000, () => console.log('Dashboard Server Running: http://localhost:5000'));