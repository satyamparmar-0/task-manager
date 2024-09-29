const Task = require("../models/task.models");
const {taskValidation} = require("../validations/task.validations");

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }); // Find tasks for the logged-in user
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

exports.createTask = async (req, res) => {
    // Validate the request body
    const { error } = taskValidation(req.body);
    
    // If validation fails, return an error response
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({ message: 'Validation error', errors: errorMessages });
    }
  
    const { title, description, column, dueDate, assignedTo } = req.body;
    
    try {
      const task = new Task({
        title,
        description,
        column,
        dueDate,
        assignedTo,
        user: req.user._id, // Set the logged-in user as the owner of the task
      });
  
      await task.save();
      res.status(201).json(task);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error creating task' });
    }
  };

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, column, dueDate, assignedTo, status } = req.body;
  try {
    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user._id }, // Ensure the user owns the task
      { title, description, column, dueDate, assignedTo, status },
      { new: true }
    );
    if (!task)
      return res
        .status(404)
        .json({ message: "Task not found or not authorized" });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error updating task" });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findOneAndDelete({ _id: id, user: req.user._id }); // Ensure the user owns the task
    if (!task)
      return res
        .status(404)
        .json({ message: "Task not found or not authorized" });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task" });
  }
};
