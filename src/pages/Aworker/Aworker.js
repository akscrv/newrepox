import React from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import Nav from '../../components/Navbar/Nav'

const Aworker = () => {
    return (
        <Sidebar>
            <Nav />
            <div className="head_bar_to_show_heading_main">
                <button className='head_bar_to_show_heading' >Agent</button>

            </div>


        </Sidebar>
    )
}

export default Aworker