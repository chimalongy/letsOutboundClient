import React, { useState, useEffect, useRef } from 'react'
import "../styles/Dashboard.css"
import dataFetch from '../modules/dataFetch';
import axios from "axios"

import UserDashboard from '../components/UserDashboard';
import OutboundEmails from '../components/OutboundEmails';
import UserOutbound from '../components/UserOutbound';
import UserHome from '../components/UserHome';
import UserScraping from "../components/UserScraping"
import { useDispatch, useSelector } from 'react-redux';


function Dashboard() {
    useEffect(() => {
        UDashboard.current.click()
    }, [])

    const user = useSelector((state) => state.user.userData);
    const [brightTheme, setBrightTheme] = useState(true)
    const [tabContent, setTabContent] = useState()
    const [tabTittle, setTabTittle] = useState("")
    const [tabDescription, setTabDescription] = useState("")
    const [showSideBarMenu, setShowSideBarMenu] = useState(false)






    function removeActive() {
        UDashboard.current.classList.remove("active")
        UEmails.current.classList.remove("active")
        UOutbound.current.classList.remove("active")
        UScraping.current.classList.remove("active")
        // UTransactions.current.classList.remove("active")
        // USettings.current.classList.remove("active")
    }

    const UDashboard = useRef();
    const UEmails = useRef();
    const UOutbound = useRef();
    const UScraping = useRef();
    const sidebarmenu = useRef();
    // const UTransactions = useRef();
    // const USettings = useRef();


    function closeSideBarMenu() {
        setShowSideBarMenu(false)
        sidebarmenu.current.classList.remove('side-bar-menu-mobile');
    }
    function openSideBarMenu() {
        setShowSideBarMenu(true)
        sidebarmenu.current.classList.add('side-bar-menu-mobile');
    }

    // function toggleSideBarMenu() {
    //     setShowSideBarMenu(!showSideBarMenu)

    //     // if (!showSideBarMenu) { sidebarmenu.current.classList.remove('side-bar-menu-mobile'); }
    //     // else { sidebarmenu.current.classList.add('side-bar-menu-mobile'); }

    //     if (showSideBarMenu) { sidebarmenu.current.classList.add('side-bar-menu-mobile'); }
    //     else { sidebarmenu.current.classList.remove('side-bar-menu-mobile'); }

    // }

    function switchTheme() {
        setBrightTheme(!brightTheme)
    }
    return (
        <div className='dashboard-tab'>
            <div className='dashboard-left'>
                <div>
                    {showSideBarMenu ? (<i class="fa-regular fa-rectangle-xmark side-bar-handbuger" onClick={() => { closeSideBarMenu() }}></i>) : (<i class="fa-solid fa-list side-bar-handbuger" onClick={() => { openSideBarMenu() }}></i>)}
                </div>


                <ul className='side-bar-menu' ref={sidebarmenu}  >
                    <li ref={UDashboard} onClick={() => {
                        setTabContent(<UserHome />)
                        setTabTittle("Dashboard")
                        setTabDescription("Welcome to your dashboard, " + user.firstName)
                        removeActive();
                        UDashboard.current.classList.add("active")
                        closeSideBarMenu()
                    }}>
                        <p> <i class="fa-solid fa-house"></i> Dashboard</p>
                    </li>
                    <li ref={UEmails} onClick={() => {
                        setTabContent(<OutboundEmails />)
                        setTabTittle("Emails")
                        setTabDescription("See all your emails in one page")
                        removeActive();
                        UEmails.current.classList.add("active")
                        closeSideBarMenu()
                    }}>
                        <p><i class="fa-regular fa-envelope"></i> Emails</p>
                    </li>
                    <li ref={UOutbound} onClick={() => {
                        setTabContent(<UserOutbound />)
                        setTabTittle("Outbounds")
                        setTabDescription("Create outbounds and schedule tasks")
                        removeActive();
                        UOutbound.current.classList.add("active")
                        closeSideBarMenu()
                    }}>
                        <p> <i class="fa-regular fa-paper-plane"></i> Outbounds</p>

                    </li>
                    <li ref={UScraping} onClick={() => {
                        setTabContent(<UserScraping />)
                        setTabTittle("Scrapings")
                        setTabDescription("Scrap Emails from links")
                        removeActive();
                        UScraping.current.classList.add("active")
                        closeSideBarMenu()
                    }}>
                        <p> <i class="fa-regular fa-paper-plane"></i> Scraping</p>

                    </li>








                    <li className='logout-button' onClick={() => {
                        localStorage.removeItem("persist:userTasks")
                        localStorage.removeItem("persist:userEmails")
                        localStorage.removeItem("persist:userOutbounds")
                        localStorage.removeItem("persist:userData")
                        localStorage.removeItem("token")
                        window.location.assign("/login")


                    }}><i class="fa-solid fa-right-from-bracket"></i> Log Out</li>

                </ul>


            </div>
            <div className='dashboard-right'>
                <div className='dash-board-right-top'>
                    <div className='dashboard-controls'>
                        {/* <div className='theme-selector'>
                            {brightTheme ? (<i class="fa-solid fa-sun dashboard-small-icon" onClick={() => { switchTheme() }}></i>) : (<i className="fa-solid fa-moon dashboard-small-icon" onClick={() => { switchTheme() }}></i>)}
                        </div> */}
                        {/* <i class="fa-solid fa-bell dashboard-small-icon"></i> */}
                        {/* <i class="fa-solid fa-gear dashboard-small-icon"></i>
                        <i class="fa-solid fa-user dashboard-small-icon"></i> */}
                    </div>

                    <div className='dashboard-title'>
                        <h1>{tabTittle}</h1>
                        <p>{tabDescription}</p>
                    </div>
                </div>

                <div className='dashboard-content'>

                    {tabContent}

                </div>
            </div>



        </div>
    )
}

export default Dashboard