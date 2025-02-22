import React from "react";

const TaskItem = ({ task, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-3 rounded-lg shadow-md mb-2">
      <h3 className="font-bold">{task.title}</h3>
      <p>{task.description}</p>
      <div className="flex justify-between mt-2">
        <button onClick={onEdit} className="btn bg-black/90  text-blue-500">
          Edit
        </button>
        <button onClick={onDelete} className="btn bg-black/90 text-red-500">
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
