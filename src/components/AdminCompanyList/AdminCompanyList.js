import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API_URL } from '../../ConfigApi';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

const AdminCompanyList = () => {
    const [companies, setCompanies] = useState([]);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);

    const [updatedCompanyData, setUpdatedCompanyData] = useState({
        id: "",
        company_name: "",
        company_address: "",
        phone_no: "",
        website: "",
        num_of_employe: "",
        registration_year: ""
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
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = () => {
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
            axios.get(`${API_URL}/main/company/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }) // Assuming the API endpoint is '/company/'
                .then(response => {
                    setCompanies(response.data);
                })
                .catch(error => {
                    console.error('Error fetching companies:', error);
                });
        }
    };

    const updateCompany = (company) => {
        setSelectedCompany(company);
        setShowUpdateModal(true);
        setUpdatedCompanyData(company);
    };

    const handleUpdate = () => {
        console.log('Updating company...');
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

        // Create a copy of the updatedCompanyData object without the 'user' field
        const { user, ...updatedDataWithoutUser } = updatedCompanyData;

        axios.patch(`${API_URL}/main/company/${selectedCompany.id}/`, updatedDataWithoutUser, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(response => {
                console.log('Update successful:', response.data);
                setShowUpdateModal(false);
                fetchCompanies(); // Refresh company data after update
                Swal.fire(
                    'Updated!',
                    'Company has been updated.',
                    'success'
                );
            })
            .catch(error => {
                console.error('Error updating company:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Update Failed',
                    text: 'An error occurred while updating the company.',
                });
            });
    };



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedCompanyData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
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

                // Prompt user to update agency information
                Swal.fire({
                    title: 'User Created Successfully!',
                    text: 'Do you want to update the Agency Information?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        // Fetch companies again
                        const companiesResponse = await fetch(`${API_URL}/main/company/`, {
                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            }
                        });
                        if (!companiesResponse.ok) {
                            throw new Error('Failed to fetch companies');
                        }
                        const companiesData = await companiesResponse.json();

                        // Find the company ID corresponding to the user ID
                        const userCompany = companiesData.find(company => company.user.id === responseData.id);
                        if (!userCompany) {
                            throw new Error('User is not associated with any company');
                        }

                        // Update the agency information
                        updateCompany(userCompany);
                    }
                });

                // Close create form after showing the Swal prompt
                setShowCreateModal(false);

                fetchCompanies(); // Refresh company data after creating user
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





    const deleteCompany = (companyId) => {
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

        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to delete this company.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${API_URL}/main/company/${companyId}/delete`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                    .then(response => {
                        console.log('Company deleted:', response.data);
                        fetchCompanies(); // Refresh company data after deletion
                        Swal.fire(
                            'Deleted!',
                            'Company has been deleted.',
                            'success'
                        );
                    })
                    .catch(error => {
                        console.error('Error deleting company:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Deletion Failed',
                            text: 'An error occurred while deleting the company.',
                        });
                    });
            }
        });
    };

    const filteredCompanies = companies.filter(company =>
        (company.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) || "") ||
        (company.company_address?.toLowerCase().includes(searchQuery.toLowerCase()) || "") ||
        (company.website?.toLowerCase().includes(searchQuery.toLowerCase()) || "") ||
        (company.phone_no?.toLowerCase().includes(searchQuery.toLowerCase()) || "") ||
        // (company.num_of_employe?.toLowerCase().includes(searchQuery.toLowerCase()) || "") ||
        (company.registration_year?.toLowerCase().includes(searchQuery.toLowerCase()) || "")
    );

    return (
        <div className='admin_toggle_container'>
            <div className='search_admin_container'>
                <input
                    type="text"
                    placeholder="Search Company by Name, Address or Phone Number"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="admin-search-input"
                />

            </div>



            <div className="admin-user-table-container">
                <button className='table_control_button Create_button_right' onClick={() => setShowCreateModal(true)}>Create User</button>

                <table className="admin-user-table">
                    <thead>
                        <tr>
                            <th className="admin-user-table-header">Username</th>
                            <th className="admin-user-table-header">Email</th>
                            <th className="admin-user-table-header">Company Name</th>
                            <th className="admin-user-table-header">Owner Name</th>


                            <th className="admin-user-table-header">Phone No</th>
                            <th className="admin-user-table-header">Website</th>
                            <th className="admin-user-table-header">Address</th>

                            <th className="admin-user-table-header">Number of Employees</th>
                            <th className="admin-user-table-header">Registration Year</th>




                            <th className="admin-user-table-header">Staff</th>
                            <th className="admin-user-table-header">Varified</th>
                            <th className="admin-user-table-header">Actions</th>

                        </tr>
                    </thead>
                    <tbody>
                        {filteredCompanies.map(company => (
                            <tr key={company.id}>
                                <td><Link to={`/company/${company.id}`}>{company.user.username}</Link></td>

                                <td>
                                    <Link to={`/company/${company.id}`}>{company.user.email}</Link>
                                </td>
                                <td>{company.company_name}</td>
                                <td>{company.user.name}</td>
                                <td>{company.phone_no}</td>
                                <td>{company.website}</td>
                                <td>{company.company_address}</td>
                                <td>{company.num_of_employe}</td>

                                <td>{company.registration_year}</td>


                                <td>{company.user.is_staff ? 'Yes' : 'No'}</td>
                                <td>{company.user.is_verified ? 'Yes' : 'No'}</td>
                                <td>
                                    <button className="update-user-btn" onClick={() => updateCompany(company)}>Update</button>
                                    <button className="delete-user-btn" onClick={() => deleteCompany(company.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Update Company Modal */}
            {showUpdateModal && selectedCompany && (


                <div className="admin-user-update-overlay" onClick={() => setShowUpdateModal(false)}>
                    <div className="update-user-modal" onClick={(e) => e.stopPropagation()}>


                        <h3>Update Company</h3>
                        <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} onClick={(e) => e.stopPropagation()}>
                            <div>
                                <label>Company Name:</label>
                                <input type="text" name="company_name" value={updatedCompanyData.company_name} onChange={handleInputChange} />
                            </div>
                            <div>
                                <label>Company Address:</label>
                                <input type="text" name="company_address" value={updatedCompanyData.company_address} onChange={handleInputChange} />

                            </div>
                            <div>
                                <label>Phone Number</label>
                                <input type="text" name="phone_no" value={updatedCompanyData.phone_no} onChange={handleInputChange} />

                            </div>

                            <div>
                                <label>Website</label>
                                <input type="text" name="website" value={updatedCompanyData.website} onChange={handleInputChange} />

                            </div>

                            <div>
                                <label>Total Employe</label>
                                <input type="text" name="num_of_employe" value={updatedCompanyData.num_of_employe} onChange={handleInputChange} />

                            </div>

                            <div>
                                <label>Registration Year</label>
                                <input type="text" name="registration_year" value={updatedCompanyData.registration_year} onChange={handleInputChange} />

                            </div>






                            <button className='adminshow_update_button' type="submit">Update</button>
                        </form>
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
                                    {/* <option value="1">Admin</option> */}
                                    <option value="2">Agency</option>
                                    {/* <option value="3">Pro</option>
                                        <option value="4">Operationteam</option>
                                        <option value="5">Worker</option> */}
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
    );
}

export default AdminCompanyList;





