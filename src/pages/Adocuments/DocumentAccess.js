import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Sidebar/Sidebar';
import Nav from '../../components/Navbar/Nav';
import { API_URL } from '../../ConfigApi';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import "./Documents.css";

const DocumentAccess = () => {
    const { id } = useParams();
    const [companies, setCompanies] = useState([]);
    const [accessEntries, setAccessEntries] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState('');

    useEffect(() => {
        fetchCompanies();
        fetchAccessEntries();
    }, []);

    const fetchCompanies = async () => {
        try {
            const accessToken = Cookies.get('accessToken');
            const response = await axios.get(`${API_URL}/main/company/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setCompanies(response.data);
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };

    const fetchAccessEntries = async () => {
        try {
            const accessToken = Cookies.get('accessToken');
            const response = await axios.get(`${API_URL}/main/excel-file/${id}/access/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setAccessEntries(response.data);
        } catch (error) {
            console.error('Error fetching access entries:', error);
        }
    };

    const handleAddAccess = async () => {
        if (!selectedCompany) {
            Swal.fire({
                icon: 'error',
                title: 'Add Access Failed',
                text: 'Please select a company.',
            });
            return;
        }

        const confirmResult = await Swal.fire({
            icon: 'question',
            title: 'Confirm Add Access',
            text: `Are you sure you want to give access to this file for the company "${companies.find(company => company.id === selectedCompany)?.company_name}"?`,
            showCancelButton: true,
            confirmButtonText: 'Add',
            cancelButtonText: 'Cancel'
        });

        if (confirmResult.isConfirmed) {
            const accessToken = Cookies.get('accessToken');
            try {
                await axios.post(`${API_URL}/main/excel-file/access/`, {
                    excel_file: id,
                    company_ids: [selectedCompany]
                }, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                console.log("Access added successfully!");
                await fetchAccessEntries(); // Fetch access entries again to update the list
                Swal.fire({
                    icon: 'success',
                    title: 'Access Added!',
                    showConfirmButton: false,
                    timer: 1500
                });
            } catch (error) {
                console.error('Error adding access:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Add Access Failed',
                    text: 'An error occurred while adding access. Please try again later.',
                });
            }
        }
    };

    const handleDeleteAccess = async (accessId) => {
        const confirmResult = await Swal.fire({
            icon: 'question',
            title: 'Confirm Deletion',
            text: 'Are you sure you want to delete this access?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel'
        });

        if (confirmResult.isConfirmed) {
            const accessToken = Cookies.get('accessToken');
            try {
                await axios.delete(`${API_URL}/main/excel-file/access/${accessId}/delete/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                console.log("Access deleted successfully!");
                await fetchAccessEntries(); // Fetch access entries again to update the list
                Swal.fire({
                    icon: 'success',
                    title: 'Access Deleted!',
                    showConfirmButton: false,
                    timer: 1500
                });
            } catch (error) {
                console.error('Error deleting access:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Delete Failed',
                    text: 'An error occurred while deleting the access. Please try again later.',
                });
            }
        }
    };

    return (
        <Sidebar>
            <Nav />
            <div className="access-container">
                <div className="head_bar_to_show_heading_main">
                    <button className='head_bar_to_show_heading'>Document Access</button>
                </div>

                <div className="access-part">
                    <select className="choose_file" value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
                        <option value="">Select Company</option>
                        {companies.map(company => (
                            <option key={company.id} value={company.id}>{company.company_name}</option>
                        ))}
                    </select>
                    <button className="add_access_button" onClick={handleAddAccess}>Add Access</button>
                </div>

                <div className="admin-user-table-container">
                    <table className="admin-user-table">
                        <thead>
                            <tr>
                                <th className="admin-user-table-header">Company Name</th>
                                <th className="admin-user-table-header">Delete Access</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accessEntries.length > 0 ? (
                                accessEntries.map(entry => (
                                    <tr key={entry.id}>
                                        <td>{companies.find(company => company.id === entry.company)?.company_name}</td>
                                        <td>
                                            <button onClick={() => handleDeleteAccess(entry.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2">No companies have access to this file.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Sidebar>
    );
};

export default DocumentAccess;
