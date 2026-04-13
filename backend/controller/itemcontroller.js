const db = require('../config/db');

// Get all items for logged-in user
const getItems = async (req, res) => {
    try {
        const [items] = await db.query(
            'SELECT * FROM items WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );

        res.json({ items });
    } catch (error) {
        console.error('Get items error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single item by ID
const getItem = async (req, res) => {
    try {
        const { id } = req.params;

        const [items] = await db.query(
            'SELECT * FROM items WHERE id = ? AND user_id = ?',
            [id, req.user.id]
        );

        if (items.length === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.json({ item: items[0] });
    } catch (error) {
        console.error('Get item error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create new item
const createItem = async (req, res) => {
    try {
        const { title, description, status = 'active' } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const [result] = await db.query(
            'INSERT INTO items (user_id, title, description, status) VALUES (?, ?, ?, ?)',
            [req.user.id, title, description, status]
        );

        // Get the created item
        const [items] = await db.query(
            'SELECT * FROM items WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({
            message: 'Item created successfully',
            item: items[0]
        });
    } catch (error) {
        console.error('Create item error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update item
const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;

        // Check if item exists and belongs to user
        const [existingItems] = await db.query(
            'SELECT id FROM items WHERE id = ? AND user_id = ?',
            [id, req.user.id]
        );

        if (existingItems.length === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Build update query dynamically
        const updates = [];
        const values = [];

        if (title !== undefined) {
            updates.push('title = ?');
            values.push(title);
        }
        if (description !== undefined) {
            updates.push('description = ?');
            values.push(description);
        }
        if (status !== undefined) {
            updates.push('status = ?');
            values.push(status);
        }

        if (updates.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        values.push(id, req.user.id);

        await db.query(
            `UPDATE items SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
            values
        );

        // Get updated item
        const [items] = await db.query(
            'SELECT * FROM items WHERE id = ?',
            [id]
        );

        res.json({
            message: 'Item updated successfully',
            item: items[0]
        });
    } catch (error) {
        console.error('Update item error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete item
const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if item exists and belongs to user
        const [existingItems] = await db.query(
            'SELECT id FROM items WHERE id = ? AND user_id = ?',
            [id, req.user.id]
        );

        if (existingItems.length === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        await db.query(
            'DELETE FROM items WHERE id = ? AND user_id = ?',
            [id, req.user.id]
        );

        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Delete item error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get dashboard statistics
const getStats = async (req, res) => {
    try {
        const [stats] = await db.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
            FROM items 
            WHERE user_id = ?
        `, [req.user.id]);

        res.json({ stats: stats[0] });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getItems,
    getItem,
    createItem,
    updateItem,
    deleteItem,
    getStats
};
