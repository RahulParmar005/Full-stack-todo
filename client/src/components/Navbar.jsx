import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "./assets/api";

const Navbar = ({ user, setUser }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post(`${API_URL}/api/auth/logout`, {}, { 
                withCredentials: true 
            });
        } catch (err) {
            console.log("Logout:", err.response?.data || err.message);
        }
        setUser(null);
        navigate("/");
    };

    return <nav className="bg-gray-800 text-white">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
            <Link to="/" className="font-bold">Home</Link>
            <div>
                {user ? (
                    <div className="flex gap-3 items-center">
                        <button onClick={handleLogout} className="bg-red-500 mr-6 px-3 py-1 rounded hover:bg-red-600">Logout</button>
                        <div className="bg-gray-500 rounded-full w-8 h-8 flex items-center justify-center">
                            {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                        </div>
                    </div>
                ) : (
                    <>
                        <Link to="/login" className="mx-2">Login</Link>
                        <Link to="/register" className="mx-2">Register</Link>
                    </>
                )}
            </div>
        </div>
    </nav>
}

export default Navbar;

