import React from 'react'
import "../styles/Modal.css"

function Modal({ show, children, header }) {


  return (
    <div className='modal-box'>

      <div className='modal-box-header'>

        <i className="fa-solid fa-circle-xmark modal-icon" onClick={() => {
          show(false);
        }}></i>

      </div>

      <div className='modal-body'> {children}</div>
    </div>
  )
}

export default Modal