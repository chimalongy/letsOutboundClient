import React, { useEffect, useState, useRef } from 'react'
import "../styles/OutboundEmails.css"
import Modal from './Modal'
import AddNewEmail from './AddNewEmail';
import dataFetch from '../modules/dataFetch';
import { useDispatch, useSelector } from 'react-redux';
import Paginate from './Paginate';
import DeleteOutbound from './DeleteOutbound';
import EditEmail from './EditEmail';

function OutboundEmails(props) {
  const [showModal, setShowModal] = useState(false);
  /// let[ emailList, setEmailList]= useState(props.userEmail)
  const [modalChildren, setModalChildren] = useState(null)
  const user = useSelector((state) => state.user.userData);
  const uEmails = useSelector((state) => state.userEmails.userEmails.emails);

  let TotalCapacity = 0;
  uEmails.forEach(email => {
    if (email.primaryEmail == true) {
      TotalCapacity += email.dailySendingCapacity
    }
  });

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  let currentlist = uEmails.slice(indexOfFirstItem, indexOfLastItem)
  const paginate = (pageNumber) => { setCurrentPage(pageNumber) }


  function ItemList(props) {
    return (
      <div className='itemList'>
        <ul>
          {
            currentlist.map((email, index) => (
              <li key={index}>

                <div className='item-value'>
                  {/* {email.primaryEmail==false?(<i class="fa-solid fa-share-from-square" title={`sending from: ${email.parentEmail}`}></i>):(<></>)} */}
                  <p>{email.emailAddress} </p>
                  {email.primaryEmail == false ? (<div className='parent-detail'>{` ${email.parentEmail}`}</div>) : (<></>)}
 
                </div>


                <div className='item-controls'>
                  <i class="fa-regular fa-pen-to-square" onClick={() => {
                    setModalChildren(<EditEmail data={email} openModal={setShowModal} value="emails" />)
                    setShowModal(true);
                  }} ></i>
                  <p><i class="fa-solid fa-battery-full add"></i> {email.dailySendingCapacity}</p>
                  <i class="fa-solid fa-trash delete" onClick={() => {
                    setModalChildren(<DeleteOutbound data={email} openModal={setShowModal} value="emails" />)
                    setShowModal(true);
                  }}></i>


                </div>
              </li>
            ))
          }
        </ul>

      </div>
    )
  }









  return (
    <div className='tab-content-container'>
      {/* <div className='tab-content-container-header'>
        <h1>Emails</h1>
      </div> */}

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
              <p><b>Email Count:</b> {uEmails.length}</p>
              <p><b>Total Capacity:</b> {TotalCapacity}</p>
              {/* <p><b>Disabled Emails:</b> {0}</p> */}
            </div>
          </div>

          {/* <div className='email-stats'>
            <h3>Email Stats</h3>
            <div>
              <p><b>This Week:</b> {0}</p>
              <p><b>This Month</b> {0}</p>
            </div>
          </div> */}

        </div>

        <div className='email-table'>
          <ItemList data={currentlist} />


        </div>
        <Paginate itemsPerPage={itemsPerPage} totalItemsCount={uEmails.length} paginate={paginate} />
      </div>
      {showModal ? (<Modal header="Add Account" children={modalChildren} show={setShowModal}></Modal>) : (<></>)}
    </div>
  )
}

export default OutboundEmails