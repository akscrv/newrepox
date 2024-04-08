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
                    placeholder="Search Company"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="admin-search-input"
                />
            </div>

            <div className="admin-user-table-container">
                <table className="admin-user-table">
                    <thead>
                        <tr>
                            <th className="admin-user-table-header">Email</th>
                            <th className="admin-user-table-header">Company Name</th>
                            <th className="admin-user-table-header">Address</th>
                            <th className="admin-user-table-header">Phone No</th>
                            <th className="admin-user-table-header">Website</th>
                            <th className="admin-user-table-header">Number of Employees</th>
                            <th className="admin-user-table-header">Registration Year</th>

                            <th className="admin-user-table-header">Username</th>
                            <th className="admin-user-table-header">User Name</th>

                            <th className="admin-user-table-header">Staff</th>
                            <th className="admin-user-table-header">Varified</th>
                            <th className="admin-user-table-header">Actions</th>

                        </tr>
                    </thead>
                    <tbody>
                        {filteredCompanies.map(company => (
                            <tr key={company.id}>
                                <td><Link to={`/company/${company.id}`}>{company.user.email}</Link></td>

                                <td>
                                    <Link to={`/company/${company.id}`}>{company.company_name}</Link>
                                </td>
                                <td>{company.company_address}</td>
                                <td>{company.phone_no}</td>
                                <td>{company.website}</td>
                                <td>{company.num_of_employe}</td>
                                <td>{company.registration_year}</td>

                                <td>{company.user.email}</td>
                                <td>{company.user.name}</td>

                                <td>{company.user.is_staff ? 'Yes' : 'No'}</td>
                                <td>{company.user.is_verified ? 'Yes' : 'No'}</td>
                                <td>
                                    <button className="update-user-btn" onClick={() => updateCompany(company)}>Update</button>
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


        </div>
    );
}

export default AdminCompanyList;





