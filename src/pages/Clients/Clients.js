import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Nav from '../../components/Navbar/Nav';
import Sidebar from '../../components/Sidebar/Sidebar';
import axios from 'axios';
import { API_URL } from '../../ConfigApi';
import Swal from 'sweetalert2';
import "./Clients.css";

const ClientDetailsComponent = () => {
    const [clientDetails, setClientDetails] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false); // Define showUpdateModal state
    const [editClientData, setEditClientData] = useState({}); // Define editClientData state

    const [clientFormData, setClientFormData] = useState({
        name: '',
        city: '',
        state: '',
        zip_code: '',
        gst_no: '',
        pan_no: '',
        contact: '',
        status: 'active', // Default status for new clients
    });

    useEffect(() => {
        fetchClientDetails();
    }, []);

    const fetchClientDetails = () => {
        const accessToken = Cookies.get('accessToken');
        axios.get(`${API_URL}/main/clientdetails/company/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((response) => {
                setClientDetails(response.data);
            })
            .catch((error) => {
                console.error('Error fetching ClientDetails:', error);
            });
    };

    const handleCreate = (e) => {
        e.preventDefault();
        const accessToken = Cookies.get('accessToken');
        const decodedToken = JSON.parse(atob(accessToken.split('.')[1]));
        const company_id = decodedToken.company_details.company_id;
        const formDataWithCompanyId = { ...clientFormData, company: company_id };

        axios.post(`${API_URL}/main/clientdetails/create/`, formDataWithCompanyId, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                fetchClientDetails();
                setShowCreateModal(false);
                setClientFormData({
                    name: '',
                    city: '',
                    state: '',
                    zip_code: '',
                    gst_no: '',
                    pan_no: '',
                    contact: '',
                    status: 'active',
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Client Created',
                    text: 'Client created successfully!',
                });
            })
            .catch((error) => {
                console.error('Error creating client:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An error occurred while creating the client.',
                });
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
                axios.delete(`${API_URL}/main/clientdetails/${clientId}/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                    .then(() => {
                        fetchClientDetails();
                        Swal.fire(
                            'Deleted!',
                            'Client has been deleted.',
                            'success'
                        );
                    })
                    .catch((error) => {
                        console.error('Error deleting client:', error);
                        Swal.fire(
                            'Error',
                            'An error occurred while deleting the client.',
                            'error'
                        );
                    });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                    'Cancelled',
                    'Client is safe :)',
                    'info'
                );
            }
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        const accessToken = Cookies.get('accessToken');
        const clientId = editClientData.id; // Get the ID of the client to be updated

        axios.put(`${API_URL}/main/clientdetails/${clientId}/`, editClientData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                fetchClientDetails();
                setShowUpdateModal(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Client Updated',
                    text: 'Client updated successfully!',
                });
            })
            .catch((error) => {
                console.error('Error updating client:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An error occurred while updating the client.',
                });
            });
    };

    const openUpdateModal = (client) => {
        setEditClientData(client);
        setShowUpdateModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (showUpdateModal) {
            setEditClientData(prevState => ({
                ...prevState,
                [name]: value,
            }));
        } else {
            setClientFormData(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    return (
        <Sidebar>
            <Nav />
            <div className="head_bar_to_show_heading_main">
                <button className="head_bar_to_show_heading">Client List</button>
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
                                .filter(client =>
                                    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    client.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    client.state.toLowerCase().includes(searchQuery.toLowerCase())
                                )
                                .map(client => (
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
                                        name="zip_code"
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
                                        name="pan_no"
                                        value={clientFormData.pan_no}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label>Contact:</label>
                                    <input
                                        type="text"
                                        name="contact"
                                        value={clientFormData.contact}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <button type="submit">Create</button>
                            </form>
                            <button onClick={() => setShowCreateModal(false)}>Close</button>
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
                                        name="name"
                                        value={editClientData.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label>City:</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={editClientData.city}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label>State:</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={editClientData.state}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label>ZIP Code:</label>
                                    <input
                                        type="text"
                                        name="zip_code"
                                        value={editClientData.zip_code}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label>GST No:</label>
                                    <input
                                        type="text"
                                        name="gst_no"
                                        value={editClientData.gst_no}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label>PAN No:</label>
                                    <input
                                        type="text"
                                        name="pan_no"
                                        value={editClientData.pan_no}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label>Contact:</label>
                                    <input
                                        type="text"
                                        name="contact"
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
                            </form>
                            <button onClick={() => setShowUpdateModal(false)}>Close</button>
                        </div>
                    </div>
                )}

            </div>
        </Sidebar>
    );
};

export default ClientDetailsComponent;
