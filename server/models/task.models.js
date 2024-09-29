const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  column: {
    type: String,
    required: true, // e.g., "To Do", "In Progress", "Done"
  },
  dueDate: {
    type: Date,
    required: false,
  },
  assignedTo: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    default: "To Do", // Default status
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
