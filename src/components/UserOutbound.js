import React, { useState, useEffect } from 'react'
import Modal from './Modal';
import AddOutbound from './AddOutbound.js';
import "../styles/UserOutbound.css"
import dataFetch from '../modules/dataFetch';
import { useDispatch, useSelector } from 'react-redux';
import useDataUpdater from '../modules/useDataUpdater';




import Paginate from './Paginate';
import Task from './Task';
import ShowTasks from './ShowTasks';
import DeleteOutbound from './DeleteOutbound';
import RemoveEmails from './RemoveEmails';
import SendSingle from './SendSingle.js';



function UserOutbound() {
  const port = ""
  const [showModal, setShowModal] = useState(false);
  const [modalChildren, setModalChildren] = useState(null);

  const user = useSelector((state) => state.user.userData);
  const uEmails = useSelector((state) => state.userEmails.userEmails.emails);
  const uOutbounds = useSelector((state) => state.userOutbounds.userOutbounds.outbounds);
  const uTasks = useSelector((state) => state.userTasks.userTasks.task);

  useEffect(() => {
    setCurrentList(uOutbounds.slice(indexOfFirstItem, indexOfLastItem))
  }, [uOutbounds])



  // ==================================================
  let currentPage = 1
  const itemsPerPage = 10;
  let indexOfLastItem = currentPage * itemsPerPage
  let indexOfFirstItem = indexOfLastItem - itemsPerPage
  let [currentlist, setCurrentList] = useState(uOutbounds.slice(indexOfFirstItem, indexOfLastItem))
  const paginate = (pageNumber) => {
    currentPage = pageNumber
    indexOfLastItem = currentPage * itemsPerPage
    indexOfFirstItem = indexOfLastItem - itemsPerPage
    setCurrentList(uOutbounds.slice(indexOfFirstItem, indexOfLastItem))

  }
  const [searchquery, setsearchquery] = useState("")
  const [searching, setsearching] = useState(false)
  function searchOutbounds() {

    let result = uOutbounds.filter(outbound => { return outbound.outboundName.toLocaleLowerCase().includes(searchquery.toLocaleLowerCase()) })
    // console.log(result)
    setCurrentList(result)
  }

  function searchqueryChange(e) {
    setsearchquery(e.target.value)
    setsearching(true)
    searchOutbounds()

    if ((e.target.value == null) || (e.target.value = "")) {
      stopsearch()

    }
  }

  function stopsearch() {
    setCurrentList(uOutbounds.slice(indexOfFirstItem, indexOfLastItem))
    setsearching(false)
    setsearchquery("")
  }


  function getPreviousSubject(OutboundName) {
    let taskList = uTasks.filter(task => task.outboundName == OutboundName)

    let previousTask = taskList[taskList.length - 1]

    return previousTask.taskSubject
  }

  function getuseroutboundemails(outbound) {// NOT USED
    const result = []

    console.log('THE OUTBOUND IS ', outbound)
    // console.log('UEMAILS', uEmails)
    let i = 0


    for (const item of outbound.emailList) {
      if (item.allocatedEmail == item.sendingFrom) {

        const Email = uEmails.filter((email) => { return email.emailAddress = item.allocatedEmail })
        const previousSubject = getPreviousSubject(outbound.outboundName)
        result.push(
          {
            emailAddress: Email[0].emailAddress,
            password: Email[0].password,
            outboundName: outbound.outboundName,
            previousSubject: previousSubject
          }
        )
      }
      else {
        const Email = uEmails.filter((email) => { return (email.emailAddress = item.allocatedEmail) && (email.parentEmail = item.sendingFrom) })
        const previousSubject = getPreviousSubject(outbound.outboundName)
        result.push(
          {
            emailAddress: Email[0].parentEmail,
            password: Email[0].password,
            outboundName: outbound.outboundName,
            previousSubject: previousSubject
          }
        )
      }
    }



    return result
  }


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


                  {/* <i className="fa-solid fa-comments" title='replies' onClick={
                    async () => {
                      const url = port + "/getReplies"

                      let request = {

                      }
                      const response = await dataFetch(url, request)
                    }
                  } ></i> */}
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
              searchOutbounds()
            }}></i>)}
          </div>

          <ItemList data={currentlist} />

        </div>


        {searching ? (<></>) : (<Paginate itemsPerPage={itemsPerPage} totalItemsCount={uOutbounds.length} paginate={paginate} />)}
      </div>
      {showModal ? (<Modal header="Add Account" children={modalChildren} show={setShowModal}></Modal>) : (<></>)}
    </div>
  )
}

export default UserOutbound