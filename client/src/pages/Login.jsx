import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../components/assets/api";

const Login = ({ setUser }) => {

    const [form, setform] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/api/auth/login`, form, { withCredentials: true });
            setUser(res.data.user);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Invalid email or password");
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-100 p-4">
            <form className="bg-white p-6 rounded shadow-md w-full max-w-lg" onSubmit={handleSubmit}>
                <h2 className="text-2xl mb-6 font-bold text-center text-gray-800">Login</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    className="border p-2 w-full mb-3 rounded"
                    value={form.email}
                    onChange={(event) => setform({
                        ...form,
                        email: event.target.value
                    })}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="border p-2 w-full mb-3 rounded"
                    value={form.password}
                    onChange={(event) => setform({
                        ...form,
                        password: event.target.value
                    })}
                    required
                />
                <button type="submit" className="bg-blue-500 text-white w-full p-2 rounded hover:bg-blue-600">Login</button>
            </form>
        </div>
    );
}

export default Login;

