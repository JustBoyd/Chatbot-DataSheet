// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { buildExcelFile } = require('./excelUtil');

const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Route to receive chat data and convert it to an Excel file
// Adjust the route to extract category from request
app.post('/submit-chat-data', (req, res) => {
    const { category, responses } = req.body;
    
    try {
        // Pass both the category and the responses to buildExcelFile
        buildExcelFile(category, responses);
        res.json({ message: 'Data saved successfully.' });
    } catch (err) {
        console.error('Failed to save data:', err);
        res.status(500).json({ message: 'Failed to save data.', error: err.toString() });
    }
});

// Add this towards the end of your server.js file, before app.listen
app.get('/', (req, res) => {
    res.send('Chatbot data collection server is running.');
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

