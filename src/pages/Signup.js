import React, { useState } from "react";
import "./Signup.css";
import user_icon from "../assets/img/person.png";
import mail_icon from "../assets/img/email.png";
import pass_icon from "../assets/img/password.png";
import first_name from "../assets/img/firstname.png";
import last_name from "../assets/img/lastname.png";
import { Link } from "react-router-dom";
import { API_URL } from "../ConfigApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


import ClipLoader from "react-spinners/ClipLoader";

const SignUp = () => {
    const override = {
        marginLeft: "10px",
    };

    const [loading, setLoading] = useState(false);


    const [selectedRole, setSelectedRole] = useState("admin");
    const [userDetails, setUserDetails] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        first_name: "",
        last_name: "",

        // role: selectedRole,
    });


    const handleInputChange = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    };
    const navigate = useNavigate();

    const handleSignUp = () => {
        setLoading(true);
        if (userDetails.password !== userDetails.confirmPassword) {
            setLoading(false);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Password and Confirm Password do not match. Please try again.",
            });
            return;
        }
        // Determine the role number based on the selectedRole state
        let roleNumber;
        if (selectedRole === "admin") {
            roleNumber = 1; // Replace with the appropriate role number for a consultant
        } else if (selectedRole === "company") {
            roleNumber = 2; // Replace with the appropriate role number for a company
        }

        const userData = {
            ...userDetails,
            role: roleNumber, // Include the role number in the user data
        };

        fetch(`${API_URL}/users/users/register/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })
            .then((response) => response.json())
            .then((data) => {
                setLoading(false);
                if (data.id) {
                    navigate("/login");
                } else if (data.email) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: data.email[0],
                    });
                } else if (data.username) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: data.username[0],
                    });
                } else if (data.password) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: data.password[0],
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Registration failed. Please try again.",
                    });
                }
            })
            .catch((error) => {
                setLoading(false);
                console.error("Error:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "An error occurred. Please try again.",
                });
            });
    };




    return (
        <>
            <div className="signup-page">
                <div className="signup-container">
                    <div className="signup-header">
                        <div className="signup-tab">SIGN UP</div>
                    </div>

                    <div className="role-selection">
                        <p className="select-role-text">Sign Up as (Select Your Role)</p>
                        <select
                            className="role-dropdown"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >

                            <option value="admin">Admin</option>
                            <option value="company">Company</option>

                        </select>
                    </div>

                    <div className="signup-input-fields">
                        <div className="signup-input">
                            <img src={user_icon} alt="" />
                            <input
                                type="text"
                                placeholder="Username"
                                value={userDetails.username}
                                name="username"
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="signup-input">
                            <img src={mail_icon} alt="" />
                            <input
                                type="email"
                                placeholder="Email"
                                value={userDetails.email}
                                name="email"
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="signup-input">
                            <img src={first_name} alt="" />
                            <input
                                type="text"
                                placeholder="First Name"
                                value={userDetails.first_name}
                                name="first_name"
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="signup-input">
                            <img src={last_name} alt="" />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={userDetails.last_name}
                                name="last_name"
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="signup-input">
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

                        <div className="signup-input">
                            <img src={pass_icon} alt="" />
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                name="confirmPassword"
                                value={userDetails.confirmPassword}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="signup-login-link">
                        Already registered?{" "}
                        <Link className="signup-login-option" to="/login">
                            Login here
                        </Link>
                    </div>
                    <div className="signup-submit-container">
                        <div className="signup-submit" onClick={handleSignUp}>
                            Sign Up
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

export default SignUp;