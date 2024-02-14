import UserDashboard from '../components/UserDashboard';
import OutboundEmails from '../components/OutboundEmails';
import UserOutbound from '../components/UserOutbound';

import DashboardMenu from '../components/DashboardMenu';
import UserEmails from '../components/UserEmails';
import React, { useState, useRef, useEffect } from 'react';
import "../styles/Dashboard.css"
import dataFetch from '../modules/dataFetch';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import UserScraping from '../components/UserScraping';
function Dashboard(props) {
  const [tabHeader, setTabHeader] = useState(null);
  const [tabContent, setTabContent] = useState();
  const dashboardRef = useRef();
  const emailRef = useRef();
  const outboundRef = useRef();
  const ScrapRef = useRef();
  
  const [UserEmails, setUserEmails] = useState([])
  const [loggedUser, setLoggedUser] = useState()
  const user = useSelector((state) => state.user.userData);
  const uEmails = useSelector((state) => state.userEmails.userEmails.emails);

  const navmove= useNavigate()

  useEffect(() => {
    dashboardRef.current.click();
    const User = localStorage.getItem("OutBoundUserData")
    setLoggedUser(localStorage.getItem(User))

  }, [])

  const removeActive = () => {
    dashboardRef.current.classList.remove("active");
    emailRef.current.classList.remove("active");
    outboundRef.current.classList.remove("active");
    ScrapRef.current.classList.remove("active");
  }

  function setDashboardClick(){
    setTabContent(<UserDashboard/>);removeActive(); dashboardRef.current.classList.add("active");
  }

  function setEmailClick(){
    setTabContent(<OutboundEmails />); removeActive();  emailRef.current.classList.add("active");
  }

  function setOutboundClick(){
    setTabContent(<UserOutbound/>); removeActive(); outboundRef.current.classList.add("active");
  }
  function setScrapClick(){
    //  setTabContent(<UserScraping/>); removeActive(); ScrapRef.current.classList.add("active");
  }

  


  return (

    <div className='dash-board-container'>
      <div className='dashboard-sidebar'>
        <DashboardMenu setDashboardClick={setDashboardClick} setEmailClick={setEmailClick} setOutboundClick={setOutboundClick} setScrapClick={setScrapClick} dashboardRef={dashboardRef} emailRef={emailRef} outboundRef={outboundRef}  ScrapRef={ScrapRef}/>
      </div>
      <div className='dashboard-content-container'>

        {tabContent}

       
      </div>

    </div>
  )
}

export default Dashboard