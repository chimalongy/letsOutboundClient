import React, { useState, useRef } from 'react'
import "../styles/Paginate.css"

function Paginate(props) {
    const activeclass = useRef()

    function addselectedindex() {
        activeclass.current.classList.add("activeindex")
    }
    // itemsPerPage={itemsPerPage} totalItemsCount={uOutbounds.length} paginate={paginate}
    const numberOfPages = Math.ceil(props.totalItemsCount / props.itemsPerPage)

    const pageNumbers = [];
    const [activePage, setActivePage] = useState(1)

    for (let i = 1; i <= numberOfPages; i++) {
        pageNumbers.push(i)
    }
    return (
        <div className='paginate'>
            <ul>
                {
                    pageNumbers.map((number) => (
                        <li ref={activeclass} key={number} onClick={() => { setActivePage(number); props.paginate(number); addselectedindex() }}>{number}</li>
                    ))
                }
            </ul>
        </div>
    )
}

export default Paginate