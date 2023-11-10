
import React, { useState, useEffect } from 'react'
import "../styles/AddNewEmail.css"
import dataFetch from '../modules/dataFetch';
import { useDispatch, useSelector } from 'react-redux';
import { setUserEmails } from '../modules/redux/userEmailsSlice';

function AddNewEmail(props) {
    const port = ""
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user.userData);
    const [sendFromSecondaryEmail, setSendFromSecondaryEmail] = useState(false);


    const [submissionMessage, setSubmissionMessage] = useState()
    const [submission2Message, setSubmission2Message] = useState()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        sendingCapacity: '',
        signature: '',
    });
    const [formData2, setFormData2] = useState({
        name: '',
        email: '',
        password: '',
        signature: '',
    });

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        sendingCapacity: '',
        signature: '',
    });
    const [errors2, setErrors2] = useState({
        name: '',
        email: '',
        password: '',
        signature: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleChange2 = (e) => {
        const { name, value } = e.target;
        setFormData2({ ...formData2, [name]: value });
    };

    const validateForm = () => {
        const newErrors = { ...errors };

        // Name validation (non-empty)
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else {
            newErrors.name = '';
        }

        // Email validation (basic format)
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.toLowerCase())) {
            newErrors.email = 'Invalid email address';
        } else {
            newErrors.email = '';
        }

        // Password validation (minimum length)
        if (formData.password.length !== 16) {
            newErrors.password = 'Password must be 16 characters long';
        } else {
            newErrors.password = '';
        }

        // Sending Capacity validation (numeric and positive)
        if (!/^[1-9][0-9]*$/.test(formData.sendingCapacity)) {
            newErrors.sendingCapacity = 'Sending capacity must be a positive number';
        } else {
            newErrors.sendingCapacity = '';
        }

        // Signature validation (non-empty)
        if (!formData.signature) {
            newErrors.signature = 'Signature is required. For an empty signature, press the space button';
        } else {
            newErrors.signature = '';
        }

        setErrors(newErrors);

        return Object.values(newErrors).every((error) => !error);
    };
    const validateForm2 = () => {
        const newErrors = { ...errors2 };

        // Name validation (non-empty)
        if (!formData2.name.trim()) {
            newErrors.name = 'Name is required';
        } else {
            newErrors.name = '';
        }

        // Email validation (basic format)
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData2.email.toLocaleLowerCase())) {
            newErrors.email = 'Invalid email address';
        } else {
            newErrors.email = '';
        }

        // Password validation (minimum length)
        if (formData2.password.length !== 16) {
            newErrors.password = 'Password must be 16 characters long';
        } else {
            newErrors.password = '';
        }

        // // Sending Capacity validation (numeric and positive)
        // if (!/^[1-9][0-9]*$/.test(formData2.sendingCapacity)) {
        //     newErrors.sendingCapacity = 'Sending capacity must be a positive number';
        // } else {
        //     newErrors.sendingCapacity = '';
        // }

        // Signature validation (non-empty)
        if (!formData2.signature) {
            newErrors.signature = 'Signature is required. For an empty signature, press the space button';
        } else {
            newErrors.signature = '';
        }

        setErrors2(newErrors);

        return Object.values(newErrors).every((error) => !error);
    };

    const handleSubmit = async () => {

        setSubmission2Message("")
        setSubmissionMessage("")

        async function getuseroutboundemails() {
            try {
                const requestData = { ownerAccount: user.email }

                const url = port + '/getuseroutboundemails'
                const result = await dataFetch(url, requestData)

                const userEmails = result.data;
                if (result.message === "emails-found") {
                    // console.log(userEmails)
                    // console.log("is user Email an Array? " + Array.isArray(userEmails))
                    dispatch(setUserEmails({
                        emails: userEmails
                    }))
                    return true;
                }
                else { return false }


            } catch (error) {

            }

        }

        async function getSimilarEmails(email) {
            console.log("finding simlar eamils for :" + email)
            try {
                const requestData = {
                    ownerAccount: user.email,
                    emailAddress: email
                };
                const url = port + '/findsimilaremails';
                const result = await dataFetch(url, requestData);
                if (result.message == "not-found") {
                    return false;
                }
                else if (result.message == "found") {
                    return result.data
                }
                else {
                    return "error";
                }

            } catch (error) {

            }

        }

        async function checkEmailAvailabiliy(email) {
            // check if email new exist

            try {
                const requestData = {
                    ownerAccount: user.email,
                    emailAddress: email
                };
                const url = port + '/findemail';
                const result = await dataFetch(url, requestData);

                if (result.message === "not-found") {
                    // emailAvailability = true;
                    // setSubmissionMessage("");

                    return true;
                } else if (result.message === "found") {
                    // setSubmissionMessage("This email is already in use for outbounding");
                    return result.data;
                }
                else {
                    return "connection error"
                }
            } catch (error) {
                console.log(error);
            }

        }

        async function registeremail(requestData) {
            const url = port + '/registeremail'
            const result = await dataFetch(url, requestData)
            if (result.message === "registrationComplete") {
                return true
            }
            else {
                alert(JSON.stringify(result))
                return false;
            }
        }

        if (!sendFromSecondaryEmail) {
            if (validateForm()) {

                let emailAvailability = await (checkEmailAvailabiliy(formData.email.toLocaleLowerCase()))

                if (emailAvailability == true) {
                    const requestData = {
                        ownerAccount: user.email,
                        emailAddress: formData.email.toLocaleLowerCase(),
                        password: formData.password,
                        senderName: formData.name,
                        signature: formData.signature,
                        dailySendingCapacity: formData.sendingCapacity,
                        primary: true,
                        parentEmail: ""
                    };

                    const registered = await registeremail(requestData)
                    if (registered) {
                        let rehydrated = getuseroutboundemails()
                        props.openModal(false);
                    }
                    else {
                        setSubmissionMessage("An error occured when registering this email.")
                    }
                }
                else if (emailAvailability !== true && emailAvailability !== "connection error") {
                    setSubmissionMessage("This email is in use.")
                }
                else {
                    setSubmissionMessage("Connection failed.")
                }








            }
        }
        else {
            if (validateForm() && validateForm2()) {
                console.log(formData)
                console.log(formData2)

                let emailAvailability1 = await (checkEmailAvailabiliy(formData.email.toLocaleLowerCase()))
                let emailAvailability2 = await (checkEmailAvailabiliy(formData2.email.toLocaleLowerCase()))

                if (emailAvailability1 !== true) {

                    if (emailAvailability1 == "connection error") { setSubmissionMessage("Connection failed.") }
                    else { setSubmissionMessage("One of these emails may have been registered") }
                }
                else if (emailAvailability1 == true && emailAvailability2 == true) {

                    const requestData1 = {
                        ownerAccount: user.email,
                        emailAddress: formData.email.toLocaleLowerCase(),
                        password: formData.password,
                        senderName: formData.name,
                        signature: formData.signature,
                        dailySendingCapacity: formData.sendingCapacity,
                        primary: true,
                        parentEmail: ""
                    };

                    const registered1 = await registeremail(requestData1)
                    if (registered1) {


                        const requestData2 = {
                            ownerAccount: user.email,
                            emailAddress: formData2.email.toLocaleLowerCase(),
                            password: formData2.password,
                            senderName: formData2.name,
                            signature: formData2.signature,
                            dailySendingCapacity: formData.sendingCapacity,
                            primary: false,
                            parentEmail: formData.email
                        };

                        const registered2 = await registeremail(requestData2)
                        if (registered2) {
                            let rehydrated = getuseroutboundemails()
                            props.openModal(false);
                        }

                    }
                    else {
                        setSubmissionMessage("An error occured when registering this email")
                    }

                }
                else if (emailAvailability1 == true && emailAvailability2 !== true) {
                    if (emailAvailability2 !== "connection error") {
                        // get all emails that has same addresss
                        let similarEmails = await (getSimilarEmails(formData2.email.toLocaleLowerCase()))

                        if (similarEmails !== "not-found" || similarEmails !== "error") {
                            //search for their parents
                            let sameParent = false
                            for (let i = 0; i < similarEmails.length; i++) {
                                if (similarEmails[i].primaryEmail == false && similarEmails[i].parentEmail == formData.email.toLocaleLowerCase()) {
                                    sameParent = true;
                                }
                            }

                            if (sameParent == false) { 
                                // add email

                                // console.log(similarEmails)

                                const requestData1 = {
                                    ownerAccount: user.email,
                                    emailAddress: formData.email.toLocaleLowerCase(),
                                    password: formData.password,
                                    senderName: formData.name,
                                    signature: formData.signature,
                                    dailySendingCapacity: formData.sendingCapacity,
                                    primary: true,
                                    parentEmail: ""
                                };
            
                                const registered1 = await registeremail(requestData1)
                                if (registered1) {
            
            
                                    const requestData2 = {
                                        ownerAccount: user.email,
                                        emailAddress: formData2.email.toLocaleLowerCase(),
                                        password: formData2.password,
                                        senderName: formData2.name,
                                        signature: formData2.signature,
                                        dailySendingCapacity: formData.sendingCapacity,
                                        primary: false,
                                        parentEmail: formData.email
                                    };
            
                                    const registered2 = await registeremail(requestData2)
                                    if (registered2) {
                                        let rehydrated = getuseroutboundemails()
                                        props.openModal(false);
                                    }
            
                                }





                            }
                            else {
                                setSubmission2Message('This email is in use')
                            }
                        }

                    }
                }
            }

        }
    };
    return (
        <div className='form-holder add-email-container'>
            <h2>Add Email</h2>
            <form onSubmit={(e) => { e.preventDefault() }}>
                {submissionMessage && <p className='error'>{submissionMessage}</p>}
                <div>

                    <input
                        placeholder='name'
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <span className="error">{errors.name}</span>
                </div>
                <div>

                    <input
                        placeholder='email'
                        type="text"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <span className="error">{errors.email}</span>
                </div>
                <div>

                    <input
                        placeholder='password'
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <span className="error">{errors.password}</span>
                </div>
                <div>

                    <input
                        placeholder='sending capcity'
                        type="number"
                        id="sendingCapacity"
                        name="sendingCapacity"
                        value={formData.sendingCapacity}
                        onChange={handleChange}
                    />
                    <span className="error">{errors.sendingCapacity}</span>
                </div>
                <div>

                    <textarea
                        placeholder='signature'
                        rows={4}
                        id="signature"
                        name="signature"
                        value={formData.signature}
                        onChange={handleChange}
                    />
                    <span className="error">{errors.signature}</span>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={sendFromSecondaryEmail}
                            onChange={() => { setSendFromSecondaryEmail(!sendFromSecondaryEmail) }}
                        />
                        Send from a secondary email
                    </label>
                </div >

            </form >

            {sendFromSecondaryEmail ? (
                <div className='form2'>


                    <form onSubmit={(e) => { e.preventDefault() }}>
                        {submission2Message && <p className='error'>{submission2Message}</p>}
                        <div>

                            <input
                                placeholder='name'
                                type="text"
                                id="name2"
                                name="name"
                                value={formData2.name}
                                onChange={handleChange2}
                            />
                            <span className="error">{errors2.name}</span>
                        </div>
                        <div>

                            <input
                                placeholder='email'
                                type="text"
                                id="email2"
                                name="email"
                                value={formData2.email}
                                onChange={handleChange2}
                            />
                            <span className="error">{errors2.email}</span>
                        </div>
                        <div>

                            <input
                                placeholder='password'
                                type="password"
                                id="password2"
                                name="password"
                                value={formData2.password}
                                onChange={handleChange2}
                            />
                            <span className="error">{errors2.password}</span>
                        </div>
                        {/*
                        
                        <div>

                            <input
                                placeholder='sending capcity'
                                type="number"
                                id="sendingCapacity2"
                                name="sendingCapacity"
                                value={formData2.sendingCapacity}
                                onChange={handleChange2}
                            />
                            <span className="error">{errors2.sendingCapacity}</span>
                        </div>
                        
                        */}
                        <div>

                            <textarea
                                placeholder='signature'
                                rows={4}
                                id="signature2"
                                name="signature"
                                value={formData2.signature}
                                onChange={handleChange2}
                            />
                            <span className="error">{errors.signature}</span>
                        </div>
                    </form>


                </div>
            ) : (<></>)
            }


            <div>
                <button type="button" onClick={() => {
                    handleSubmit()
                }}>Submit</button>
            </div>

        </div >



    )
}

export default AddNewEmail