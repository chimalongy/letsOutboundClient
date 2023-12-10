import React, { useEffect, useState, useRef } from 'react'
import dataFetch from '../modules/dataFetch';
import Modal from './Modal';
import Paginate from './Paginate';
import { useDispatch, useSelector } from 'react-redux';
import AddScraping from './AddScraping';
import scrapingLogo from "../gifs/scrapingLogo.gif"
import scrapingComplete from "../gifs/scrapingComplete.png"
import "../styles/UserScraping.css"
import ShowScraping from './ShowScraping';
import useDataUpdater from '../modules/useDataUpdater';
import DeleteScraping from './DeleteScraping';


function UserScraping() {
    const port = "http://localhost:4000"
    const { refreshUserOutbounds } = useDataUpdater()
    const { refreshUserEmails } = useDataUpdater()
    const { refreshUserTasks } = useDataUpdater()
    const { refreshUserScraping } = useDataUpdater()
    const [showModal, setShowModal] = useState(false);
    const [modalChildren, setModalChildren] = useState(null);
    const user = useSelector((state) => state.user.userData);

    const uScrapings = useSelector((state) => state.userScrapings.userScrapings.scrapings);
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    let currentlist = uScrapings.slice(indexOfFirstItem, indexOfLastItem)
    const paginate = (pageNumber) => { setCurrentPage(pageNumber) }

    // useEffect(() => {
    //     refreshUserOutbounds({ ownerAccount: user.email })
    //     refreshUserTasks({ ownerAccount: user.email })
    //     refreshUserEmails({ ownerAccount: user.email })
    //     refreshUserScraping({ ownerAccount: user.email })
    // }, [])




    function GridList(props) {
        return (
            <div className='gridList'>
                <ul>
                    {
                        props.data.map((gridItem) => (
                            <li>
                                <div className='image-div'>{gridItem.completed == true ? (<img src={scrapingComplete} alt='scrapingcoplete' />) : (<img src={scrapingLogo} alt="still-scraping" />)}</div>
                                <div className='scrape-name'><p>{gridItem.scrapeName}</p></div>
                                <div className='scrape-controls'>
                                    <button className='site-button-thin delete' onClick={() => {
                                        setModalChildren(<DeleteScraping data={gridItem} openModal={setShowModal} />)
                                        setShowModal(true);
                                    }}><i class="fa-solid fa-trash"></i></button>
                                    <button className='site-button-thin ' onClick={() => {
                                        setModalChildren(<ShowScraping data={gridItem.scrapeResults} openModal={setShowModal} />)
                                        setShowModal(true);
                                    }} disabled={gridItem.completed == true ? false : true} ><i class="fa-solid fa-eye"></i></button>
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
            <h1>Out Bounds</h1>
          </div> */}

            <div className='tab-content-container-contents'>
                <div className='email-display-options'>

                    <div className='add-Email' onClick={() => {
                        setModalChildren(<AddScraping openModal={setShowModal} />)
                        setShowModal(true);

                    }}>
                        <p>+</p>
                        <p>New Scraping</p>
                    </div>

                    <div className='email-data'>
                        <h3>Scraping Data</h3>
                        <div>
                            <p><b>Scrapings:</b> {uScrapings.length}</p>
                        </div>
                    </div>


                </div>

                <div className='email-table'>

                    <GridList data={currentlist} />

                </div>
                <Paginate itemsPerPage={itemsPerPage} totalItemsCount={uScrapings.length} paginate={paginate} />
            </div>
            {showModal ? (<Modal header="Add Account" children={modalChildren} show={setShowModal}></Modal>) : (<></>)}
        </div>
    )
}

export default UserScraping