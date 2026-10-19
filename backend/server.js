const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const db = require('./db');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Travel Destination Guide API is running!' });
});

// GET: Retrieve all destinations
app.get('/api/destinations', (req, res) => {
    try {
        const destinations = db.prepare(
            'SELECT * FROM destinations ORDER BY id'
        ).all();

        res.json(destinations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve destinations.' });
    }
});

// GET: Retrieve one destination by ID
app.get('/api/destinations/:id', (req, res) => {
    try {
        const destination = db.prepare(
            'SELECT * FROM destinations WHERE id = ?'
        ).get(req.params.id);

        if (!destination) {
            return res.status(404).json({ error: 'Destination not found.' });
        }

        res.json(destination);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve destination.' });
    }
});

// POST: Add a destination
app.post('/api/destinations', (req, res) => {
    const {
        destination,
        country,
        description,
        best_time_to_visit,
        estimated_budget
    } = req.body;

    if (!destination || !country) {
        return res.status(400).json({
            error: 'Destination and country are required.'
        });
    }

    try {
        const result = db.prepare(`
            INSERT INTO destinations
            (destination, country, description, best_time_to_visit, estimated_budget)
            VALUES (?, ?, ?, ?, ?)
        `).run(
            destination,
            country,
            description || null,
            best_time_to_visit || null,
            estimated_budget ?? null
        );

        const newDestination = db.prepare(
            'SELECT * FROM destinations WHERE id = ?'
        ).get(result.lastInsertRowid);

        res.status(201).json(newDestination);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create destination.' });
    }
});

// PUT: Update a destination
app.put('/api/destinations/:id', (req, res) => {
    const {
        destination,
        country,
        description,
        best_time_to_visit,
        estimated_budget
    } = req.body;

    if (!destination || !country) {
        return res.status(400).json({
            error: 'Destination and country are required.'
        });
    }

    try {
        const result = db.prepare(`
            UPDATE destinations
            SET destination = ?,
                country = ?,
                description = ?,
                best_time_to_visit = ?,
                estimated_budget = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(
            destination,
            country,
            description || null,
            best_time_to_visit || null,
            estimated_budget ?? null,
            req.params.id
        );

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Destination not found.' });
        }

        const updatedDestination = db.prepare(
            'SELECT * FROM destinations WHERE id = ?'
        ).get(req.params.id);

        res.json(updatedDestination);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update destination.' });
    }
});

// DELETE: Remove a destination
app.delete('/api/destinations/:id', (req, res) => {
    try {
        const result = db.prepare(
            'DELETE FROM destinations WHERE id = ?'
        ).run(req.params.id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Destination not found.' });
        }

        res.json({ message: 'Destination deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete destination.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});