import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "./NotFound";
axios.defaults.withCredentials = true;     

function App() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/auth/me");
                setUser(res.data.user);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    if(loading) {
        return <div className="bg-gray-900 min-h-screen flex justify-center items-center"><p className="text-4xl text-white">Loading...</p></div>
    }

    return (
        <Router>
            <Navbar user={user} setUser={setUser} />
            <Routes>
                <Route path="/" element={<Home error={error} user={user} />} />
                <Route path="/login" element={user ? <Navigate to="/" /> : <Login setUser={setUser}/>} />
                <Route path="/register" element={user ? <Navigate to="/" /> : <Register setUser={setUser} />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;

