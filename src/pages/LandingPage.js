import React from 'react'
import { Link } from 'react-router-dom'

const LandingPage = () => {
  return (<>

    <div>LandingPage</div>
    <hr></hr>
    <Link to='/login'>Login</Link><hr></hr>
    <Link to='/signup'>Signup</Link><hr></hr>


    <Link to='/admin'>Admin</Link><hr></hr>
  </>

  )
}

export default LandingPage