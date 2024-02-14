import React, { useState } from 'react'
import dataFetch from '../modules/dataFetch';
import useDataUpdater from "../modules/useDataUpdater"
import { useDispatch, useSelector } from 'react-redux';


function DeleteScraping(props) {
    const port = ""
    const { refreshUserOutbounds } = useDataUpdater()
    const { refreshUserEmails } = useDataUpdater()
    const { refreshUserTasks } = useDataUpdater()
    const { refreshUserScraping } = useDataUpdater()
    const [text, setText] = useState('');
    const [validationResults, setValidationResults] = useState([]);
    const [error, setErrorr] = useState("")

    const [loadingDelete, setLoadingDelete] = useState(false)
    const user = useSelector((state) => state.user.userData);



    return (
        <div className='form-holder'>
            <h2>Delete this Scraping</h2>
            {error && <div className='form-error-container'><p className='error'><i class="fa-solid fa-circle-exclamation"></i> {error}</p></div>}

            <h4> Are you sure you want to delete this Scraping?</h4>
            <p>All leads associated with this scraping will be deleted forever</p>


            <div className='button-controls'>
                <div><button onClick={() => {
                    props.openModal(false)
                }}>Cancel</button></div>
                <div><button onClick={async () => {
                    setLoadingDelete(true)
                    const requestData = {
                        ownerAccount: user.email,
                        scrapingToDelete: props.data.scrapeName,
                    }
                    const url = port + "/deletescraping"
                    const result = await dataFetch(url, requestData)
                    if (result.message == "scraping-deleted") {
                        //PERFORM TASK HERE
                        refreshUserOutbounds({ ownerAccount: user.email })
                        refreshUserTasks({ ownerAccount: user.email })
                        refreshUserEmails({ ownerAccount: user.email })
                        refreshUserScraping({ ownerAccount: user.email })
                        props.openModal(false)
                    }
                    else {
                        setLoadingDelete(false)
                        setErrorr("An error Occured.")
                    }
                }}> {loadingDelete ? <i class="fa-solid fa-spinner fa-spin"></i> : "Proceed"}</button></div>
            </div>




        </div>
    )
}

export default DeleteScraping