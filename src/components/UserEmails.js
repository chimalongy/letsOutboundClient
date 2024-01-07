//   THIS CODE IS NO LONGER USED CHECK OUTBOUND EMAILS.JS



import React, { useEffect, useState, useRef } from 'react'
import "../styles/UserEmails.css"
import Modal from './Modal'
import AddNewEmail from './AddNewEmail';
import dataFetch from '../modules/dataFetch';

function UserEmails() {
  const port = ""
  const [showModal, setShowModal] = useState(false);
  const [modalChildren, setModalChildren] = useState(null)
  const [loggedUser, setLoggedUser] = useState({})
  const [UserEmails, setUserEmails] = useState([])
  const [showEmails, setShowEmails] = useState(false)
  const showbutton = useRef()

  useEffect(() => {
    const User = localStorage.getItem("OutBoundUserData")
    setLoggedUser(JSON.parse(User))
    getUserEmails()


  }, [])



  function getUserEmails() {

    const requestData = {
      ownerAccount: loggedUser.email
    }
    const url = port + '/getuseroutboundemails'
    dataFetch(url, requestData)
      .then(result => setUserEmails(result.data))
      .catch(error => console.log(error))


    // console.log(result.data)

  }




  function EmailContent({ userEmail }) {
    getUserEmails()
    return (
      <div className='email-content'>
        <div className='left'>
          <div className='top'>
            <h4>{userEmail.emailAddress}</h4>
          </div>
          <div className='buttom'>
            <p><b>Sending Name:</b>{userEmail.senderName}</p>
            <p><strong>Daily Capacity:</strong>{userEmail.dailySendingCapacity}</p>
          </div>
        </div>
        <div className='right'><i className="fa-solid fa-trash-can"></i></div>
      </div>
    )
  }

  return (
    <div className='tab-content-container'>
      <div className='tab-content-container-header'>
        <h1>Emails</h1>
      </div>

      <div className='tab-content-container-contents'>
        <div className='email-display-options'>

          <div className='add-Email' onClick={() => {
            setModalChildren(<AddNewEmail openModal={setShowModal} />)
            setShowModal(true);

          }}>
            <p>+</p>
            <p>Add New Email</p>
          </div>

          <div className='email-data'>
            <h3>Email Data</h3>
            <div>
              <p><b>Email Count:</b> {0}</p>
              <p><b>Total Capacity:</b> {0}</p>
              <p><b>Disabled Emails:</b> {0}</p>
            </div>
          </div>

          <div className='email-stats'>
            <h3>Email Stats</h3>
            <div>
              <p><b>This Week:</b> {0}</p>
              <p><b>This Month</b> {0}</p>
            </div>
          </div>

        </div>

        <div className='email-table'>
          <button onClick={() => {
            getUserEmails()
          }}>Hello</button>
          <div>
            {
              UserEmails && UserEmails.map((userEmail) => (
                <EmailContent key={userEmail._id} userEmail={userEmail} />
              ))



            }
          </div>
        </div>
      </div>
      {showModal ? (<Modal header="Add Account" children={modalChildren} show={setShowModal}></Modal>) : (<></>)}
    </div>
  )
}

export default UserEmails