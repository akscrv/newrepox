import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import Sidebar from '../../../components/Sidebar/Sidebar'
import Nav from '../../../components/Navbar/Nav'
import { API_URL } from '../../../ConfigApi';
import "../../../components/AdminUserList/AdminUserList.css"

const AdminRepoAgent = () => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [verifiedFilter, setVerifiedFilter] = useState('');
    const [staffFilter, setStaffFilter] = useState('');
    const [activeFilter, setActiveFilter] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [sortOption, setSortOption] = useState('date'); // Default sort by date
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [filterVisible, setFilterVisible] = useState(false);
    const roleMapping = {
        "Admin": 1,
        "Company": 2,
        "Pro": 3,
        "Operationteam": 4,
        "Worker": 5,
        "Apro": 6,
        "Aoperationteam": 7,
        "Aworker": 8
    };

    const [updatedUserData, setUpdatedUserData] = useState({
        id: "",
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        is_verified: false,
        is_staff: false,
        is_active: false,
        date_joined: "",

    });

    const [newUserData, setNewUserData] = useState({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        role: "",
        password: "",
        is_staff: false,
        is_verified: false
    });

    const getRoleDescription = (role) => {
        switch (role) {


            case 'Aworker':
                return 'Admin Agent';
            default:
                return 'Unknown Role';
        }
    };

    const fetchUsers = () => {
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
            axios.get(`${API_URL}/users/users/fetch_special_roles_agent/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
                .then(response => {
                    setUsers(response.data);
                })
                .catch(error => {
                    console.error('Error fetching users:', error);
                });
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const deleteUser = (userId) => {
        const accessToken = Cookies.get('accessToken');
        const loggedInUserId = jwtDecode(accessToken);

        if (userId === loggedInUserId.user_id) {
            Swal.fire(
                'Error!',
                'You cannot delete yourself.',
                'error'
            );
            return;
        }

        if (accessToken) {
            Swal.fire({
                title: 'Are you sure?',
                text: 'You will not be able to recover this user!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.delete(`${API_URL}/users/users/${userId}/delete/`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    })
                        .then(response => {
                            // Remove the deleted user from the state
                            setUsers(users.filter(user => user.id !== userId));
                            console.log('User deleted successfully');
                            Swal.fire(
                                'Deleted!',
                                'User has been deleted.',
                                'success'
                            );
                        })
                        .catch(error => {
                            console.error('Error deleting user:', error);
                            Swal.fire(
                                'Error!',
                                'An error occurred while deleting the user. Please try again.',
                                'error'
                            );
                        });
                }
            });
        }
    };

    const updateUser = (user) => {
        setSelectedUser(user);
        setShowUpdateModal(true);
        setUpdatedUserData(user);
    };

    const handleUpdate = () => {
        console.log('Updating user...');
        const accessToken = Cookies.get('accessToken');
        if (!accessToken) {
            // Handle case where there's no accessToken
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Session Expired. Please log in again.",
            });
            return; // Stop further execution
        }

        const { id, username, email, first_name, last_name, is_verified, is_staff, is_active, date_joined } = updatedUserData;

        // Convert role from number to string using roleMapping
        // const roleAsString = Object.keys(roleMapping).find(key => roleMapping[key] === role);

        axios.patch(`${API_URL}/users/users/${id}/`, { username, email, first_name, last_name, is_verified, is_staff, is_active, date_joined }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    Swal.fire(
                        'Updated!',
                        'User has been updated.',
                        'success'
                    ).then(() => setShowUpdateModal(false)); // Close modal after displaying the alert
                    fetchUsers();
                }
            })
            .catch(error => {
                console.error('Error updating user:', error);
                const errorMessage = error.response?.data?.error || 'An error occurred while updating the user.';
                Swal.fire(
                    'Error!',
                    errorMessage,
                    'error'
                );
            });
    };


    const handleCreate = async () => {

        setNewUserData({
            username: "",
            email: "",
            first_name: "",
            last_name: "",
            role: "",
            password: "",
            is_staff: false,
            is_verified: false
        });


        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
            try {
                const response = await fetch(`${API_URL}/users/users/register/`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newUserData), // Use newUserData here
                });
                if (!response.ok) {
                    throw new Error('Failed to create user');
                }
                const responseData = await response.json();
                console.log('User created successfully:', responseData);
                Swal.fire(
                    'Created!',
                    'User has been created.',
                    'success'
                ).then(() => setShowCreateModal(false)); // Close modal after displaying the alert
                fetchUsers();
            } catch (error) {
                console.error('Error creating user:', error.message);
                Swal.fire(
                    'Error!',
                    'An error occurred while creating the user.',
                    'error'
                );
                // Handle error, show error message, etc.
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : (name === 'role' ? roleMapping[value] : value);
        setUpdatedUserData(prevState => ({
            ...prevState,
            [name]: newValue
        }));
    };


    const resetFilters = () => {
        setSearchQuery('');
        setVerifiedFilter('');
        setStaffFilter('');
        setActiveFilter('');
        setRoleFilter('');
    };

    // Sorting functionality
    const sortedUsers = [...users].sort((a, b) => {
        switch (sortOption) {
            case 'date':
                return new Date(b.date_joined) - new Date(a.date_joined);
            case 'name':
                return a.first_name.localeCompare(b.first_name);
            case 'username':
                return a.username.localeCompare(b.username);
            default:
                return 0;
        }
    });

    // Search functionality
    const filteredUsers = sortedUsers.filter(user =>
        (user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.role.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (verifiedFilter === '' || user.is_verified === (verifiedFilter === 'Yes')) &&
        (staffFilter === '' || user.is_staff === (staffFilter === 'Yes')) &&
        (activeFilter === '' || user.is_active === (activeFilter === 'Yes')) &&
        (roleFilter === '' || user.role.toLowerCase() === roleFilter.toLowerCase())
    );
    const toggleFilterVisibility = () => {
        setFilterVisible(!filterVisible); // Toggle filter visibility state
    };



    return (
        <Sidebar>
            <Nav />
            <div className="head_bar_to_show_heading_main">
                <button className='head_bar_to_show_heading' >Your Field Agent </button>




            </div>
            <div className='admin_toggle_container'>




                <div className='search_admin_container'>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="admin-search-input"
                    />

                </div>







                <button className='table_control_button' onClick={resetFilters}>Reset Filters</button>
                <button className='table_control_button Create_button_right' onClick={() => setShowCreateModal(true)}>Create User</button>

                {/* Button to toggle filter visibility */}
                <button className='table_control_button' onClick={toggleFilterVisibility}>{filterVisible ? "Hide Filters" : "Show Filters"}</button>


                {/* Filter container */}
                {filterVisible && (
                    <div class="filter-container">
                        <div class="filter-item">
                            <label for="sort">Sort By:</label>
                            <select id="sort" value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="sort-filter">
                                <option value="date">Date</option>
                                <option value="name">Name</option>
                                <option value="username">Username</option>
                            </select>
                        </div>
                        <div class="filter-item">
                            <label for="verified">Verified:</label>
                            <select id="verified" value={verifiedFilter} onChange={(e) => setVerifiedFilter(e.target.value)} className="verified-filter">
                                <option value="">All</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <div class="filter-item">
                            <label for="staff">Staff:</label>
                            <select id="staff" value={staffFilter} onChange={(e) => setStaffFilter(e.target.value)} className="staff-filter">
                                <option value="">All</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <div class="filter-item">
                            <label for="active">Active:</label>
                            <select id="active" value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)} className="active-filter">
                                <option value="">All</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <div class="filter-item">
                            <label for="role">Role:</label>
                            <select id="role" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="role-filter">
                                <option value="">All</option>
                                <option value="Aworker">Admin Agent</option>
                            </select>
                        </div>
                    </div>
                )}
                <div class="admin-user-table-container">
                    <table class="admin-user-table">
                        <thead>
                            <tr>
                                <th className="admin-user-table-header">Username</th>
                                <th className="admin-user-table-header">Email</th>
                                <th className="admin-user-table-header">First Name</th>
                                <th className="admin-user-table-header">Last Name</th>
                                <th className="admin-user-table-header">Verified</th>
                                <th className="admin-user-table-header">Staff</th>
                                <th className="admin-user-table-header">Active</th>
                                <th className="admin-user-table-header">Date Joined</th>
                                <th className="admin-user-table-header">Role</th>
                                <th className="admin-user-table-header">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.first_name}</td>
                                    <td>{user.last_name}</td>
                                    <td>{user.is_verified ? 'Yes' : 'No'}</td>
                                    <td>{user.is_staff ? 'Yes' : 'No'}</td>
                                    <td>{user.is_active ? 'Yes' : 'No'}</td>
                                    <td>{new Date(user.date_joined).toISOString().split('T')[0]}</td>
                                    <td>{getRoleDescription(user.role)}</td>
                                    <td>
                                        <button className="delete-user-btn" onClick={() => deleteUser(user.id)}>Delete</button>
                                        <button className="update-user-btn" onClick={() => updateUser(user)}>Update</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table></div>

                {showUpdateModal && selectedUser && (

                    <div className="admin-user-update-overlay" onClick={() => setShowUpdateModal(false)}>
                        <div className="update-user-modal" onClick={(e) => e.stopPropagation()}>
                            <h3>Update User</h3>
                            <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} onClick={(e) => e.stopPropagation()}>

                                <div>
                                    <label>Username:</label>
                                    <input type="text" name="username" value={updatedUserData.username} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label>Email:</label>
                                    <input type="email" name="email" value={updatedUserData.email} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label>First Name:</label>
                                    <input type="text" name="first_name" value={updatedUserData.first_name} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label>Last Name:</label>
                                    <input type="text" name="last_name" value={updatedUserData.last_name} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label>Verified:</label>
                                    <input type="checkbox" name="is_verified" checked={updatedUserData.is_verified} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label>Staff:</label>
                                    <input type="checkbox" name="is_staff" checked={updatedUserData.is_staff} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label>Active:</label>
                                    <input type="checkbox" name="is_active" checked={updatedUserData.is_active} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label>Date Joined:</label>
                                    <input type="date" name="date_joined" value={new Date(updatedUserData.date_joined).toISOString().split('T')[0]} onChange={handleInputChange} />
                                </div>
                                {/* <div>
                                    <label>Role:</label>
                                    <select name="role" value={updatedUserData.role} onChange={handleInputChange}>
                                        <option value="">Select Role</option>
                                        {Object.entries(roleMapping).map(([roleName, roleValue]) => (
                                            <option key={roleValue} value={roleName}>{roleName}</option>
                                        ))}
                                    </select>
                                </div> */}



                                <button className='adminshow_update_button' type="submit">Update</button>
                            </form>
                            <button onClick={() => setShowUpdateModal(false)}>Close</button>
                        </div>
                    </div>
                )}
                {showCreateModal && (
                    <div className="admin-user-update-overlay" onClick={() => setShowCreateModal(false)}>
                        <div className="update-user-modal" onClick={(e) => e.stopPropagation()}>
                            <h3>Create User</h3>
                            <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }} onClick={(e) => e.stopPropagation()}>
                                <div>
                                    <label>Username:</label>
                                    <input type="text" name="username" value={newUserData.username} onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })} />
                                </div>
                                <div>
                                    <label>Email:</label>
                                    <input type="email" name="email" value={newUserData.email} onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })} />
                                </div>
                                <div>
                                    <label>First Name:</label>
                                    <input type="text" name="first_name" value={newUserData.first_name} onChange={(e) => setNewUserData({ ...newUserData, first_name: e.target.value })} />
                                </div>
                                <div>
                                    <label>Last Name:</label>
                                    <input type="text" name="last_name" value={newUserData.last_name} onChange={(e) => setNewUserData({ ...newUserData, last_name: e.target.value })} />
                                </div>
                                <div>
                                    <label>Role:</label>
                                    <select name="role" value={newUserData.role} onChange={(e) => setNewUserData({ ...newUserData, role: parseInt(e.target.value) })}>
                                        <option value="">Select Role</option>
                                        {/* <option value="1">Admin</option>
                                        <option value="2">Agency</option> */}
                                        {/* <option value="6">Your Office Admin </option>
                                        <option value="7">Your Operationteam</option> */}
                                        <option value="8">Your Field Agent</option>
                                    </select>
                                </div>

                                <div>
                                    <label>Password:</label>
                                    <input type="password" name="password" value={newUserData.password} onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })} />
                                </div>
                                <div>
                                    <label>Is Staff:</label>
                                    <input type="checkbox" name="is_staff" checked={newUserData.is_staff} onChange={(e) => setNewUserData({ ...newUserData, is_staff: e.target.checked })} />
                                </div>
                                <div>
                                    <label>Is Verified:</label>
                                    <input type="checkbox" name="is_verified" checked={newUserData.is_verified} onChange={(e) => setNewUserData({ ...newUserData, is_verified: e.target.checked })} />
                                </div>
                                <button type="submit">Create</button>


                            </form>
                            <button onClick={() => setShowCreateModal(false)}>Close</button>
                        </div>
                    </div>
                )}
            </div>


        </Sidebar>
    )
}

export default AdminRepoAgent