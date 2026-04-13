const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getItems,
    getItem,
    createItem,
    updateItem,
    deleteItem,
    getStats
} = require('../controllers/itemController');

// @route   GET /api/items/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', auth, getStats);

// @route   GET /api/items
// @desc    Get all items for logged-in user
// @access  Private
router.get('/', auth, getItems);

// @route   GET /api/items/:id
// @desc    Get single item by ID
// @access  Private
router.get('/:id', auth, getItem);

// @route   POST /api/items
// @desc    Create new item
// @access  Private
router.post('/', auth, createItem);

// @route   PUT /api/items/:id
// @desc    Update item
// @access  Private
router.put('/:id', auth, updateItem);

// @route   DELETE /api/items/:id
// @desc    Delete item
// @access  Private
router.delete('/:id', auth, deleteItem);

module.exports = router;
