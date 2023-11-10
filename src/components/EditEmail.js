import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import dataFetch from '../modules/dataFetch';
import useDataUpdater from "../modules/useDataUpdater"

function EditEmail(props) {
    const { refreshUserOutbounds } = useDataUpdater()
    const { refreshUserEmails } = useDataUpdater()
    const { refreshUserTasks } = useDataUpdater()
    const port = "http://localhost:4000"
    const user = useSelector((state) => state.user.userData);
    const [updateErrorMessage, setUpdateErrorMessage]= useState("")
    const [formData, setFormData] = useState({
        name: props.data.senderName,
        sendingCapacity: props.data.dailySendingCapacity,
        signature: props.data.signature,
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        // Clear error for the field when it's being modified
        setErrors({
            ...errors,
            [name]: undefined,
        });
    };

    const handleSubmit = () => {


        // Perform validation
        const newErrors = validateForm(formData);
        if (Object.keys(newErrors).length === 0) {
            let requestData = {
                ownerAccount: user.email,
                emailAddress:props.data.emailAddress,
                sendingFrom:props.data.primaryEmail==true?props.data.emailAddress: props.data.parentEmail,
                signature: formData.signature,
                senderName: formData.senderName,
                dailySendingCapacity:formData.sendingCapacity
            }

            const url = port+"/updateEmailData"
            dataFetch(url, requestData)
            .then((result=>{
                if (result.message =="email-updated"){
                    refreshUserOutbounds({ ownerAccount: user.email })
                    refreshUserEmails({ ownerAccount: user.email })
                    refreshUserTasks({ ownerAccount: user.email })
                    props.openModal(false)
                }
                else{
                    setUpdateErrorMessage("An error occured. Could not update")
                }
            }))
            .catch(err=>{setUpdateErrorMessage("An error occured. Could not update")})
        } else {
            // If there are errors, update the state with the errors
            setErrors(newErrors);
        }
    };

    const validateForm = (data) => {
        const errors = {};

        // Name validation
        if (!data.name.trim()) {
            errors.name = 'Name is required';
        }

        // Sending Capacity validation
        const capacity = parseFloat(data.sendingCapacity);
        if (isNaN(capacity) || capacity <= 0) {
            errors.sendingCapacity = 'Sending Capacity must be a valid positive number';
        }

        // Signature validation
        if (!data.signature.trim()) {
            errors.signature = 'Signature is required';
        }

        return errors;
    };

    return (
        <div className='form-holder'>
            <h2>Edit Email</h2>
            
            <p>Editing: <small>{props.data.emailAddress}</small></p>

            <form onSubmit={(e) => { e.preventDefault() }}>
            {updateErrorMessage && <p className='error'>{updateErrorMessage}</p>}
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
                    {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
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
                    {errors.sendingCapacity && <span style={{ color: 'red' }}>{errors.sendingCapacity}</span>}
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
                    {errors.signature && <span style={{ color: 'red' }}>{errors.signature}</span>}
                </div>
                <div style={{ display: "flex", gap: "1rem", flexDirection: "row", justifyContent: "space-between" }}>

                    <button style={{ flex: 1 }} onClick={() => { props.openModal(false) }}>Cancel</button>
                    <button style={{ flex: 1 }} onClick={() => { handleSubmit() }}>Proceed</button>
                </div>

            </form>


        </div>
    )
}

export default EditEmail