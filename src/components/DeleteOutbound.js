import React from 'react'
import "../styles/DeleteOutbound.css"
import { useDispatch, useSelector } from 'react-redux';
import { setUserOutbounds } from '../modules/redux/userOutboundsSlice';
import { setUserTasks } from '../modules/redux/userTasksSlice';
import { setUserEmails } from '../modules/redux/userEmailsSlice';
import dataFetch from '../modules/dataFetch';

function DeleteOutbound(props) {
    const port="http://localhost:4000"
    const user = useSelector((state) => state.user.userData);
    
    const dispatch = useDispatch();
    return (
        <div className='form-holder delete-outbound'>
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
                        
                        if (props.value==="outbound"){
                            const outboundName = props.data.outboundName
                        let requestData = {
                            ownerAccount: user.email,
                            outboundName: outboundName
                        }

                        const url =  port +'/deleteOutbound'

                        await dataFetch(url, requestData)
                            .then((result) => {
                                
                                if (result.message === "outbond-deleted") {
                                    //Get Outbonds
                                   
                                    const newrequestData = {
                                        ownerAccount: user.email
                                    }


                                    let url = port+'/getuseroutbounds'
                                    dataFetch(url, newrequestData)
                                        .then((result) => {
                                            const userOutbounds = result.data;
                                            if (result.message === "outbounds-found") {

                                                //Getting user Tasks
                                                const newrequestData = {
                                                    ownerAccount: user.email
                                                }
                                                let url = port+'/getusertasks'
                                                dataFetch(url, newrequestData)
                                                    .then((result) => {
                                                        const userTasks = result.data
                                                        dispatch(setUserOutbounds({
                                                            outbounds: userOutbounds
                                                        }))

                                                        dispatch(setUserTasks({
                                                            task: userTasks
                                                        }))

                                                        props.openModal(false)
                                                    })
                                                    .catch((err) => { console.log(err) })

                                            }

                                        })
                                        .catch((err) => { console.log(err) })


                                }


                            })
                            .catch((err) => { console.log(err) })

                        }
                        else{
                            let requestData = {
                                ownerAccount: user.email,
                                emailAddress: props.data.emailAddress
                            }
                            const url = port+'/deleteEmail'

                            await dataFetch(url, requestData)
                                .then((result) => {
                                    
                                    if (result.message === "email-deleted") {
                                        //Get user Emails
                                        const requestData = {
                                            ownerAccount: user.email
                                        }
                                        let url = port+'/getuseroutboundemails'
                                        dataFetch(url, requestData)
                                            .then((result) => {
                                                const userEmails = result.data;
                                                if (result.message === "emails-found") {
                                                    dispatch(setUserEmails({
                                                        emails: userEmails
                                                    }))

                                                    props.openModal(false)
                                                }
                                            })
                                    }
                                    else{
                                        alert(result)
                                    }
                                })
                        }



                    }}> Proceed</button>
                </div>
            </div>
        </div >

    )
}

export default DeleteOutbound