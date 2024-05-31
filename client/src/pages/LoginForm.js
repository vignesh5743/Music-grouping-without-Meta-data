import React,{ useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import './login.css'
import Captcha from './captcha';
const LoginForm = () => {
    // const [captchaText, setCaptchaText] = useState('');
    // const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

    // const handleCaptchaChange = (text) => {
    //   setCaptchaText(text);
    // };

    useEffect(() => {
        // Remove background styling when component unmounts (user navigates away)
        return () => {
          document.body.classList.remove('/Login');
        };
      }, []);


  const handleSubmit = (e) => {
    e.preventDefault();

    // Here you would handle the login logic
    // Assuming login is successful, redirect to /home

    window.location.href = '/Home';
  };

  return (
    <body className='login_body'>
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input type="text" name="username" placeholder="Username" required />
        </div>
        <div className="form-group">
          <input type="password" name="password" placeholder="Password" required />
        </div>

        <div className="form-group">
          <input type="submit" value="Login" />
        </div>
      </form>
      <div className="create-account">
        <p>If you don't have an account, <br></br><Link to="/signup">create New</Link>.</p>
      </div>
    </div>
    </body>
  );
};

export default LoginForm;
