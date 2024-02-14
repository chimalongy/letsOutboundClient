import React from 'react'
import "../styles/Logo.css"
function Logo() {
    return (
        <div className='logo'>
            <div className='logo-circle'><i class="fa-solid fa-envelopes-bulk logo-icon"></i> </div>
            <div><h1 className='logo-text'><span>Lets</span>Outbound</h1></div>
        </div>
    )
}

export default Logo