import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/taskform.modules.css'; // Import your CSS

function TaskForm({ onTaskAdded, initialData }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    column: "To Do", // Default column
    dueDate: "",
    assignedTo: ""
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData); // Pre-fill the form if editing a task
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const token = localStorage.getItem('token'); // Get the token from localStorage
    
    try {
      if (initialData) {
        onTaskAdded({ ...formData, _id: initialData._id }); // Update task
      } else {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/tasks/tasks`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach the token
            },
          }
        );
        if (response.status === 201) {
          onTaskAdded(response.data); // Pass the new task back to the parent to update the task list
        }
      }
      setFormData({
        title: "",
        description: "",
        column: "To Do",
        dueDate: "",
        assignedTo: ""
      }); // Clear the form after successful submission
    } catch (error) {
      console.error("Error adding task:", error.response.data);
      setError(error.response.data.message || "Error adding task");
    }
  };

  return (
    <div className="task-form-container">
      <h2>{initialData ? "Edit Task" : "Add New Task"}</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="form-group">
          <label>Column:</label>
          <select name="column" value={formData.column} onChange={handleChange}>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
        <div className="form-group">
          <label>Due Date:</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Assigned To:</label>
          <input
            type="text"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
          />
        </div>
        <button className="submit-btn" type="submit">
          {initialData ? "Update Task" : "Add Task"}
        </button>
      </form>
    </div>
  );
}

export default TaskForm;
