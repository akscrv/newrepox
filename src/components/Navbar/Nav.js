import React, { useEffect, useRef, useState } from "react";
import "./Nav.css";
import { NavLink } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../../store/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Nav() {
    const userState = useSelector((state) => state.user);

    // console.log("userstatex", userState);

    const currentLocation = useLocation();
    // console.log("currentLocation", currentLocation);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isUserPopupVisible, setUserPopupVisible] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };
    const toggleUserPopup = () => {
        setUserPopupVisible(!isUserPopupVisible);
    };
    const handleLogout = () => {
        dispatch(logoutUser(navigate));
    };
    const userRole = userState.userData.role;
    // console.log(userRole + " Yahi h")

    const profileLink =
        userRole === "Admin"
            ? "/admin-profile"
            : userRole === "Company"
                ? `/company-profile`
                : userRole === "Pro"
                    ? `/pro-profile`
                    : userRole === "Operationteam"
                        ? "/operation-team-profile"
                        : userRole === "Worker"
                            ? `/worker-profile`
                            : "/";

    const LogoButtonLink =
        userRole === "Admin"
            ? "/admin"
            : userRole === "Company"
                ? "/company"
                : userRole === "Pro"
                    ? "/pro"
                    : userRole === "Operationteam"
                        ? "/operation"
                        : userRole === "Worker"
                            ? "/worker"
                            : "/";

    const userPopupRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                userPopupRef.current &&
                !userPopupRef.current.contains(event.target)
                && !document.querySelector(".navbar-user-photo").contains(event.target)
            ) {
                setUserPopupVisible(false);
            }
        };

        window.addEventListener("mousedown", handleOutsideClick);

        return () => {
            window.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isUserPopupVisible]);

    return (
        <div className="navbar">
            <div className="navbar-header">
                <div className="navbar-logo">
                    <Link to={LogoButtonLink}>Repo DB</Link>
                </div>
                <div
                    className={`navbar-hamburger ${isMobileMenuOpen ? "open" : ""}`}
                    onClick={toggleMobileMenu}
                >
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
            <ul className={`navbar-nav-links ${isMobileMenuOpen ? "active" : ""}`}>
                <li>
                    <NavLink
                        to={LogoButtonLink}
                        className="active-link"


                    >
                        Projects
                    </NavLink>
                </li>
                {userState.userData.role === "Company" && (
                    <li>
                        <NavLink
                            to="/consultant-list"
                            className={
                                currentLocation.pathname === "/consultant-list"
                                    ? "active-link"
                                    : ""
                            }
                        >
                            Consultants
                        </NavLink>
                    </li>
                )}
                {userState.userData.role === "Consultant" && (
                    <li>
                        <NavLink
                            to="/company-list"
                            className={
                                currentLocation.pathname === "/company-list"
                                    ? "active-link"
                                    : ""
                            }
                        >
                            Companies
                        </NavLink>
                    </li>
                )}

                {/* Show both "Companies" and "Consultants" if the user role is "Admin" */}
                {userState.userData.role === "Admin" && (
                    <>
                        <li>
                            <NavLink
                                to="/company-list"
                                className={
                                    currentLocation.pathname === "/company-list"
                                        ? "active-link"
                                        : ""
                                }
                            >
                                Companies
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/consultant-list"
                                className={
                                    currentLocation.pathname === "/consultant-list"
                                        ? "active-link"
                                        : ""
                                }
                            >
                                Consultants
                            </NavLink>
                        </li>
                    </>
                )}

                <li>
                    <NavLink
                        to="/notifications"
                        className={
                            currentLocation.pathname === "/notifications" ? "active-link" : ""
                        }
                    >
                        Notifications
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/repository"
                        className={
                            currentLocation.pathname === "/repository" ? "active-link" : ""
                        }
                    >
                        Repository
                    </NavLink>
                </li>
            </ul>
            <div
                className={`navbar-user-photo ${isMobileMenuOpen ? "active" : ""}`}
                onClick={toggleUserPopup}
            >
                <img
                    src={
                        userState.userData.profilePic ||
                        "https://cdn-icons-png.flaticon.com/128/848/848006.png"
                    }
                    alt="User"
                />
                {isUserPopupVisible && (
                    <div className="user-popup" ref={userPopupRef}>
                        <div className="user-info">
                            <Link to={profileLink} className="profile-navlink">
                                <div className="user-profile">
                                    <img
                                        src={
                                            userState.userData.profilePic ||
                                            "https://cdn-icons-png.flaticon.com/128/848/848006.png"
                                        }
                                        alt="User Profile"
                                        className="user-profile-image"
                                    />
                                    <span className="user-name">
                                        {userState.userData.username}
                                    </span>
                                    <br />
                                </div>
                            </Link>
                            <div className="user-description">{userState.userData.email}</div>
                        </div>
                        <div className="user-options">
                            <Link to={profileLink} className="profile-navlink">
                                <div className="user-option">
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/128/9308/9308008.png"
                                        alt="Profile"
                                        className="option-icon"
                                    />
                                    My Profile
                                </div>
                            </Link>
                            <hr />
                            <Link to='/dashboard'>
                                <div className="user-option">
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/128/2329/2329087.png"
                                        alt="Dashboard"
                                        className="option-icon"
                                    />
                                    Dashboard
                                </div>
                            </Link>
                            <hr />
                            <Link to='/meetings'>
                                <div className="user-option">
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/128/9662/9662347.png"
                                        alt="Meetings"
                                        className="option-icon"
                                    />
                                    Chats and Meetings
                                </div>
                            </Link>
                            <hr />
                            <div className="user-option" onClick={handleLogout}>
                                <img
                                    src="https://cdn-icons-png.flaticon.com/128/2529/2529508.png"
                                    alt="logout"
                                    className="option-icon"
                                />
                                Sign Out
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Nav;