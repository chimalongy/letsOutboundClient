import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import "../styles/DashboardMenu.css"

function DashboardMenu(props) {
  const [showDashBoardMenu, setShowDashBoardMenu] = useState(false)
  let menuItems = useRef();
  let navmove =useNavigate()

  useEffect(()=>{
    setShowDashBoardMenu(true)
  },[])

  function toggleDashBoard() {
    setShowDashBoardMenu(!showDashBoardMenu);
  }

  function showmenuitems() {
    menuItems.current.classList = "";
    menuItems.current.classList.add("showmenuitems")
  }
  function hidemenuitems() {
    menuItems.current.classList = "";
    menuItems.current.classList.add("hidemenuitems")
  }
  return (<>
    <div className='dashboard-Menu'>
      <ul ref={menuItems}>
        <li ref={props.dashboardRef} onClick={() => {
          props.setDashboardClick();
          hidemenuitems()
          toggleDashBoard();

        }}><i className="fa-solid fa-gauge-high tab-icon"></i> Dashboard</li>
        <li ref={props.emailRef} onClick={() => {
          props.setEmailClick()
          hidemenuitems()
          toggleDashBoard();
        }}> <i className="fa-solid fa-envelope tab-icon"></i> Emails</li>
        <li ref={props.outboundRef} onClick={() => {
          props.setOutboundClick()
          hidemenuitems()
          toggleDashBoard();
        }}><i className="fa-regular fa-paper-plane tab-icon"></i> Outbound</li>
        <li ref={props.ScrapRef} onClick={() => {
          props.setScrapClick()
          hidemenuitems()
          toggleDashBoard();
        }}><i className="fa-solid fa-book-open-reader tab-icon"></i> Scrap</li>


        <li className='logout-button'  onClick={() => {
          localStorage.removeItem("persist:userTasks")
          localStorage.removeItem("persist:userEmails")
          localStorage.removeItem("persist:userOutbounds")
          localStorage.removeItem("persist:userData")
          localStorage.removeItem("token")
          navmove("/login")

          
        }}><i class="fa-solid fa-right-from-bracket"></i> Log Out</li>
      </ul>

     


      <div className='dashboard-menu-bar'>
        {showDashBoardMenu ? (<i class="fa-solid fa-circle-chevron-up dashboard-menu-icon" onClick={() => {

          hidemenuitems()
          toggleDashBoard();

          }}></i>)
          :
          (<i class="fa-solid fa-circle-chevron-down dashboard-menu-icon" onClick={() => {
            showmenuitems()
            toggleDashBoard()
          }}></i>)

        }

       


      </div>
    </div>
  </>)
}

export default DashboardMenu