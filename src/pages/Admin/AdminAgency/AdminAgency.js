import React from 'react'
import Sidebar from '../../../components/Sidebar/Sidebar'
import Nav from '../../../components/Navbar/Nav'

import AdminCompanyList from '../../../components/AdminCompanyList/AdminCompanyList'

const AdminAgency = () => {
    return (<>
        <Sidebar>
            <Nav />
            <div className="head_bar_to_show_heading_main">
                <button className='head_bar_to_show_heading' >All Agency List</button>

            </div>
            <AdminCompanyList />

        </Sidebar>
    </>

    )
}

export default AdminAgency