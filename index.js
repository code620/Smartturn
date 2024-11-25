const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

// Replace with your TomTom API key
const TOMTOM_API_KEY = 'gdejqx7OnuWhUw6sX64o5mQUAtVgASCx';

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Navigation API! Use /get-navigation with origin and destination query parameters.');
});

// Route to fetch navigation data
app.get('/get-navigation', async (req, res) => {
    const { origin, destination } = req.query;

    if (!origin || !destination) {
        return res.status(400).json({ error: 'Origin and destination are required.' });
    }

    try {
        // Parse origin and destination coordinates (latitude,longitude format)
        const url = `https://api.tomtom.com/routing/1/calculateRoute/${encodeURIComponent(origin)}:${encodeURIComponent(destination)}/json?key=${TOMTOM_API_KEY}`;
        
        // Fetch data from TomTom API
        const response = await axios.get(url);
        const data = response.data;

        // Extract relevant details
        if (data.routes && data.routes.length > 0) {
            const steps = data.routes[0].legs[0].points.map(point => ({
                latitude: point.latitude,
                longitude: point.longitude
            }));

            res.json({ steps });
        } else {
            res.status(404).json({ error: 'No route found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching data from TomTom.' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
});
