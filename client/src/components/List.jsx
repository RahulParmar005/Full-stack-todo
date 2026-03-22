import React, { useState } from "react";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Check as CheckIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";

const List = ({ todo, onToggle, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
const [editText, setEditText] = useState(todo.description || '');
  const [completed, setCompleted] = useState(todo.completed || false);

  const handleToggle = () => {
    const newCompleted = !completed;
    setCompleted(newCompleted);
    if (onToggle) onToggle(todo.id, newCompleted);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(todo.description);
  };

  const handleSave = () => {
    if (editText.trim() && onUpdate) onUpdate(todo.id, editText.trim());
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(todo.id);
  };

  return (
    <div className="pb-1">
      {isEditing ? (
        <div className="flex items-center gap-2 mb-1 justify-center">
          <input
            className="w-full flex-1 outline-none px-3 py-2 text-gray-700 font-bold placeholder-gray-500 border-b-2 border-gray-300 shadow-2xl focus:border-green-500 focus:shadow-green-200 transition-all duration-200"
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') setIsEditing(false);
            }}
          />
          <button 
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-600 p-2 rounded-md font-medium text-white shadow-2xl transition-all duration-200"
          >
            <CheckIcon fontSize="small" />
          </button>
          <button 
            onClick={() => setIsEditing(false)}
            className="bg-gray-500 hover:bg-gray-600 p-2 rounded-md font-medium text-white shadow-2xl transition-all duration-200"
          >
            <ClearIcon fontSize="small" />
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 mb-2 overflow-hidden">
            <button 
              onClick={handleToggle}
              className={`flex-shrink-0 h-6 w-6 border-2 rounded-full flex items-center justify-center transition-all duration-200 ${
                completed 
                  ? 'bg-green-500 border-green-600 text-white shadow-md' 
                  : 'bg-gray-300 border-gray-400 hover:border-gray-500 hover:bg-gray-400'
              }`}
            >
              {completed && <CheckIcon fontSize="small" />}
            </button>
            <span className={`font-medium text-gray-700 ${completed ? 'line-through decoration-gray-400' : ''}`}>
              {todo.description}
            </span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleEdit} 
              className="p-2 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-100 duration-200 transition-all"
            >
              <EditIcon fontSize="small" />
            </button>
            <button 
              onClick={handleDelete}
              className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-100 duration-200 transition-all"
            >
              <DeleteIcon fontSize="small" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;

