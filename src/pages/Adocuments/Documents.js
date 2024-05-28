import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar/Sidebar';
import Nav from '../../components/Navbar/Nav';
import { API_URL } from '../../ConfigApi';
import Cookies from 'js-cookie';
import "./Documents.css";
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const Documents = () => {
    const [file, setFile] = useState(null);
    const [adminClients, setAdminClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [files, setFiles] = useState([]);

    useEffect(() => {
        fetchAdminClients();
        fetchFiles();
    }, []);

    const fetchAdminClients = async () => {
        try {
            const accessToken = Cookies.get('accessToken');
            const response = await axios.get(`${API_URL}/main/adminclientdetails/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setAdminClients(response.data);
        } catch (error) {
            console.error('Error fetching admin clients:', error);
        }
    };

    const fetchFiles = async () => {
        try {
            const accessToken = Cookies.get('accessToken');
            const response = await axios.get(`${API_URL}/main/excel-files/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setFiles(response.data);
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };

    const handleFileUpload = async () => {
        if (!file || !selectedClient) {
            Swal.fire({
                icon: 'error',
                title: 'Upload Failed',
                text: 'Please select a file and admin client.',
            });
            return;
        }

        const confirmResult = await Swal.fire({
            icon: 'question',
            title: 'Confirm Upload',
            text: `Are you sure you want to upload the file "${file.name}" for the admin client "${adminClients.find(client => client.id === selectedClient)?.name}"?`,
            showCancelButton: true,
            confirmButtonText: 'Upload',
            cancelButtonText: 'Cancel'
        });

        if (confirmResult.isConfirmed) {
            const accessToken = Cookies.get('accessToken');
            const formData = new FormData();
            formData.append('file', file);
            formData.append('file_name', file.name); // Include file_name field
            formData.append('admin_client', selectedClient); // Include admin_client field
            try {
                await axios.post(`${API_URL}/main/upload/`, formData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log("File uploaded successfully!");
                await fetchFiles(); // Fetch files again to update the list
                Swal.fire({
                    icon: 'success',
                    title: 'File Uploaded!',
                    showConfirmButton: false,
                    timer: 1500
                });
            } catch (error) {
                console.error('Error uploading file:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Upload Failed',
                    text: 'An error occurred while uploading the file. Please try again later.',
                });
            }
        }
    };

    const handleDeleteFile = async (fileId) => {
        const confirmResult = await Swal.fire({
            icon: 'question',
            title: 'Confirm Deletion',
            text: 'Are you sure you want to delete this file?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel'
        });

        if (confirmResult.isConfirmed) {
            const accessToken = Cookies.get('accessToken');
            try {
                await axios.delete(`${API_URL}/main/excel-files/${fileId}/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                console.log("File deleted successfully!");
                await fetchFiles(); // Fetch files again to update the list
                Swal.fire({
                    icon: 'success',
                    title: 'File Deleted!',
                    showConfirmButton: false,
                    timer: 1500
                });
            } catch (error) {
                console.error('Error deleting file:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Delete Failed',
                    text: 'An error occurred while deleting the file. Please try again later.',
                });
            }
        }
    };
    const downloadFile = () => {

        const excelUrl = "ExcelFormat.xlsx";
        const link = document.createElement("a");
        link.href = excelUrl;
        link.download = "ExcelFormat.xlsx"; // specify the filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);


    };


    return (
        <Sidebar>
            <Nav />

            <div className="head_bar_to_show_heading_main">
                <button className='head_bar_to_show_heading'>Documents</button>
            </div>

            <div className='admin_toggle_container'>
                <div className='upload_part'>

                    <input className="choose_file" type="file" onChange={(e) => setFile(e.target.files[0])} />
                    <select className="choose_file" value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}>
                        <option value="">Select Admin Client</option>
                        {adminClients.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                    </select>
                    <button className="upload_button" onClick={handleFileUpload}>Upload</button>

                    <button className="download_button" onClick={downloadFile} >Download Sample File</button>

                </div>


                <div className="admin-user-table-container">
                    <table className="admin-user-table">
                        <thead>
                            <tr>
                                <th className="admin-user-table-header">File Name</th>
                                <th className="admin-user-table-header">Client Name</th>
                                <th className="admin-user-table-header">Created At</th>
                                <th className="admin-user-table-header">Delete</th>
                                <th className="admin-user-table-header">Access Control</th>

                            </tr>
                        </thead>
                        <tbody>
                            {files.map(file => (
                                <tr key={file.id}>
                                    <td>
                                        <Link to={`${file.id}`}>
                                            {file.file_name}
                                        </Link>
                                    </td>
                                    <td>{adminClients.find(client => client.id === file.admin_client)?.name}</td>
                                    <td>{file.created_at}</td>
                                    <td>
                                        <button onClick={() => handleDeleteFile(file.id)}>Delete</button>
                                    </td>
                                    <td>  <Link to={`access/${file.id}`}>
                                        <button>Access Control</button>
                                    </Link>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Sidebar>
    );
};

export default Documents;
