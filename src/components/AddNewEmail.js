
import React, { useState, useEffect } from 'react'
import "../styles/AddNewEmail.css"
import dataFetch from '../modules/dataFetch';
import { useDispatch, useSelector } from 'react-redux';
import { setUserEmails } from '../modules/redux/userEmailsSlice';
import useDataUpdater from '../modules/useDataUpdater';

function AddNewEmail(props) {
    const port = ""
    const { refreshUserOutbounds } = useDataUpdater()
    const { refreshUserEmails } = useDataUpdater()
    const { refreshUserTasks } = useDataUpdater()
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user.userData);
    const [sendFromSecondaryEmail, setSendFromSecondaryEmail] = useState(false);
    const [addPrimaryEmailError, setAddPrimaryEmailError] = useState("")
    const [addSecondaryEmailError, setAddSecondaryEmailError] = useState("")
    const [loadingAddEmail, setLoadingAddEmail] = useState(false)



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



    async function testEmail(email, sendingAs, password) {
        let requestData = {
            email: email,
            sendas: sendingAs,
            password: password
        }
        const url = port + "/testemail"
        let result = await dataFetch(url, requestData)
        if (result.message === "sent") { return true }
        else { return false }

    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

    };
    const handleChange2 = (e) => {
        const { name, value } = e.target;
        setFormData2({ ...formData2, [name]: value });

    };

    const validateForm = () => {


        // Name validation (non-empty)
        if (!formData.name.trim()) {
            setAddPrimaryEmailError('Name is required')
            return false
        }

        // Email validation (basic format)
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.toLowerCase())) {

            setAddPrimaryEmailError('Invalid email address')
            return false;
        }

        // Password validation (minimum length)
        else if (formData.password.length !== 16) {
            setAddPrimaryEmailError('App password must be 16 characters long')
            return false;
        }

        // Sending Capacity validation (numeric and positive)
        else if (!/^[1-9][0-9]*$/.test(formData.sendingCapacity)) {
            setAddPrimaryEmailError('Sending capacity must be a positive number')
            return false;
        }

        // Signature validation (non-empty)
        else if (!formData.signature) {

            setAddPrimaryEmailError('Signature is required. For an empty signature, press the space button')
            return false;
        }
        else {
            return true
        }


    };
    const validateForm2 = () => {


        // Name validation (non-empty)
        if (!formData2.name.trim()) {

            setAddSecondaryEmailError("Name is required")
            return false
        }

        // Email validation (basic format)
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData2.email.toLocaleLowerCase())) {

            setAddSecondaryEmailError("Invalid email address")
            return false
        }

        // Password validation (minimum length)
        else if (formData2.password.length !== 16) {

            setAddPrimaryEmailError("Password must be 16 characters long")
            return false
        }

        // // Sending Capacity validation (numeric and positive)
        // if (!/^[1-9][0-9]*$/.test(formData2.sendingCapacity)) {
        //     newErrors.sendingCapacity = 'Sending capacity must be a positive number';
        // } else {
        //     newErrors.sendingCapacity = '';
        // }

        // Signature validation (non-empty)
        else if (!formData2.signature) {
            setAddPrimaryEmailError("Signature is required. For an empty signature, press the space button")
            return false
        }
        else {
            return true
        }

    };

    const handleSubmit = async () => {

        setAddSecondaryEmailError("")
        setAddPrimaryEmailError("")


        // async function getuseroutboundemails() {
        //     try {
        //         const requestData = { ownerAccount: user.email }

        //         const url = port + '/getuseroutboundemails'
        //         const result = await dataFetch(url, requestData)

        //         const userEmails = result.data;
        //         if (result.message === "emails-found") {
        //             // console.log(userEmails)
        //             // console.log("is user Email an Array? " + Array.isArray(userEmails))
        //             dispatch(setUserEmails({
        //                 emails: userEmails
        //             }))
        //             return true;
        //         }
        //         else { return false }


        //     } catch (error) {

        //     }

        // }

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
                    return true;
                } else if (result.message === "found") {

                    return result.data;
                }
                else {
                    console.log(result.message)
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
                setLoadingAddEmail(true)
                let emailAvailability = await (checkEmailAvailabiliy(formData.email.toLocaleLowerCase()))


                if (emailAvailability == true) {
                    //  let    k= await  testEmail(formData.email.toLocaleLowerCase(), formData.email.toLocaleLowerCase(), formData.password)
                    //     alert(k)
                    if (await testEmail(formData.email.toLocaleLowerCase(), formData.email.toLocaleLowerCase(), formData.password)) {
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

                            if (refreshUserOutbounds({ ownerAccount: user.email }) && refreshUserTasks({ ownerAccount: user.email }) && refreshUserEmails({ ownerAccount: user.email })) {
                                props.openModal(false);
                            }




                        }
                        else {
                            setAddPrimaryEmailError("An error occured when registering this email.")
                            setLoadingAddEmail(false)
                        }
                    }
                    else {
                        setAddPrimaryEmailError("Please review your creadentials. Test email failed")
                        setLoadingAddEmail(false)
                    }

                }
                else if (emailAvailability !== true && emailAvailability !== "connection error") {
                    setAddPrimaryEmailError("This email is in use.")
                    setLoadingAddEmail(false)
                }
                else {
                    setAddPrimaryEmailError("Connection failed.")
                    setAddPrimaryEmailError(emailAvailability)
                    setLoadingAddEmail(false)
                }








            }
        }
        else {
            if (validateForm() && validateForm2()) {

                setLoadingAddEmail(true)
                let emailAvailability1 = await (checkEmailAvailabiliy(formData.email.toLocaleLowerCase()))
                let emailAvailability2 = await (checkEmailAvailabiliy(formData2.email.toLocaleLowerCase()))

                let correctCredentials1 = await testEmail(formData.email.toLocaleLowerCase(), formData.email.toLocaleLowerCase(), formData.password)

                let correctCredentials2 = await testEmail(formData.email.toLocaleLowerCase(), formData2.email.toLocaleLowerCase(), formData2.password)

                if (emailAvailability1 !== true) {

                    if (emailAvailability1 == "connection error") {
                        setAddPrimaryEmailError("Connection failed.");
                        setLoadingAddEmail(false)
                    }
                    else {
                        setAddPrimaryEmailError("One of these emails may have been registered");
                        setLoadingAddEmail(false)
                    }
                }
                else if (emailAvailability1 == true && emailAvailability2 == true) {

                    if (correctCredentials1 && correctCredentials2) {
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
                                if (refreshUserOutbounds({ ownerAccount: user.email }) && refreshUserTasks({ ownerAccount: user.email }) && refreshUserEmails({ ownerAccount: user.email })) {
                                    props.openModal(false);
                                }

                            }

                        }
                        else {
                            setAddPrimaryEmailError("An error occured when registering this email")
                            setLoadingAddEmail(false)
                        }
                    }
                    else {
                        setLoadingAddEmail(false)
                        setAddPrimaryEmailError("Please review your creadentials. Test email failed")
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
                                if (correctCredentials1 && correctCredentials2) {
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
                                            if (refreshUserOutbounds({ ownerAccount: user.email }) && refreshUserTasks({ ownerAccount: user.email }) && refreshUserEmails({ ownerAccount: user.email })) {
                                                props.openModal(false);
                                            }

                                        }

                                    }
                                }
                                else {
                                    setLoadingAddEmail(false)
                                    setAddPrimaryEmailError("Please review credentials. Test email failed")
                                }




                            }
                            else {
                                setLoadingAddEmail(false)
                                setAddSecondaryEmailError('This email is in use')

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

                {addPrimaryEmailError && <div className='form-error-container'><p className='error'><i class="fa-solid fa-circle-exclamation"></i> {addPrimaryEmailError}</p></div>}
                <div>

                    <input
                        placeholder='name'
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />

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

                </div>
                <div>
                    <label className='choice-lable'>
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

                        {addSecondaryEmailError && <div className='form-error-container'><p className='error'><i class="fa-solid fa-circle-exclamation"></i> {addSecondaryEmailError}</p></div>}
                        <div>

                            <input
                                placeholder='name'
                                type="text"
                                id="name2"
                                name="name"
                                value={formData2.name}
                                onChange={handleChange2}
                            />

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

                        </div>
                    </form>


                </div>
            ) : (<></>)
            }


            <div>
                <button className='site-button-thin' type="button" onClick={() => {
                    if (!loadingAddEmail) { handleSubmit() }
                }}>{loadingAddEmail ? <i className="fa-solid fa-spinner fa-spin spinner"></i> : <p>{sendFromSecondaryEmail ? "Add Emails" : "Add Email"}</p>}</button>
            </div>

        </div >



    )
}

export default AddNewEmail