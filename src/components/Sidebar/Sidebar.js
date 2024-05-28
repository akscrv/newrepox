import React, { useState } from 'react';
import "./Sidebar.css"
import {
    FaTh,
    FaBars,
    FaUserAlt,
    FaRegChartBar,
    FaCommentAlt,
    FaShoppingBag,
    FaThList,
    FaAngleDown,
    FaAngleRight
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { NavLink } from 'react-router-dom';


const Sidebar = ({ children }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const userState = useSelector((state) => state.user);

    const userRole = userState.userData.role;

    const toggle = () => {
        setIsOpen(!isOpen);
        setIsAnalyticsOpen(false); // Close analytics sub-menu when closing sidebar
        setIsAboutOpen(false); // Close about sub-menu when closing sidebar
    };

    const toggleAnalytics = () => {
        setIsAnalyticsOpen(!isAnalyticsOpen);
        setIsAboutOpen(false); // Close about sub-menu when opening analytics sub-menu
    };

    const toggleAbout = () => {
        setIsAboutOpen(!isAboutOpen);
        setIsAnalyticsOpen(false); // Close analytics sub-menu when opening about sub-menu
    };

    const closeAllMenus = () => {
        setIsOpen(false);
        setIsAnalyticsOpen(false);
        setIsAboutOpen(false);
    };

    return (
        <div className="sidebar-container">
            <div style={{ width: isOpen ? "200px" : "50px" }} className="sidebar">


                <div className="sidebar-top_section">
                    <h1 style={{ display: isOpen ? "block" : "none" }} className="sidebar-logo">Logo</h1>
                    <div style={{ marginLeft: isOpen ? "75px" : "0px" }} className="sidebar-bars">
                        <FaBars onClick={toggle} />
                    </div>
                </div>
                {userState.userData.role === "Admin" && (<>
                    {/* <div className='sidebar_line_menu'>

                        <div className="sidebar-link" onClick={toggleAnalytics}>
                            <div className="sidebar-icon"><FaTh /></div>
                            <div style={{ display: isOpen ? "block" : "none" }} className="sidebar-link_text">Ana</div>

                        </div>
                        <div onClick={toggleAnalytics} style={{ display: isOpen ? "block" : "none" }} className="sidebar-icon sidebar-icon-right-align">{isAnalyticsOpen ? <FaAngleDown /> : <FaAngleRight />}</div>


                    </div>

                    {isAnalyticsOpen && (
                        <div className={`${isOpen ? 'dropdown_box_side_nav_open' : 'dropdown_box_side_nav_close'}`}>
                            <NavLink to="/analytics" className="sidebar-sublink" activeClassName="active">
                                <div className="sidebar-subicon"><FaRegChartBar /></div>
                                <div className="sidebar-sublink_text">Dashboard</div>
                            </NavLink>
                        </div>
                    )}

                    <div className='sidebar_line_menu' onClick={toggleAbout}>

                        <div className="sidebar-link" >
                            <div className="sidebar-icon"><FaUserAlt /></div>
                            <div style={{ display: isOpen ? "block" : "none" }} className="sidebar-link_text">About</div>

                        </div>
                        <div style={{ display: isOpen ? "block" : "none" }} className="sidebar-icon sidebar-icon-right-align">{isAboutOpen ? <FaAngleDown /> : <FaAngleRight />}</div>
                    </div>
                    {isAboutOpen && (
                        <div className={`${isOpen ? 'dropdown_box_side_nav_open' : 'dropdown_box_side_nav_close'}`}>
                            <NavLink to="/about" className="sidebar-sublink" activeClassName="active">
                                <div className="sidebar-subicon"><FaUserAlt /></div>
                                <div className="sidebar-sublink_text">About 1</div>
                            </NavLink>
                            <NavLink to="/about" className="sidebar-sublink" activeClassName="active">
                                <div className="sidebar-subicon"><FaUserAlt /></div>
                                <div className="sidebar-sublink_text">About 2</div>
                            </NavLink>
                        </div>
                    )} */}

                    <NavLink to="/admin" className="sidebar-link" activeClassName="active" >
                        <div className="sidebar-icon"><FaTh /></div>
                        <div style={{ display: isOpen ? "block" : "none" }} className="sidebar-link_text">Dashboard</div>
                    </NavLink>

                    <NavLink to="/admin-search" className="sidebar-link" activeClassName="active" >
                        <div className="sidebar-icon"><FaTh /></div>
                        <div style={{ display: isOpen ? "block" : "none" }} className="sidebar-link_text">Search</div>
                    </NavLink>


                    <NavLink to="/admin-agency" className="sidebar-link" activeClassName="active" >
                        <div className="sidebar-icon"><FaCommentAlt /></div>
                        <div style={{ display: isOpen ? "block" : "none" }} className="sidebar-link_text">Agency </div>
                    </NavLink>

                    <NavLink to="/admin-client" className="sidebar-link" activeClassName="active" >
                        <div className="sidebar-icon"><FaShoppingBag /></div>
                        <div style={{ display: isOpen ? "block" : "none" }} className="sidebar-link_text">Client </div>
                    </NavLink>

                    <NavLink to="/admin-staff" className="sidebar-link" activeClassName="active" >
                        <div className="sidebar-icon"><FaThList /></div>
                        <div style={{ display: isOpen ? "block" : "none" }} className="sidebar-link_text">Office Staff</div>
                    </NavLink>
                    <NavLink to="/admin-agent" className="sidebar-link" activeClassName="active" >
                        <div className="sidebar-icon"><FaThList /></div>
                        <div style={{ display: isOpen ? "block" : "none" }} className="sidebar-link_text">Repo Agent</div>
                    </NavLink>
                    <NavLink to="/admin-document" className="sidebar-link" activeClassName="active" >
                        <div className="sidebar-icon"><FaThList /></div>
                        <div style={{ display: isOpen ? "block" : "none" }} className="sidebar-link_text">Documents</div>
                    </NavLink>
                    <NavLink to="/admin-data" className="sidebar-link" activeClassName="active" >
                        <div className="sidebar-icon"><FaThList /></div>
                        <div style={{ display: isOpen ? "block" : "none" }} className="sidebar-link_text">Data Management</div>
                    </NavLink>

                    <NavLink to="/admin-notification" className="sidebar-link" activeClassName="active" >
                        <div className="sidebar-icon"><FaThList /></div>
                        <div style={{ display: isOpen ? "block" : "none" }} className="sidebar-link_text">Notification</div>
                    </NavLink>
                    <NavLink to="/admin-payment" className="sidebar-link" activeClassName="active" >
                        <div className="sidebar-icon"><FaThList /></div>
                        <div style={{ display: isOpen ? "block" : "none" }} className="sidebar-link_text">Payment Management</div>
                    </NavLink>
                    <NavLink to="/admin-setting" className="sidebar-link" activeClassName="active" >
                        <div className="sidebar-icon"><FaThList /></div>
                        <div style={{ display: isOpen ? "block" : "none" }} className="sidebar-link_text">Settings</div>
                    </NavLink>




                </>



                )}

                {userState.userData.role === "Company" && (<>
                    <NavLink to="/company" className="sidebar-link" activeClassName="active" >
                        <div className="sidebar-icon"><FaTh /></div>
                        <div style={{ display: isOpen ? "block" : "none" }} className="sidebar-link_text">Dashboard</div>
                    </NavLink>
                    <NavLink to="/company-clients" className="sidebar-link" activeClassName="active" >
                        <div className="sidebar-icon"><FaTh /></div>
                        <div style={{ display: isOpen ? "block" : "none" }} className="sidebar-link_text">Clients</div>
                    </NavLink>
                    <NavLink to="/company-staff" className="sidebar-link" activeClassName="active" >
                        <div className="sidebar-icon"><FaThList /></div>
                        <div style={{ display: isOpen ? "block" : "none" }} className="sidebar-link_text">Office Staff</div>
                    </NavLink>
                    <NavLink to="/company-agent" className="sidebar-link" activeClassName="active" >
                        <div className="sidebar-icon"><FaThList /></div>
                        <div style={{ display: isOpen ? "block" : "none" }} className="sidebar-link_text">Repo Agent</div>
                    </NavLink>
                    <NavLink to="/company-data" className="sidebar-link" activeClassName="active" >
                        <div className="sidebar-icon"><FaThList /></div>
                        <div style={{ display: isOpen ? "block" : "none" }} className="sidebar-link_text">Data Management</div>
                    </NavLink>
                    <NavLink to="/company-documents" className="sidebar-link" activeClassName="active" >
                        <div className="sidebar-icon"><FaTh /></div>
                        <div style={{ display: isOpen ? "block" : "none" }} className="sidebar-link_text">Documents</div>
                    </NavLink>

                    <NavLink to="/company-notification" className="sidebar-link" activeClassName="active" >
                        <div className="sidebar-icon"><FaTh /></div>
                        <div style={{ display: isOpen ? "block" : "none" }} className="sidebar-link_text">Notification</div>
                    </NavLink>
                    <NavLink to="/company-payments" className="sidebar-link" activeClassName="active" >
                        <div className="sidebar-icon"><FaTh /></div>
                        <div style={{ display: isOpen ? "block" : "none" }} className="sidebar-link_text">Payments</div>
                    </NavLink>
                    <NavLink to="/company-settings" className="sidebar-link" activeClassName="active" >
                        <div className="sidebar-icon"><FaTh /></div>
                        <div style={{ display: isOpen ? "block" : "none" }} className="sidebar-link_text">Settings</div>
                    </NavLink>
                    {/* <div className='sidebar_line_menu'>

                        <div className="sidebar-link" onClick={toggleAnalytics}>
                            <div className="sidebar-icon"><FaTh /></div>
                            <div style={{ display: isOpen ? "block" : "none" }} className="sidebar-link_text">Ana</div>

                        </div>
                        <div onClick={toggleAnalytics} style={{ display: isOpen ? "block" : "none" }} className="sidebar-icon sidebar-icon-right-align">{isAnalyticsOpen ? <FaAngleDown /> : <FaAngleRight />}</div>


                    </div>

                    {isAnalyticsOpen && (
                        <div className={`${isOpen ? 'dropdown_box_side_nav_open' : 'dropdown_box_side_nav_close'}`}>
                            <NavLink to="/analytics" className="sidebar-sublink" activeClassName="active">
                                <div className="sidebar-subicon"><FaRegChartBar /></div>
                                <div className="sidebar-sublink_text">Dashboard</div>
                            </NavLink>
                        </div>
                    )}

                    <div className='sidebar_line_menu' onClick={toggleAbout}>

                        <div className="sidebar-link" >
                            <div className="sidebar-icon"><FaUserAlt /></div>
                            <div style={{ display: isOpen ? "block" : "none" }} className="sidebar-link_text">About</div>

                        </div>
                        <div style={{ display: isOpen ? "block" : "none" }} className="sidebar-icon sidebar-icon-right-align">{isAboutOpen ? <FaAngleDown /> : <FaAngleRight />}</div>
                    </div>
                    {isAboutOpen && (
                        <div className={`${isOpen ? 'dropdown_box_side_nav_open' : 'dropdown_box_side_nav_close'}`}>
                            <NavLink to="/about" className="sidebar-sublink" activeClassName="active">
                                <div className="sidebar-subicon"><FaUserAlt /></div>
                                <div className="sidebar-sublink_text">About 1</div>
                            </NavLink>
                            <NavLink to="/about" className="sidebar-sublink" activeClassName="active">
                                <div className="sidebar-subicon"><FaUserAlt /></div>
                                <div className="sidebar-sublink_text">About 2</div>
                            </NavLink>
                        </div>
                    )} */}




                </>



                )}





            </div>
            <main className={isOpen ? 'sidebar-main-open' : 'sidebar-main'}>{children}</main>

        </div>
    );
};

export default Sidebar;
