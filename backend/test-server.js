const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}));

app.get('/test', (req, res) => {
    res.json({ message: 'Test server working!', time: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log('✅ Test server running on port', PORT);
});
