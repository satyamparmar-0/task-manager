import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function TaskBoard({ tasks, onAddTask, onUpdateTask, onDeleteTask }) {
  const handleAddTask = () => {
    const newTask = { title: 'New Task', column: 'To Do' };
    onAddTask(newTask);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const updatedTask = tasks[result.source.index];
    updatedTask.column = result.destination.droppableId; // Update task column based on drag
    onUpdateTask(updatedTask);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="To Do">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <h2>To Do</h2>
            {tasks.filter(task => task.column === 'To Do').map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <h3>{task.title}</h3>
                    <button onClick={() => onDeleteTask(task._id)}>Delete</button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <button onClick={handleAddTask}>Add Task</button>
    </DragDropContext>
  );
}

export default TaskBoard;
