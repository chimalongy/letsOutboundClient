import React, { useState } from 'react'
import Modal from './Modal';
import AddOutbound from './AddOutbound.js';
import "../styles/UserOutbound.css"
import dataFetch from '../modules/dataFetch';
import { useDispatch, useSelector } from 'react-redux';


import Paginate from './Paginate';
import Task from './Task';
import ShowTasks from './ShowTasks';
import DeleteOutbound from './DeleteOutbound';
import RemoveEmails from './RemoveEmails';
import SendSingle from './SendSingle.js';


function UserOutbound() {
  const [showModal, setShowModal] = useState(false);
  const [modalChildren, setModalChildren] = useState(null);

  const user = useSelector((state) => state.user.userData);
  const uOutbounds = useSelector((state) => state.userOutbounds.userOutbounds.outbounds);
  const uTasks = useSelector((state) => state.userTasks.userTasks.task);


  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  let currentlist = uOutbounds.slice(indexOfFirstItem, indexOfLastItem)
  const paginate = (pageNumber) => { setCurrentPage(pageNumber) }

  function ItemList(props) {
    return (
      <div className='itemList'>

        <ul>
          {
            props.data.map((outbound, index) => (
              <li key={index}>

                <div className='item-value'>
                  <p>{outbound.outboundName}</p>
                </div>
                <div className='item-controls'>
                  <i className="fa-solid fa-circle-plus item-icon add" title='add task' onClick={
                    () => {

                      setModalChildren(<Task
                        data={outbound}

                        openModal={setShowModal} />)
                      setShowModal(true);
                    }}
                  ></i>

                  <i class="fa-solid fa-reply-all" title='remove from email list' onClick={() => {
                    setModalChildren(<RemoveEmails
                      data={outbound}

                      openModal={setShowModal} />)
                    setShowModal(true);
                  }}></i>

                  <i className="fa-solid fa-clipboard-list item-icon list" title='task list' onClick={
                    () => {

                      let outboundTasks = uTasks.filter(task => task.outboundName === outbound.outboundName)
                      setModalChildren(<ShowTasks data={outboundTasks} openModal={setShowModal} />)
                      setShowModal(true);
                    }
                  }></i>
                  <i className="fa-solid fa-trash item-icon delete" title='delete' onClick={
                    () => {
                      setModalChildren(<DeleteOutbound data={outbound} openModal={setShowModal} value="outbound" />)
                      setShowModal(true);
                    }
                  } ></i>
                </div>
                <details className='outbound-details'>
                  <summary className='outbound-detail-summary'>See more </summary>
                  <div className='outbound-email-details'>
                    <div className='outbound-allocated-email'><b>Allocated Emails</b></div>
                    <div className='outbound-allocated-email-capacity'><b>Alloc.</b></div>
                  </div>
                  <div>
                    {outbound.emailList.map((item, index) => (
                      <div key={index} className='outbound-email-details'>

                        <div className='outbound-allocated-email'>{item.allocatedEmail !== item.sendingFrom ? (<p>{item.allocatedEmail}<br /><b>{item.sendingFrom}</b></p>) : (<p>{item.allocatedEmail}</p>)}</div>
                        <div className='outbound-allocated-email-capacity'><b>{item.emailAllocations.length}</b></div>
                        <div></div>
                      </div>
                    ))}
                  </div>


                </details>

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
        <h1>Out Bounds</h1>
      </div> */}

      <div className='tab-content-container-contents'>
        <div className='email-display-options'>

          <div className='add-Email' onClick={() => {
            setModalChildren(<AddOutbound openModal={setShowModal} />)
            setShowModal(true);

          }}>
            <p>+</p>
            <p>New Outbound</p>
          </div>

          <div className='email-data'>
            <h3>Outbound Data</h3>
            <div>
              <p><b>Outbounds:</b> {uOutbounds.length}</p>

            </div>
          </div>

          <div className='add-Email' onClick={() => {
            setModalChildren(<SendSingle openModal={setShowModal} />)
            setShowModal(true);

          }}>
            <i class="fa-solid fa-envelope-open-text"></i>
            <p>Single Email</p>
          </div>

        </div>

        <div className='email-table'>

          <ItemList data={currentlist} />

        </div>
        <Paginate itemsPerPage={itemsPerPage} totalItemsCount={uOutbounds.length} paginate={paginate} />
      </div>
      {showModal ? (<Modal header="Add Account" children={modalChildren} show={setShowModal}></Modal>) : (<></>)}
    </div>
  )
}

export default UserOutbound