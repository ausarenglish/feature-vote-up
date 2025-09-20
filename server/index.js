import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/features', (req, res) => {
  try {
    const features = db.prepare('SELECT * FROM features ORDER BY votes DESC, created_at DESC').all();
    res.json(features);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch features' });
  }
});

app.post('/features', (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const result = db.prepare('INSERT INTO features (title) VALUES (?)').run(title);
    const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(result.lastInsertRowid);
    res.json(feature);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create feature' });
  }
});

app.post('/features/:id/upvote', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('UPDATE features SET votes = votes + 1 WHERE id = ?').run(id);
    const feature = db.prepare('SELECT * FROM features WHERE id = ?').get(id);
    
    if (!feature) {
      return res.status(404).json({ error: 'Feature not found' });
    }
    
    res.json(feature);
  } catch (error) {
    res.status(500).json({ error: 'Failed to upvote feature' });
  }
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});