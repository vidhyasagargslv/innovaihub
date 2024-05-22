import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Signup.css'

function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState(""); // Initialize token state with an empty string
  const navigate = useNavigate();

  // useEffect(() => {
  //   // Retrieve the token from local storage
  //   const storedToken = localStorage.getItem("auth");
  //   if (storedToken) {
  //     setToken(storedToken); // Set the token state if it's found in local storage
  //     toast.success("You are already logged in");
  //     navigate("/first"); // Redirect to dashboard after successful login
  //   }
  // }, [navigate]); // Include navigate in the dependency array

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (username && email && password && confirmPassword) {
        if (password === confirmPassword) {
            try {
                const response = await axios.post(
                    "http://localhost:5000/api/v1/register",
                    { username, email, password }
                );
                localStorage.setItem("auth", response.data.token);
                // Placeholder for setToken function - Update the token state after successful signup
                // setToken(response.data.token); 
                toast.success("Signup successful. Now you can login with your credentials");
                // Placeholder for navigate function - Redirect to dashboard after successful signup
                // navigate("/login"); 
            } catch (error) {
                console.error("Signup error:", error);
                if (error.response && error.response.data && error.response.data.error) {
                    toast.error(error.response.data.error);
                } else {
                    toast.error("An error occurred during signup. Please try again later.");
                }
            }
        } else {
            toast.error("Passwords do not match");
        }
    } else {
        toast.error("Please fill all inputs");
    }
};

  return (
    <div className="mainbackground flex items-center justify-start h-screen">

      <div className="bg-white dark:bg-zinc-800 p-12 rounded-lg shadow-md max-w-md w-full ml-28">
        <h2 className="text-2xl font-bold mb-8 text-zinc-800 dark:text-white text-center">
          Create Account
        </h2>
        <form onSubmit={handleSignupSubmit}>
          <div className="mb-3">
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
              </svg>
              <input
                type="text"
                name="username"
                className="username"
                placeholder="Username"
                required
              />
            </label>
          </div>
          <div className="mb-3">
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
              <input
                type="text"
                name="email"
                className="email"
                placeholder="Email"
                required
              />
            </label>
          </div>
          <div className="mb-3">
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="password"
                name="password"
                className="password"
                placeholder="Create password"
                required
              />
            </label>
          </div>
          <div className="mb-10">
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="password"
                name="confirmPassword"
                className="confirmPassword"
                placeholder="Confirm Password"
                required
              />
            </label>
          </div>
          <button type="submit" className="btn  w-full btn-primary">
            Sign Up
          </button>
        </form>
        <p className="mt-6 text-center text-gray-200">
          Already have an account? <br />
          <Link to="/login" className="text-blue-500">
            Click here to login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
