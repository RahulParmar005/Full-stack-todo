import React, { useEffect, useState } from "react";
import axios from "axios";
import List from "./List";
import { API_URL } from "./assets/api";

const Todo = () => {
    const [description, setdescription] = useState("");
    const [todos, setTodos] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleChange = (event) => {
        setdescription(event.target.value);
    };

    const handleToggleComplete = async (id, completed) => {
        try {
            await axios.put(`${API_URL}/api/auth/me/todos/${id}`, { completed }, { withCredentials: true });
            setTodos(todos.map(t => t.id === id ? { ...t, completed } : t));
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateTodo = async (id, newDescription) => {
        try {
            const todo = todos.find(t => t.id === id);
            await axios.put(`${API_URL}/api/auth/me/todos/${id}`, { 
                description: newDescription, 
                completed: todo?.completed || false 
            }, { withCredentials: true });
            setTodos(todos.map(t => t.id === id ? { ...t, description: newDescription } : t));
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteTodo = async (id) => {
        try {
            await axios.delete(`${API_URL}/api/auth/me/todos/${id}`, { withCredentials: true });
            setTodos(todos.filter(t => t.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const getTodo = async () => {
        try {
            setLoading(true);
            setError(null)
            const res = await axios.get(`${API_URL}/api/auth/me/todos`, { withCredentials: true });
            setTodos(res.data.todo || []);
            console.log(res.data);
        } catch (err) {
            console.error(err.message);
            setError("Failed to fetch Todos")
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getTodo();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!description.trim()) return;

        try {
            setError(null);
            const res = await axios.post(`${API_URL}/api/auth/me/todos`, { description, completed: false }, { withCredentials: true });
            setTodos([...todos, res.data]);
            setdescription("");
        } catch (err) {
            console.error(err.message);
            setError("Failed to add todo, Please try again");
        }
    }

    return (
        <div className="w-full max-w-lg">
            <div className="bg-gray-50 rounded-[32px] w-full p-6 shadow-2xl">
                <h2 className="text-4xl text-gray-800 font-bold text-center mb-3">Your Todo App</h2>
                {error && (
                    <div className="text-red-700 p-2 mb-2 bg-red-50 rounded-lg">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="flex items-center gap-2 p-1">
                    <input
                        className="w-full flex-1 outline-none px-3 py-2 text-gray-700 font-bold placeholder-gray-500 border-b shadow-2xl focus:border-blue-500 focus:shadow-blue-200 transition-all duration-200"
                        type="text" 
                        value={description}
                        onChange={handleChange}
                        placeholder="What needs to be done"
                        required 
                    />
                    <button 
                        className="bg-blue-600 hover:bg-blue-700 p-2 rounded-md font-medium text-white shadow-2xl transition-all duration-200 px-6 whitespace-nowrap" 
                        type="submit"
                    >
                        Add task
                    </button>
                </form>
                <div className="flex flex-col gap-4 mt-5">
                    {loading ? (
                        <div className="flex justify-center items-center p-8">
                            <p className="text-gray-700 font-extrabold text-lg">Loading...</p>
                        </div>
                    ) : todos.length === 0 ? (
                        <p className="text-gray-600 text-center py-8 font-medium">No tasks available, add a new task!</p>
                    ) : (
                        todos.map((todo) => (
                            <List 
                                key={todo.id} 
                                todo={todo}
                                onToggle={handleToggleComplete}
                                onUpdate={handleUpdateTodo}
                                onDelete={handleDeleteTodo}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
export default Todo;

