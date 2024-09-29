import { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from '../components/taskform';
import { useLocation, useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import Navbar from '../components/navbar';
import '../styles/taskmanager.modules.css'; // Import external CSS file

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility
  const [currentTask, setCurrentTask] = useState(null); // State to store task being edited
  const location = useLocation();
  const navigate = useNavigate(); // Use navigate instead of useHistory

  const getQueryParams = (param) => {
    return new URLSearchParams(location.search).get(param);
  };

  useEffect(() => {
    const token = getQueryParams('token');

    // Only store the token if it's present in the URL
    if (token) {
      localStorage.setItem('token', token);

      // Update the URL to remove the token from the query string after saving it
      setTimeout(() => {
        navigate('/tasks'); // Use navigate to replace the URL without the token
      }, 100); // Short delay to ensure token is saved before URL change
    }

    const fetchTasks = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        console.log("No token found");
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/tasks/tasks`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [location, navigate]); // Added navigate as a dependency

  // Function to handle task update
  const handleUpdateTask = async (updatedTask) => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      console.log("No token found");
      return;
    }
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/tasks/tasks/${updatedTask._id}`, updatedTask, {
        headers: { Authorization: `Bearer ${storedToken}` }
      });
      setTasks(tasks.map(task => task._id === updatedTask._id ? response.data : task)); // Update task in the state
      setShowForm(false); // Hide form after update
      setCurrentTask(null); // Reset current task after update
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Function to handle task deletion
  const handleDeleteTask = async (taskId) => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      console.log("No token found");
      return;
    }
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/tasks/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${storedToken}` }
      });
      setTasks(tasks.filter(task => task._id !== taskId)); // Remove task from state
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Function to open the edit form for a specific task
  const handleEditTask = (task) => {
    setCurrentTask(task); // Set the task to be edited
    setShowForm(true); // Show the form
  };

  const renderTasks = (status) => {
    return tasks
      .filter((task) => task.column === status)
      .map((task) => (
        <div key={task._id} className="task-card">
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>Created at: {new Date(task.createdAt).toLocaleString()}</p>
          <div className="task-buttons">
            <button className="delete-btn" onClick={() => handleDeleteTask(task._id)}>Delete</button>
            <button className="edit-btn" onClick={() => handleEditTask(task)}>Edit</button>
            <button className="details-btn">View Details</button>
          </div>
        </div>
      ));
  };

  return (
    <div>
      <Navbar />
      <div className="task-manager-container">
        <button className="add-task-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Close Task Form' : 'Add Task'}
        </button>

        {showForm && (
          <TaskForm
            onTaskAdded={(newTask) => {
              if (currentTask) {
                handleUpdateTask(newTask); // Update if current task exists
              } else {
                setTasks((prevTasks) => [...prevTasks, newTask]); // Add new task if current task doesn't exist
              }
            }}
            initialData={currentTask} // Pass current task data for editing
          />
        )}

        <div className="task-column todo">
          <h2>TODO</h2>
          {renderTasks('To Do')}
        </div>
        <div className="task-column in-progress">
          <h2>IN PROGRESS</h2>
          {renderTasks('In Progress')}
        </div>
        <div className="task-column done">
          <h2>DONE</h2>
          {renderTasks('Done')}
        </div>
      </div>
    </div>
  );
}

export default TaskManager;
