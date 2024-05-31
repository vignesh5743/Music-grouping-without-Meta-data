import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './signup.css';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.text())
      .then((data) => {
        alert('User signed up successfully'); // Show alert on successful submission
        console.log(data);
        // Handle success or error response from the server
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <body className='signup_body'>
      <div className="signup-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input type="submit" value="Sign Up" />
          </div>
        </form>
        <div className="login-link">
          <p>
            Already have an account? <Link to="/login">Log in</Link>.
          </p>
        </div>
      </div>
    </body>
  );
};

export default SignUpForm;
