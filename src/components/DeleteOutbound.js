import React, { useState } from 'react'
import "../styles/DeleteOutbound.css"
import { useDispatch, useSelector } from 'react-redux';
import { setUserOutbounds } from '../modules/redux/userOutboundsSlice';
import { setUserTasks } from '../modules/redux/userTasksSlice';
import { setUserEmails } from '../modules/redux/userEmailsSlice';
import dataFetch from '../modules/dataFetch';
import useDataUpdater from '../modules/useDataUpdater';

function DeleteOutbound(props) {
    const port = "http://localhost:4000"
    const { refreshUserOutbounds } = useDataUpdater()
    const { refreshUserEmails } = useDataUpdater()
    const { refreshUserTasks } = useDataUpdater()
    const user = useSelector((state) => state.user.userData);
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const dispatch = useDispatch();
    return (
        <div className='form-holder delete-outbound'>
            {errorMessage && <div className='form-error-container'><p className='error'><i class="fa-solid fa-circle-exclamation"></i> {errorMessage}</p></div>}

            {
                props.value === "outbound" ? (
                    <>
                        <h2>Delete OutBound</h2>
                        <h4> Are you sure you want to delete this outbound?</h4>
                        <p>All tasks assigned to this outbound will be deleted forever</p>

                    </>
                ) : (
                    <>
                        <h2>Delete Email</h2>
                        <h4> Are you sure you want to delete this Email?</h4>
                        <p>All tasks associated with this email will be deleted forever</p>

                    </>
                )
            }

            <div className='button-controls'>
                <div><button onClick={() => { props.openModal(false) }}>Cancel</button></div>
                <div>
                    <button onClick={async () => {

                        if (!loading) {
                            if (props.value === "outbound") {
                                setLoading(true)
                                const outboundName = props.data.outboundName
                                let requestData = {
                                    ownerAccount: user.email,
                                    outboundName: outboundName
                                }

                                const url = port + '/deleteOutbound'

                                await dataFetch(url, requestData)
                                    .then((result) => {

                                        if (result.message === "outbond-deleted") {
                                            //Get Outbonds
                                            refreshUserOutbounds({ ownerAccount: user.email })
                                            refreshUserTasks({ ownerAccount: user.email })
                                            refreshUserEmails({ ownerAccount: user.email })
                                            setSuccessMessage("Outbound deleted")
                                            setLoading(false)

                                            props.openModal(false)


                                            // const newrequestData = {
                                            //     ownerAccount: user.email
                                            // }


                                            // let url = port + '/getuseroutbounds'
                                            // dataFetch(url, newrequestData)
                                            //     .then((result) => {
                                            //         const userOutbounds = result.data;
                                            //         if (result.message === "outbounds-found") {

                                            //             //Getting user Tasks
                                            //             const newrequestData = {
                                            //                 ownerAccount: user.email
                                            //             }
                                            //             let url = port + '/getusertasks'
                                            //             dataFetch(url, newrequestData)
                                            //                 .then((result) => {
                                            //                     const userTasks = result.data
                                            //                     dispatch(setUserOutbounds({
                                            //                         outbounds: userOutbounds
                                            //                     }))

                                            //                     dispatch(setUserTasks({
                                            //                         task: userTasks
                                            //                     }))


                                            //                 })
                                            //                 .catch((err) => { console.log(err) })

                                            //         }

                                            //  })
                                            // .catch((err) => { console.log(err) })


                                        }
                                        else {
                                            setLoading(false)
                                            setErrorMessage("An error occured.")
                                        }


                                    })
                                    .catch((err) => {
                                        setLoading(false)
                                        setErrorMessage(err)

                                    })

                            }
                            else {
                                setLoading(true)
                                let requestData = {
                                    ownerAccount: user.email,
                                    email: props.data
                                }
                                const url = port + '/deleteEmail'

                                await dataFetch(url, requestData)
                                    .then((result) => {

                                        if (result.message === "email-deleted") {
                                            refreshUserOutbounds({ ownerAccount: user.email })
                                            refreshUserTasks({ ownerAccount: user.email })
                                            refreshUserEmails({ ownerAccount: user.email })
                                            setSuccessMessage("Email deleted")
                                            setLoading(false)

                                            props.openModal(false)




                                            //Get user Emails
                                            // const requestData = {
                                            //     ownerAccount: user.email
                                            // }
                                            // let url = port + '/getuseroutboundemails'
                                            // dataFetch(url, requestData)
                                            //     .then((result) => {
                                            //         const userEmails = result.data;
                                            //         if (result.message === "emails-found") {
                                            //             dispatch(setUserEmails({
                                            //                 emails: userEmails
                                            //             }))

                                            //             props.openModal(false)
                                            //         }
                                            //     })
                                        }
                                        else {
                                            setLoading(false)
                                            setErrorMessage("An error occured.")
                                        }
                                    })
                                    .catch((err) => {
                                        setLoading(false)
                                        setErrorMessage(err)

                                    })
                            }

                        }


                    }}> {loading ? <i className="fa-solid fa-spinner fa-spin spinner"></i> : <p>Proceed</p>}</button>
                </div>
            </div>
        </div >

    )
}

export default DeleteOutbound