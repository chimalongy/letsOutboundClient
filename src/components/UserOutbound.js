import React, { useState } from 'react'
import Modal from './Modal';
import AddOutbound from './AddOutbound.js';
import dataFetch from '../modules/dataFetch';
import { useDispatch, useSelector } from 'react-redux';


import Paginate from './Paginate';
import Task from './Task';
import ShowTasks from './ShowTasks';
import DeleteOutbound from './DeleteOutbound';
import RemoveEmails from './RemoveEmails';

function UserOutbound() {
  const [showModal, setShowModal] = useState(false);
  const [modalChildren, setModalChildren] = useState(null);

  const user = useSelector((state) => state.user.userData);
  const uOutbounds = useSelector((state) => state.userOutbounds.userOutbounds.outbounds);
  const uTasks = useSelector((state) => state.userTasks.userTasks.task);


  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(3)
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
                <p>{outbound.outboundName}</p>
                <div>
                  <i className="fa-solid fa-circle-plus item-icon add" title='add task' onClick={
                    () => {

                      setModalChildren(<Task
                        data={outbound}
 
                        openModal={setShowModal} />)
                      setShowModal(true);
                    }}
                  ></i>

                  <i class="fa-solid fa-reply-all" title='remove from email list' onClick={()=>{
                    setModalChildren(<RemoveEmails
                      data={outbound}

                      openModal={setShowModal} />)
                    setShowModal(true);
                  }}></i>

                  <i className="fa-solid fa-clipboard-list item-icon list" title='task list' onClick={
                    () => {
                      console.log(uTasks)
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
              </li>
            ))
          }
        </ul>

      </div>
    )
  }

  return (
    <div className='tab-content-container'>
      <div className='tab-content-container-header'>
        <h1>Out Bounds</h1>
      </div>

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
          {/* 
           <div className='email-stats'>
          <h3>Outbound Stats</h3>
           <div>
            <p><b>This Week:</b> {0}</p>
            <p><b>This Month</b> {0}</p>
          </div>
        </div> */}

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