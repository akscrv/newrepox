import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

import axios from 'axios';
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import Swal from 'sweetalert2';
import { API_URL } from '../../../ConfigApi';
import Sidebar from '../../../components/Sidebar/Sidebar';
import Nav from '../../../components/Navbar/Nav';


const CompanyOfficeStaff = () => {
    const userState = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [companyId, setcompanyId] = useState();






    useEffect(() => {
        if (userState.userData && userState.userData.company_details) {
            setcompanyId(userState.userData.company_details.company_id);
        }
    }, [userState.userData]);




    const [proDetails, setProDetails] = useState([]);
    const [workerDetails, setWorkerDetails] = useState([]);
    const [operationTeamDetails, setOperationTeamDetails] = useState([]);
    const [activeDetails, setActiveDetails] = useState('pro');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newUserFormData, setNewUserFormData] = useState({
        username: '',
        email: '',
        role: '',
        password: '',
        first_name: '',
        last_name: '',
        is_staff: false,
        is_verified: false,
        company_id: companyId,
    });
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchDetails();
    }, [companyId]);

    const fetchDetails = () => {
        const accessToken = Cookies.get('accessToken');
        axios.get(`${API_URL}/main/prodetails/${companyId}/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then(response => {
                setProDetails(response.data);
            })
            .catch(error => {
                console.error('Error fetching ProDetails:', error);
            });

        axios.get(`${API_URL}/main/operationteam/${companyId}/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then(response => {
                setOperationTeamDetails(response.data);
            })
            .catch(error => {
                console.error('Error fetching OperationTeamDetails:', error);
            });

    };

    const handleButtonClick = (detailsType) => {
        setActiveDetails(detailsType);
    };

    const handleDelete = (detailId, detailType) => {
        const accessToken = Cookies.get('accessToken');
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this data!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${API_URL}/main/${detailType}/${companyId}/${detailId}/`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
                )
                    .then(response => {
                        fetchDetails();
                        Swal.fire(
                            'Deleted!',
                            `${detailType} has been deleted.`,
                            'success'
                        );
                    })
                    .catch(error => {
                        console.error(`Error deleting ${detailType}:`, error);
                        Swal.fire(
                            'Error',
                            `An error occurred while deleting ${detailType}.`,
                            'error'
                        );
                    });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                    'Cancelled',
                    `${detailType} is safe :)`,
                    'info'
                );
            }
        });
    };

    const handleCreateUser = (role) => {
        setNewUserFormData({
            username: '',
            email: '',
            role: role.toString(),
            password: '',
            company_id: companyId,
            first_name: '',
            last_name: '',
            is_staff: false,
            is_verified: false
        });
        setShowCreateModal(true);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        const accessToken = Cookies.get('accessToken');
        axios.post(`${API_URL}/users/users/registerx/`, newUserFormData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                console.log('User created successfully:', response.data);
                fetchDetails();
                setShowCreateModal(false);
                const filename = response.data.username;
                const fileContent = generateTextFileContent(response.data);
                downloadTextFile(fileContent, filename);
                Swal.fire({
                    icon: 'success',
                    title: 'User Created',
                    text: 'User created successfully!',
                });
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    const responseData = error.response.data;
                    let errorMessage = '';
                    for (const key in responseData) {
                        errorMessage += `${key}: ${responseData[key].join(', ')}\n`;
                    }
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: errorMessage,
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'An error occurred while creating the user.',
                    });
                }
            });
    };
    const roleNames = {
        3: 'Pro',
        4: 'Operation Team',
        5: 'Field Worker'
    };

    const generateTextFileContent = (userData) => {
        // Format the user data into text format
        const roleName = roleNames[userData.role] || userData.role;
        const content =
            `Name:    ${userData.first_name} ${userData.last_name}\n` +
            `Username:      ${userData.username}\n` +
            `Email:         ${userData.email}\n` +
            `Role:          ${roleName}\n` +
            `Password:      ${newUserFormData.password}\n` +
            `Staff:         ${userData.is_staff ? 'Yes' : 'No'}\n` +
            `Verified:      ${userData.is_verified ? 'Yes' : 'No'}`;

        return content;
    };

    const downloadTextFile = (content, filename) => {
        // Create a Blob object with the file content
        const blob = new Blob([content], { type: 'text/plain' });
        // Create a temporary anchor element
        const anchor = document.createElement('a');
        anchor.href = window.URL.createObjectURL(blob);
        anchor.download = `${filename}.txt`; // Set the file name
        // Trigger a click event on the anchor element to initiate download
        anchor.click();
        // Clean up
        window.URL.revokeObjectURL(anchor.href);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUserFormData({ ...newUserFormData, [name]: value });
    };

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const renderDetails = () => {
        switch (activeDetails) {
            case 'pro':
                return (
                    <div className='admin_toggle_container'>
                        <div className="admin-user-table-container">
                            <table className="admin-user-table">
                                <thead>
                                    <tr>
                                        <th className="admin-user-table-header">Office Staff Username</th>
                                        <th className="admin-user-table-header">Office Staff Email</th>
                                        <th className="admin-user-table-header">Office Staff Name</th>
                                        <th className="admin-user-table-header">Staff</th>
                                        <th className="admin-user-table-header">Verified</th>
                                        <th className="admin-user-table-header">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {proDetails
                                        .filter(pro =>
                                            pro.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            pro.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            pro.user.name.toLowerCase().includes(searchQuery.toLowerCase())
                                        )
                                        .map(pro => (
                                            <tr key={pro.user.id}>
                                                <td>{pro.user.email}</td>
                                                <td>{pro.user.username}</td>
                                                <td>{pro.user.name}</td>
                                                <td>{pro.user.is_staff ? 'Yes' : 'No'}</td>
                                                <td>{pro.user.is_verified ? 'Yes' : 'No'}</td>
                                                <td>
                                                    <button className="delete-user-btn" onClick={() => handleDelete(pro.id, 'prodetails')}>Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'operationTeam':
                return (
                    <div className='admin_toggle_container'>
                        <div className="admin-user-table-container">
                            <table className="admin-user-table">
                                <thead>
                                    <tr>
                                        <th className="admin-user-table-header">Team Username</th>
                                        <th className="admin-user-table-header">Team Email</th>
                                        <th className="admin-user-table-header">Team Name</th>
                                        <th className="admin-user-table-header">Staff</th>
                                        <th className="admin-user-table-header">Verified</th>
                                        <th className="admin-user-table-header">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {operationTeamDetails
                                        .filter(team =>
                                            team.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            team.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            team.user.name.toLowerCase().includes(searchQuery.toLowerCase())
                                        )
                                        .map(team => (
                                            <tr key={team.user.id}>
                                                <td>{team.user.username}</td>
                                                <td>{team.user.email}</td>
                                                <td>{team.user.name}</td>
                                                <td>{team.user.is_staff ? 'Yes' : 'No'}</td>
                                                <td>{team.user.is_verified ? 'Yes' : 'No'}</td>
                                                <td>
                                                    <button className="delete-user-btn" onClick={() => handleDelete(team.id, 'operationteam')}>Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );


            default:
                return null;
        }
    };



    return (
        <React.Fragment>
            <Sidebar>
                <Nav />
                <div className="head_bar_to_show_heading_main">
                    <button className="head_bar_to_show_heading">Office Stafs Details</button>
                </div>

                <div className="admin-buttons">
                    <button className='admin-buttons' onClick={() => handleButtonClick('pro')}>Office Staff</button>
                    <button className='admin-buttons' onClick={() => handleButtonClick('operationTeam')}>Operation Team</button>

                </div>
                <div className="search_admin_container change_the_colour_of_div">
                    <button className="create-user-btn" onClick={() => handleCreateUser(3)}>Create Office Staff</button>
                    <button className="create-user-btn" onClick={() => handleCreateUser(4)}>Create Operation Team</button>

                    <div className='search_admin_container'>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                            className='admin-search-input'

                        />
                    </div>
                </div>
                {renderDetails()}
                {showCreateModal && (
                    <div className="admin-create-user-overlay" onClick={() => setShowCreateModal(false)}>
                        <div className="update-user-modal" onClick={(e) => e.stopPropagation()}>
                            <h3>Create User</h3>
                            <form onSubmit={handleCreate}>
                                <div>
                                    <label>Username:</label>
                                    <input type="text" name="username" value={newUserFormData.username} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label>Email:</label>
                                    <input type="email" name="email" value={newUserFormData.email} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label>Role:</label>
                                    <select name="role" value={newUserFormData.role} onChange={handleInputChange}>
                                        <option value="3">Office Staff</option>
                                        <option value="4">Operation Team</option>

                                    </select>
                                </div>
                                <div>
                                    <label>Password:</label>
                                    <input type="password" name="password" value={newUserFormData.password} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label>First Name:</label>
                                    <input type="text" name="first_name" value={newUserFormData.first_name} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label>Last Name:</label>
                                    <input type="text" name="last_name" value={newUserFormData.last_name} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label>Staff:</label>
                                    <input type="checkbox" name="is_staff" checked={newUserFormData.is_staff} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label>Verified:</label>
                                    <input type="checkbox" name="is_verified" checked={newUserFormData.is_verified} onChange={handleInputChange} />
                                </div>

                                <button type="submit">Create</button>
                            </form>
                            <button onClick={() => setShowCreateModal(false)}>Close</button>
                        </div>
                    </div>
                )}
            </Sidebar>
        </React.Fragment>
    )
}


export default CompanyOfficeStaff