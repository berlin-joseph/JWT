import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    const response = await axios.post(
      isLogin ? "http://localhost:3000/login" : "http://localhost:3000/create",
      {
        email,
        password,
        confirmPassword,
      }
    );

    console.log(response.data);

    console.log({ email, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {isLogin ? "Login" : "Register"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-gray-900 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-gray-900 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          {!isLogin && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 text-gray-900 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          )}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLogin ? "Login" : "Register"}
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          {isLogin ? (
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={toggleForm}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={toggleForm}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Login here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
