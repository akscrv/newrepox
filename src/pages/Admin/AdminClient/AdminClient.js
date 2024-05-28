import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import Swal from 'sweetalert2';
import Nav from '../../../components/Navbar/Nav';
import Sidebar from '../../../components/Sidebar/Sidebar';
import { API_URL } from '../../../ConfigApi';
import { jwtDecode } from 'jwt-decode';

const AdminClient = () => {
    const [clientDetails, setClientDetails] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [editClientData, setEditClientData] = useState({
        name: '',
        city: '',
        state: '',
        zip_code: '',
        gst_no: '',
        pan_no: '',
        contact: '',
        status: 'active',
    });

    const decodedToken = jwtDecode(Cookies.get('accessToken'));
    const adminId = decodedToken.admin_details.admin_id;

    const [clientFormData, setClientFormData] = useState({
        name: '',
        city: '',
        state: '',
        zip_code: '',
        gst_no: '',
        pan_no: '',
        contact: '',
        status: 'active',
        admin: adminId,
    });

    useEffect(() => {
        fetchClientDetails();
    }, []);

    const fetchClientDetails = () => {
        const accessToken = Cookies.get('accessToken');
        axios
            .get(`${API_URL}/main/adminclientdetails/`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
            .then((response) => {
                setClientDetails(response.data);
            })
            .catch((error) => {
                console.error('Error fetching client details:', error);
            });
    };

    const handleCreate = (e) => {
        e.preventDefault();
        const accessToken = Cookies.get('accessToken');
        axios
            .post(`${API_URL}/main/adminclientdetails/`, clientFormData, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
            .then(() => {
                fetchClientDetails(); // Refresh list
                setShowCreateModal(false); // Close modal
                Swal.fire('Success', 'Client created successfully!', 'success');
            })
            .catch((error) => {
                console.error('Error creating client:', error);
                Swal.fire('Error', 'You do not have permission to perform this action.', 'error');
            });
    };

    const handleDelete = (clientId) => {
        const accessToken = Cookies.get('accessToken');
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this data!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`${API_URL}/main/adminclientdetails/${clientId}/`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    })
                    .then(() => {
                        fetchClientDetails();
                        Swal.fire('Deleted!', 'Client has been deleted.', 'success');
                    })
                    .catch((error) => {
                        console.error('Error deleting client:', error);
                        Swal.fire('Error', 'An error occurred while deleting the client.', 'error');
                    });
            }
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        const accessToken = Cookies.get('accessToken');
        axios
            .patch(
                `${API_URL}/main/adminclientdetails/${editClientData.id}/`,
                editClientData,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            )
            .then(() => {
                fetchClientDetails(); // Refresh list
                setShowUpdateModal(false); // Close modal
                Swal.fire('Success', 'Client updated successfully!', 'success');
            })
            .catch((error) => {
                console.error('Error updating client:', error);
                Swal.fire('Error', 'An error occurred while updating the client.', 'error');
            });
    };

    const openUpdateModal = (client) => {
        setEditClientData(client); // Set data for editing
        setShowUpdateModal(true); // Show modal
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (showUpdateModal) {
            setEditClientData((prev) => ({
                ...prev,
                [name]: value,
            }));
        } else {
            setClientFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    return (
        <Sidebar>
            <Nav />
            <div className="head_bar_to_show_heading_main">
                <button className="head_bar_to_show_heading">Admin Client List</button>
            </div>
            <div className="admin_toggle_container">
                <div className="search_admin_container">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="admin-search-input"
                    />
                </div>
                <button
                    className="table_control_button"
                    onClick={() => setShowCreateModal(true)}
                >
                    Create Client
                </button>

                <div className="admin-user-table-container">
                    <table className="admin-user-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>City</th>
                                <th>State</th>
                                <th>ZIP Code</th>
                                <th>GST No</th>
                                <th>PAN No</th>
                                <th>Contact</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientDetails
                                .filter(
                                    (client) =>
                                        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        client.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        client.state.toLowerCase().includes(searchQuery.toLowerCase())
                                )
                                .map((client) => (
                                    <tr key={client.id}>
                                        <td>{client.name}</td>
                                        <td>{client.city}</td>
                                        <td>{client.state}</td>
                                        <td>{client.zip_code}</td>
                                        <td>{client.gst_no}</td>
                                        <td>{client.pan_no}</td>
                                        <td>{client.contact}</td>
                                        <td>{client.status}</td>
                                        <td>
                                            <button
                                                className="update-user-btn"
                                                onClick={() => openUpdateModal(client)}
                                            >
                                                Update
                                            </button>
                                            <button
                                                className="delete-user-btn"
                                                onClick={() => handleDelete(client.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                {showCreateModal && (
                    <div
                        className="admin-user-update-overlay"
                        onClick={() => setShowCreateModal(false)}
                    >
                        <div
                            className="update-user-modal"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3>Create Client</h3>
                            <form onSubmit={handleCreate}>
                                <div>
                                    <label>Name:</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={clientFormData.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label>City:</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={clientFormData.city}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label>State:</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={clientFormData.state}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label>ZIP Code:</label>
                                    <input
                                        type="text"
                                        name={"zip_code"}
                                        value={clientFormData.zip_code}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label>GST No:</label>
                                    <input
                                        type="text"
                                        name="gst_no"
                                        value={clientFormData.gst_no}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label>PAN No:</label>
                                    <input
                                        type="text"
                                        name={"pan_no"}
                                        value={clientFormData.pan_no}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label>Contact:</label>
                                    <input
                                        type={"text"}
                                        name={"contact"}
                                        value={clientFormData.contact}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <button type="submit">Create</button>
                                <button type="button" onClick={() => setShowCreateModal(false)}>Close</button>
                            </form>
                        </div>
                    </div>
                )}

                {showUpdateModal && (
                    <div
                        className="admin-user-update-overlay"
                        onClick={() => setShowUpdateModal(false)}
                    >
                        <div
                            className="update-user-modal"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3>Update Client</h3>
                            <form onSubmit={handleUpdate}>
                                <div>
                                    <label>Name:</label>
                                    <input
                                        type="text"
                                        name={"name"}
                                        value={editClientData.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label>City:</label>
                                    <input
                                        type={"text"}
                                        name={"city"}
                                        value={editClientData.city}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label>State:</label>
                                    <input
                                        type={"text"}
                                        name={"state"}
                                        value={editClientData.state}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label>ZIP Code:</label>
                                    <input
                                        type={"text"}
                                        name={"zip_code"}
                                        value={editClientData.zip_code}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label>GST No:</label>
                                    <input
                                        type={"text"}
                                        name={"gst_no"}
                                        value={editClientData.gst_no}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label>PAN No:</label>
                                    <input
                                        type={"text"}
                                        name={"pan_no"}
                                        value={editClientData.pan_no}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label>Contact:</label>
                                    <input
                                        type={"text"}
                                        name={"contact"}
                                        value={editClientData.contact}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label>Status:</label>
                                    <select
                                        name="status"
                                        value={editClientData.status}
                                        onChange={handleInputChange}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                                <button type="submit">Update</button>
                                <button type="button" onClick={() => setShowUpdateModal(false)}>Close</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Sidebar>
    );
};

export default AdminClient;
