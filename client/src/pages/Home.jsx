import React from "react";
import { Link } from "react-router-dom";
import Todo from "../components/Todo";

const Home = ({ user, error }) => {
    return (
        <div className="min-h-[80vh] pt-45 pb-8 px-3 bg-gray-100 flex justify-center items-start">
            {user ? (
                <Todo />
            ) : (
                <div className="bg-gray-50 rounded-[32px] w-full max-w-lg p-8 shadow-2xl text-center">
                    <h1 className="text-4xl text-gray-800 font-bold mb-5">Welcome to Todo App</h1>
                    <p className="text-gray-700 text-lg font-medium mb-6">
                        Please{' '}
                        <Link className="text-blue-600 hover:text-blue-700 hover:underline font-semibold" to="/login">
                            login
                        </Link>{' '}
                        or{' '}
                        <Link className="text-blue-600 hover:text-blue-700 hover:underline font-semibold" to="/register">
                            register
                        </Link>{' '}
                        to get started.
                    </p>
                </div>
            )}
            {error && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl shadow-2xl max-w-md">
                    {error}
                </div>
            )}
        </div>
    );
};

export default Home;

