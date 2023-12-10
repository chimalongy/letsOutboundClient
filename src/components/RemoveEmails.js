import React, { useState } from 'react'
import dataFetch from '../modules/dataFetch';
import useDataUpdater from "../modules/useDataUpdater"
import { useDispatch, useSelector } from 'react-redux';


function RemoveEmails(props) {
    const port = "http://localhost:4000"
    const { refreshUserOutbounds } = useDataUpdater()
    const { refreshUserEmails } = useDataUpdater()
    const { refreshUserTasks } = useDataUpdater()
    const [text, setText] = useState('');
    const [validationResults, setValidationResults] = useState([]);
    const [error, setErrorr] = useState("")
    const [listConfirmed, setlistConfirmed] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)
    const user = useSelector((state) => state.user.userData);

    const handleTextareaChange = (e) => {
        const newText = e.target.value;
        setText(newText);
    };

    const validateEmails = () => {
        const deleteList = text.split('\n');
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


        for (let i = 0; i < deleteList.length; i++) {
            if (!emailRegex.test(deleteList[i])) { return false }
        }

        return true
    };

    return (
        <div className='form-holder'>
            <h2>Remove Emails from this Outbound</h2>

            {listConfirmed ? (
                <div className='button-controls'>
                    <div><button onClick={() => {
                        props.openModal(false)
                    }}>Cancel</button></div>
                    <div><button onClick={async () => {
                        setLoadingDelete(true)
                        const requestData = {
                            emailsToDelete: text.split("\n"),
                            outboundName: props.data.outboundName

                        }
                        const url = port + "/deleteOutboundEmail"
                        const result = await dataFetch(url, requestData)
                        if (result.message == "deleted") {
                            //PERFORM TASK HERE
                            refreshUserOutbounds({ ownerAccount: user.email })
                            refreshUserTasks({ ownerAccount: user.email })
                            refreshUserEmails({ ownerAccount: user.email })
                            props.openModal(false)
                        }
                        else {
                            setLoadingDelete(false)
                            setErrorr("An error Occured.")
                        }
                    }}> {loadingDelete ? <i class="fa-solid fa-spinner fa-spin"></i> : "Proceed"}</button></div>
                </div>
            )

                : (
                    <div>
                        {error && <div className='form-error-container'><p className='error'><i class="fa-solid fa-circle-exclamation"></i> {error}</p></div>}

                        <p>Insert Emails you want to delete</p>
                        <textarea
                            value={text}
                            onChange={handleTextareaChange}
                            placeholder="Enter emails, one per line"
                            rows={5}
                            cols={40}
                        />

                        <button className='site-button-thin' onClick={() => {
                            if (validateEmails()) {
                                setErrorr('')
                                setlistConfirmed(true)
                            }
                            else {
                                setErrorr('Invalid email list')
                            }
                        }}>Confirm</button>


                    </div>)}

        </div>
    )
}

export default RemoveEmails