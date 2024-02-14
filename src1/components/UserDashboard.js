import React from 'react'
import { useDispatch, useSelector } from 'react-redux';

function UserDashboard() {
  const user = useSelector((state) => state.user.userData);
  return (
    <div className='tab-content-container'>
    <div className='tab-content-container-header'>
     <h1>Welcome to your dashboard, {user.firstName}</h1>
    </div>
    
    <div className='tab-content-container-contents'>
      <div> <i class="fa-solid fa-spinner fa-spin" style={{fontSize:"50px"}}></i></div>
    <h1>We are working on a wonderfull Dashboard for you</h1> 
    
    </div>
    
  </div> 
  )
}

export default UserDashboard