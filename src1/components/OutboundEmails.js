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

  let currentPage = 1
  const itemsPerPage = 10;
  let indexOfLastItem = currentPage * itemsPerPage
  let indexOfFirstItem = indexOfLastItem - itemsPerPage
  let [currentlist, setCurrentList] = useState(uEmails.slice(indexOfFirstItem, indexOfLastItem))

  const paginate = (pageNumber) => {
    currentPage = pageNumber
    indexOfLastItem = currentPage * itemsPerPage
    console.log("indexOfLastItem == " + indexOfLastItem)
    indexOfFirstItem = indexOfLastItem - itemsPerPage
    console.log("indexoffirstitem == " + indexOfFirstItem)
    setCurrentList(uEmails.slice(indexOfFirstItem, indexOfLastItem))
    console.log(currentlist)
    console.log(pageNumber)
  }

  

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


  const [searchquery, setsearchquery] = useState("")
  const [searching, setsearching] = useState(false)
  function searchEmails() {

    let result = uEmails.filter(email => { return email.emailAddress.includes(searchquery.toLocaleLowerCase()) })
    // console.log(result)
    setCurrentList(result)
  }

  function searchqueryChange(e) {
    setsearchquery(e.target.value)
    setsearching(true)
    searchEmails()

    if ((e.target.value == null) || (e.target.value = "")) {
      stopsearch()

    }
  }

  function stopsearch() {
    setCurrentList(uEmails.slice(indexOfFirstItem, indexOfLastItem))
    setsearching(false)
    setsearchquery("")
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
          <div className='search-container'>
            <input
              className='searchinput'
              type='text'
              value={searchquery}
              placeholder='...search'
              onChange={searchqueryChange}
            />
            {searching ? (<i class="fa-solid fa-circle-xmark search-button" onClick={stopsearch}></i>) : (<i class="fa-solid fa-magnifying-glass search-button" onClick={() => {
              setsearching(true)
              searchEmails()
            }}></i>)}
          </div>

          <ItemList data={currentlist} />


        </div>
        {searching ? (<></>) : (<Paginate itemsPerPage={itemsPerPage} totalItemsCount={uEmails.length} paginate={paginate} />)}
      </div>
      {showModal ? (<Modal header="Add Account" children={modalChildren} show={setShowModal}></Modal>) : (<></>)}
    </div>
  )
}

export default OutboundEmails