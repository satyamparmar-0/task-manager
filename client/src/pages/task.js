import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskBoard from '../components/taskboard'; // Component that implements drag-and-drop functionality

function TaskManager({ user }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/tasks`, {
          withCredentials: true,
        });
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const handleAddTask = async (newTask) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/tasks`, newTask, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
      setTasks([...tasks, response.data]); // Add the new task to the task list
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/tasks/${updatedTask._id}`, updatedTask, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
      setTasks(tasks.map(task => task._id === updatedTask._id ? response.data : task));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/tasks/${taskId}`, {
        withCredentials: true
      });
      setTasks(tasks.filter(task => task._id !== taskId)); // Remove task from list
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div>
      <h1>Welcome, {user.firstName}</h1>
      <TaskBoard tasks={tasks} onAddTask={handleAddTask} onUpdateTask={handleUpdateTask} onDeleteTask={handleDeleteTask} />
    </div>
  );
}

export default TaskManager;
