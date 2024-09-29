const express = require('express');
const router = express.Router();
const {authenticateUser} = require('../middlewares/user.auth.middlewares');

const {getAllTasks, createTask, updateTask, deleteTask} = require('../controllers/task.controllers');
// Get all tasks for the logged-in user
router.get('/tasks', authenticateUser,getAllTasks);

// Create a new task for the logged-in user
router.post('/tasks', authenticateUser,createTask);

// Update a task for the logged-in user
router.put('/tasks/:id', authenticateUser,updateTask);

// Delete a task for the logged-in user
router.delete('/tasks/:id', authenticateUser, deleteTask);

module.exports = router;
