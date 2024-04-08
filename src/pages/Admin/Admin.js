import React, { useState, useEffect } from 'react';
import Nav from '../../components/Navbar/Nav';
import AdminUserList from '../../components/AdminUserList/AdminUserList';
import AdminCompanyList from '../../components/AdminCompanyList/AdminCompanyList';
import Sidebar from '../../components/Sidebar/Sidebar';
import axios from 'axios'; // Import axios for API requests
import './Admin.css';
import Cookies from 'js-cookie';
import { API_URL } from '../../ConfigApi';

const Admin = () => {
  const [roleCounts, setRoleCounts] = useState({
    Admin: 0,
    Company: 0,
    Pro: 0,
    Operationteam: 0,
    Worker: 0,
  });

  const [displayUsers, setDisplayUsers] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      axios
        .get(`${API_URL}/users/users/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          // Count users by role
          const counts = response.data.reduce((acc, user) => {
            acc[user.role] = (acc[user.role] || 0) + 1;
            return acc;
          }, {});
          setRoleCounts(counts);
        })
        .catch((error) => {
          console.error('Error fetching users:', error);
        });
    }
  };

  return (
    <React.Fragment>
      <Sidebar>
        <Nav />

        <div className="admin-boxes">
          <div className="admin-box">
            <h3>Total</h3>
            <span className="admin_box_count">{Object.values(roleCounts).reduce((a, b) => a + b, 0)}</span>
          </div>
          {Object.entries(roleCounts).map(([role, count]) => (
            <div className="admin-box" key={role}>
              <h3>{role}</h3>
              <span className="admin_box_count">{count}</span>
            </div>
          ))}
        </div>
        <div className="admin-buttons">
          <button className='admin-buttons' onClick={() => setDisplayUsers(true)}>Users</button>
          <button className='admin-buttons' onClick={() => setDisplayUsers(false)}>Company</button>
        </div>
        {displayUsers ? <AdminUserList /> : <AdminCompanyList />}

      </Sidebar>
    </React.Fragment>
  );
};

export default Admin;
