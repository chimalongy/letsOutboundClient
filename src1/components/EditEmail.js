import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import dataFetch from '../modules/dataFetch';
import useDataUpdater from "../modules/useDataUpdater"

function EditEmail(props) {
    const { refreshUserOutbounds } = useDataUpdater()
    const { refreshUserEmails } = useDataUpdater()
    const { refreshUserTasks } = useDataUpdater()
    const port = ""
    const user = useSelector((state) => state.user.userData);
    const [updateErrorMessage, setUpdateErrorMessage] = useState("")

    const [formData, setFormData] = useState({
        name: props.data.senderName,
        sendingCapacity: props.data.dailySendingCapacity,
        signature: props.data.signature,
    });

    const [errors, setErrors] = useState({});
    const [loadingEdit, setLoadingEdit] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        // Clear error for the field when it's being modified

    };

    const handleSubmit = () => {



        if (validateForm(formData)) {
            setLoadingEdit("true")
            let requestData = {
                ownerAccount: user.email,
                emailAddress: props.data.emailAddress,
                sendingFrom: props.data.primaryEmail == true ? props.data.emailAddress : props.data.parentEmail,
                signature: formData.signature,
                senderName: formData.senderName,
                dailySendingCapacity: formData.sendingCapacity
            }

            const url = port + "/updateEmailData"
            dataFetch(url, requestData)
                .then((result => {
                    if (result.message == "email-updated") {
                        refreshUserOutbounds({ ownerAccount: user.email })
                        refreshUserEmails({ ownerAccount: user.email })
                        refreshUserTasks({ ownerAccount: user.email })
                        props.openModal(false)
                    }
                    else {
                        setLoadingEdit(false)
                        setUpdateErrorMessage("An error occured. Could not update")
                    }
                }))
                .catch(err => {
                    setLoadingEdit(false)
                    setUpdateErrorMessage(err)

                })
        }
    };

    const validateForm = (data) => {
        const capacity = parseFloat(data.sendingCapacity);
        // Name validation
        if (!data.name.trim()) {

            setUpdateErrorMessage("Name is required")
            return false
        }

        // Sending Capacity validation

        else if (isNaN(capacity) || capacity <= 0) {

            setUpdateErrorMessage("Sending Capacity must be a valid positive number")
            return false
        }


        // Signature validation
        else if (!data.signature.trim()) {

            setUpdateErrorMessage("Signature is required")
            return false
        }
        else {
            return true
        }


    };

    return (
        <div className='form-holder'>
            <h2>Edit Email</h2>


            <div className='pop-sub-title' >
                Editing:
                {props.data.primaryEmail == true ? <p>{props.data.emailAddress}</p> : <p><b>{`${props.data.parentEmail} >`}</b><br />{`${props.data.emailAddress}`}</p>}
            </div>

            <form onSubmit={(e) => { e.preventDefault() }}>

                {updateErrorMessage && <div className='form-error-container'><p className='error'><i class="fa-solid fa-circle-exclamation"></i> {updateErrorMessage}</p></div>}
                <div>
                    <label>Change sending name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder='new name'
                    />

                </div>


                <div>
                    <label>Change daily sending capacity</label>
                    <input
                        type="number"  // Changed to accept only numeric input
                        id="sendingCapacity"
                        name="sendingCapacity"
                        value={formData.sendingCapacity}
                        onChange={handleChange}
                        placeholder='new sending capacity'
                    />

                </div>

                <div>
                    <label>Change signature</label>
                    <textarea
                        id="signature"
                        name="signature"
                        value={formData.signature}
                        onChange={handleChange}
                        rows={5}
                        placeholder='signature'
                    />

                </div>
                <div style={{ display: "flex", gap: "1rem", flexDirection: "row", justifyContent: "space-between" }}>

                    <button style={{ flex: 1 }} onClick={() => { props.openModal(false) }}>Cancel</button>
                    <button style={{ flex: 1 }} onClick={() => { if (!loadingEdit) { handleSubmit() } }}>{loadingEdit ? <i class="fa-solid fa-spinner fa-spin"></i> : "Proceed"}</button>
                </div>

            </form>


        </div>
    )
}

export default EditEmail