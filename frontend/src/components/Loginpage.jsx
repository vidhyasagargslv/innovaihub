import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/Login.css';
import SignupPage from './SignupPage';
import '../styles/Login.css'
function Loginpage() {
  const [passwordType, setPasswordType] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [token, setToken] = useState(null);
  
  // Retrieve the token from local storage
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token !== null && token !== undefined) {
      
    } else {
      // toast.info('You are logged out, please login again');
    }
    // console.log('Login page rendered');
  }, []);


  

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (email.length > 0 && password.length > 0 && !token) {
      const formData = {
        email,
        password,
      };
      try {
        const response = await axios.post(
          'http://localhost:5000/api/v1/login',
          formData
        );
        const authToken = response.data.token;
        const userId = response.data.userId;
        localStorage.setItem("authToken", authToken);
        localStorage.setItem("userId", userId);
        setToken(authToken);
        toast.success("Login successful");
        navigate("/first");
      } catch (err) {
        console.log(err);
        toast.error(err.response.data.error || 'An error occurred');
      }
    } else {
      localStorage.removeItem('authToken'); 
      localStorage.removeItem('userId'); // Add this line
      toast.error('Please fill all inputs');
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordType(prevType => prevType === 'password' ? 'text' : 'password');
    setShowPassword(prevShow => !prevShow);
  };
  

  const passwordFieldRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!document.querySelector('#password:is(:focus)')) {
      const eyes = document.getElementsByClassName('eye');
      for (let eye of eyes) {
        const x = eye.getBoundingClientRect().left + 10;
        const y = eye.getBoundingClientRect().top + 10;
        const rad = Math.atan2(event.pageX - x, event.pageY - y);
        const rot = (rad * (180 / Math.PI) * -1) + 180;
        eye.style.transform = `rotate(${rot}deg)`;
      }
    }
  };

  const handleFocusPassword = () => {
    document.getElementById('face').style.transform = 'translateX(30px)';
    const eyes = document.getElementsByClassName('eye');
    for (let eye of eyes) {
      eye.style.transform = `rotate(100deg)`;
    }
  };

  const handleFocusOutPassword = (event) => {
    document.getElementById('face').style.transform = 'translateX(0)';
    if (event.target.checkValidity()) {
      document.getElementById('ball').classList.toggle('sad');
    } else {
      document.getElementById('ball').classList.toggle('sad');
      const eyes = document.getElementsByClassName('eye');
      for (let eye of eyes) {
        eye.style.transform = `rotate(215deg)`;
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    passwordFieldRef.current?.addEventListener('focus', handleFocusPassword);
    passwordFieldRef.current?.addEventListener('focusout', handleFocusOutPassword);
    const submitButton = document.getElementById('submit');
    if (submitButton) {
      submitButton.addEventListener('mouseover', () => document.getElementById('ball').classList.toggle('look_at'));
      submitButton.addEventListener('mouseout', () => document.getElementById('ball').classList.toggle('look_at'));
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      passwordFieldRef.current?.removeEventListener('focus', handleFocusPassword);
      passwordFieldRef.current?.removeEventListener('focusout', handleFocusOutPassword);
      if (submitButton) {
        submitButton.removeEventListener('mouseover', () => document.getElementById('ball').classList.toggle('look_at'));
        submitButton.removeEventListener('mouseout', () => document.getElementById('ball').classList.toggle('look_at'));
      }
    };
  }, []);

  return (
    <>
      <main className="login">
        <section className="form">
          <div className="logo">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25"
              />
            </svg>
          </div>
          <h1 className="form__title">Log in to your Account</h1>
          <p className="form__description">
            Welcome back! Please, enter your information
          </p>

          <form action="POST" onSubmit={handleLoginSubmit}>
            <label className="form-control__label">Email</label>
            <input type="email" name="email" className="form-control" />

            <label className="form-control__label">Password</label>
            <div className="password-field">
            <input
  type={passwordType}
  name="password"
  className="form-control"
  minLength="8"
  id="password"
  ref={passwordFieldRef}
/>

<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  strokeWidth={1.5}
  stroke="currentColor"
  onClick={togglePasswordVisibility}
  className="cursor-pointer w-6 h-6"
>
  {showPassword ? (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM9 12a9 9 0 019-9m-9 0a9 9 0 00-9 9m9 0a9 9 0 019 9m-9 0a9 9 0 00-9-9H3m18 0H3M3 3h18M12 15v.01M13.5 17.5l-2-1-2 1"
    />
  ) : (
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  )}
</svg>


              
            </div>
            <div className="password__settings">
              <label className="password__settings__remember">
                <input type="checkbox" />
                <span className="custom__checkbox">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </span>
                Remember me
              </label>

              <a href="#">Forgot Password?</a>
            </div>

            <button type="submit" className="form__submit" id="submit">
              Log In
            </button>
          </form>

          <p className="form__footer">
            Dont have an account? <br />
            <Link to="/signup" className="text-blue-500 font-bold">
              Create an account
            </Link>
          </p>
        </section>

        <section className="form__animation">
          <div id="ball">
            <div className="ball">
              <div id="face">
                <div className="ball__eyes">
                  <div className="eye_wrap">
                    <span className="eye"></span>
                  </div>
                  <div className="eye_wrap">
                    <span className="eye"></span>
                  </div>
                </div>
                <div className="ball__mouth"></div>
              </div>
            </div>
            <div className="ball__shadow"></div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Loginpage;
