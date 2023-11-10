import React, { useState } from 'react'
import "../styles/Paginate.css"

function Paginate(props) {

    // itemsPerPage={itemsPerPage} totalItemsCount={uOutbounds.length} paginate={paginate}
    const numberOfPages = Math.ceil(props.totalItemsCount / props.itemsPerPage)
    
    const pageNumbers = [];
    const [activePage, setActivePage]= useState(1) 

    for (let i = 1; i <= numberOfPages; i++) {
        pageNumbers.push(i)
    }
    return (
        <div className='paginate'>
            <ul>
                {
                    pageNumbers.map((number) => (
                        <li key={number} onClick={()=>{setActivePage(number); props.paginate(number); console.log(numberOfPages)}}>{number}</li>
                    ))
                }
            </ul>
        </div>
    )
}

export default Paginate