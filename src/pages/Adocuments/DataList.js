import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import Nav from '../../components/Navbar/Nav';
import { API_URL } from '../../ConfigApi';
import Cookies from 'js-cookie';
import "./Documents.css"

const DataList = () => {
    const { id } = useParams();
    const [excelData, setExcelData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, [id, currentPage]);

    const fetchData = async () => {
        setLoading(true);
        const accessToken = Cookies.get('accessToken');
        try {
            const response = await axios.get(`${API_URL}/main/excel-file/${id}/?page=${currentPage}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setExcelData(response.data.results);
            setTotalCount(response.data.count);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
            // You can add user feedback here, like showing an error message
        }
    };

    const handlePagination = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(totalCount / 100); // Assuming 10 items per page

    return (
        <Sidebar>
            <Nav />
            <div className="head_bar_to_show_heading_main">
                <h2>Total Count: {totalCount}</h2>
                <button className='head_bar_to_show_heading'>File data</button>
            </div>

            {loading ? (
                <div>Loading data...</div>
            ) : (
                <div className='admin_toggle_container'>
                    <div>
                        <button onClick={() => handlePagination(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                        <button onClick={() => handlePagination(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
                        <button>Current Page : {currentPage}</button>
                    </div>
                    <div className="admin-user-table-container">
                        <table className="admin-user-table">
                            <thead>
                                <tr>
                                    <th className="admin-user-table-header">ID</th>
                                    <th className="admin-user-table-header">Registration Number</th>
                                    <th className="admin-user-table-header">First Confirmer Name</th>
                                    <th className="admin-user-table-header">First Confirmer No</th>
                                    <th className="admin-user-table-header">Second Confirmer Name</th>
                                    <th className="admin-user-table-header">Second Confirmer No</th>
                                    <th className="admin-user-table-header">Third Confirmer Name</th>
                                    <th className="admin-user-table-header">Third Confirmer No</th>
                                    <th className="admin-user-table-header">Loan Number</th>
                                    <th className="admin-user-table-header">Make</th>
                                    <th className="admin-user-table-header">Chasis Number</th>
                                    <th className="admin-user-table-header">Engine Number</th>
                                    <th className="admin-user-table-header">EMI</th>
                                    <th className="admin-user-table-header">POS</th>
                                    <th className="admin-user-table-header">Bucket</th>
                                    <th className="admin-user-table-header">Customer Name</th>
                                    <th className="admin-user-table-header">Address</th>
                                    <th className="admin-user-table-header">Branch</th>
                                    <th className="admin-user-table-header">Section 17</th>
                                    <th className="admin-user-table-header">Seasoning</th>
                                    <th className="admin-user-table-header">TBR</th>
                                    <th className="admin-user-table-header">Allocation</th>
                                    <th className="admin-user-table-header">Model</th>
                                    <th className="admin-user-table-header">Product Name</th>
                                    <th className="admin-user-table-header">Excel File</th>
                                </tr>
                            </thead>
                            <tbody>
                                {excelData.map(data => (
                                    <tr key={data.id}>
                                        <td className='dataShowing'>{data.id}</td>
                                        <td className='dataShowing'>{data.registration_number}</td>
                                        <td className='dataShowing'>{data.first_confirmer_name}</td>
                                        <td className='dataShowing'>{data.first_confirmer_no}</td>
                                        <td className='dataShowing'>{data.second_confirmer_name}</td>
                                        <td className='dataShowing'>{data.second_confirmer_no}</td>
                                        <td className='dataShowing'>{data.third_confirmer_name}</td>
                                        <td className='dataShowing'>{data.third_confirmer_no}</td>
                                        <td className='dataShowing'>{data.loan_number}</td>
                                        <td className='dataShowing'>{data.make}</td>
                                        <td className='dataShowing'>{data.chasis_number}</td>
                                        <td className='dataShowing'>{data.engine_number}</td>
                                        <td className='dataShowing'>{data.emi}</td>
                                        <td className='dataShowing'>{data.pos}</td>
                                        <td className='dataShowing'>{data.bucket}</td>
                                        <td className='dataShowing'>{data.customer_name}</td>
                                        <td className='dataShowing'>{data.address}</td>
                                        <td className='dataShowing'>{data.branch}</td>
                                        <td className='dataShowing'>{data.sec_17}</td>
                                        <td className='dataShowing'>{data.seasoning}</td>
                                        <td className='dataShowing'>{data.tbr}</td>
                                        <td className='dataShowing'>{data.allocation}</td>
                                        <td className='dataShowing'>{data.model}</td>
                                        <td className='dataShowing'>{data.product_name}</td>
                                        <td className='dataShowing'>{data.excel_file}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div>
                <button onClick={() => handlePagination(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                <button onClick={() => handlePagination(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
            </div>
        </Sidebar>
    );
};

export default DataList;

