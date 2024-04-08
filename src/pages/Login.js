import React, { useEffect, useState } from "react";


import "./Login.css";
import user_icon from "../assets/img/person.png";

import pass_icon from "../assets/img/password.png";
import { Link } from "react-router-dom";

import { useNavigate } from 'react-router-dom';

import {handleSignIn} from '../store/userSlice';
import {useDispatch, useSelector} from 'react-redux';
import ClipLoader from "react-spinners/ClipLoader";

const Login = () => {
  const dispatch = useDispatch();
  const userLoading = useSelector((state) => state.user.loading); 
  const override = {
    marginLeft: "10px",
  };
  const [userDetails, setUserDetails] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  
  const handleInputChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };
  const [loading, setLoading] = useState(false);


  const handlelogin = () => {
    setLoading(true);
      
     dispatch(handleSignIn(userDetails, navigate));
  };

  useEffect(() => {
    if (userLoading) {
      setLoading(true)
      
    } else {
      setLoading(false)
    }
  }, [userLoading]);
  
  return (
    <>
      <div className="signup-page">
        <div className="signup-container">
          <div className="signup-header">
            <div className="signup-tab">LOGIN IN</div>
          </div>
          <div className="signup-input-fields">
            <div className="login-input">
              <img src={user_icon} alt="" />
              <input
                type="text"
                placeholder="Username"
                value={userDetails.email}
                name="username"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="login-input">
              <img src={pass_icon} alt="" />
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={userDetails.password}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="signup-login-link">
            <div className="forgot-password-link">
              <Link className="signup-forgot-option" to="/forgot-password">
                Forgot Password?
              </Link>
            </div>
            <div className="dont-have-acc-option">
              Don't have an account? <Link className="signup-signup-option" to="/signup">Sign Up here</Link>
            </div>
          </div>
          <div className="signup-submit-container">
            <div className="signup-submit" onClick={handlelogin}>
              Sign In
              <ClipLoader
                color="white"
                loading={loading}
                cssOverride={override}
                size={16}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;