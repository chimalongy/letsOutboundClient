import { useState, useRef, useEffect } from "react";
import '../styles/AddOutbound.css'
import dataFetch from "../modules/dataFetch";
import { setUserEmails } from '../modules/redux/userEmailsSlice';
import { useDispatch, useSelector } from 'react-redux';
import OutboundEmails from "./OutboundEmails";
import { setUserOutbounds } from '../modules/redux/userOutboundsSlice';
import useDataUpdater from '../modules/useDataUpdater';

function AddOutbound(props) {
    const port = "http://localhost:4000"
    const { refreshUserOutbounds } = useDataUpdater()
    const { refreshUserEmails } = useDataUpdater()
    const { refreshUserTasks } = useDataUpdater()
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.userData);
    const uEmails = useSelector((state) => state.userEmails.userEmails.emails);





    const [showStepone, setShowStepOne] = useState(true)
    const [submissionMessage, setSubmissionMessage] = useState()
    const [outboundEmailList, setOutboundEmailList] = useState(uEmails)
    const [selectedEmails, setSelectedEmails] = useState([]);

    // const [emailListCount, setEmailListCount] = useState(0);
    const [endUserEmails, setEndUserEmails] = useState([])
    const [endUserNames, setEndUserNames] = useState([])
    const [emailListCount, setEmailListCount] = useState(0)
    const [outboundAllocation, setOutboundAllocation] = useState([])
    const [outboundDataError, setOutboundDataError] = useState()
    const [outboundDataNotification, setOutboundDataNotification] = useState()
    const [loadingAddOutbound, setLoadingAddOutbound] = useState(false)


    useEffect(() => {
        setEmailListCount(endUserEmails.length);
    }, [endUserEmails]);




    function handleSelectChange(e) {
        if (emailListCount > 0) {
            const selectedIndex = e.target.value;


            if (selectedIndex !== "") {
                const selectedEmail = outboundEmailList[selectedIndex];

                // Check if the email is already in selectedEmails
                if (!selectedEmails.some((email) => email.emailAddress === selectedEmail.emailAddress)) {


                    if ((selectedEmail.primaryEmail == false) && (selectedEmails.some((email) => email.emailAddress === selectedEmail.parentEmail))) {

                        setSubmissionMessage(`You cannot allocate ${selectedEmail.emailAddress} and ${selectedEmail.parentEmail} in the same outbound`)
                    }
                    else if ((selectedEmail.primaryEmail == true) && (selectedEmails.some((email) => email.parentEmail === selectedEmail.emailAddress))) {
                        setSubmissionMessage(`You cannot allocate ${selectedEmail.emailAddress} and its secondary email in the same outbound`)

                    }
                    else {
                        console.log("old end user emails lent" + endUserEmails.length)

                        setSelectedEmails((prevSelected) => [...prevSelected, selectedEmail]);
                        let newAllocation = endUserEmails.slice(0, selectedEmail.dailySendingCapacity);
                        let nameAllocation = endUserNames.slice(0, selectedEmail.dailySendingCapacity);

                        let allocation = {
                            allocatedEmail: selectedEmail.emailAddress,
                            sendingFrom: selectedEmail.primaryEmail ? selectedEmail.emailAddress : selectedEmail.parentEmail,
                            emailAllocations: newAllocation,
                            nameAllocations: nameAllocation,
                        }
                        setOutboundAllocation([...outboundAllocation, allocation])

                        endUserEmails.splice(0, (selectedEmail.dailySendingCapacity));
                        endUserNames.splice(0, (selectedEmail.dailySendingCapacity));

                        console.log("new end user emails lent" + endUserEmails.length)


                        const newCapacity = endUserEmails.length
                        if (newCapacity > 0) { setEmailListCount(newCapacity) }
                        else { setEmailListCount(0) }

                    }



                }
                else {// email already on the list
                    if (selectedEmail.primaryEmail == true) {
                        setSubmissionMessage("This email is already selected")
                    }
                    else {
                        //check if they share the same parent
                        let sameParent = false
                        for (let i = 0; i < selectedEmails.length; i++) {
                            if ((selectedEmails[i].primaryEmail == false) && (selectedEmails[i].parentEmail == selectedEmail.parentEmail)) {
                                sameParent = true
                            }
                        }

                        if (sameParent) {
                            setSubmissionMessage("This email is already selected")
                        }
                        else {

                            console.log("old end user emails lent" + endUserEmails.length)

                            setSelectedEmails((prevSelected) => [...prevSelected, selectedEmail]);
                            let newAllocation = endUserEmails.slice(0, selectedEmail.dailySendingCapacity);
                            let nameAllocation = endUserNames.slice(0, selectedEmail.dailySendingCapacity);


                            let allocation = {
                                allocatedEmail: selectedEmail.emailAddress,
                                sendingFrom: selectedEmail.primaryEmail ? selectedEmail.emailAddress : selectedEmail.parentEmail,
                                emailAllocations: newAllocation,
                                nameAllocations: nameAllocation,
                            }
                            setOutboundAllocation([...outboundAllocation, allocation])


                            endUserEmails.splice(0, (selectedEmail.dailySendingCapacity));
                            endUserNames.splice(0, (selectedEmail.dailySendingCapacity));

                            console.log("new end user emails lent" + endUserEmails.length)


                            const newCapacity = endUserEmails.length
                            if (newCapacity > 0) { setEmailListCount(newCapacity) }
                            else { setEmailListCount(0) }



                        }
                    }
                }


            }
        }

    }
    const handleRemoveEmail = (index) => {
        if (selectedEmails.length > 0) {
            const removedEmail = selectedEmails[index];
            setSelectedEmails((prevSelected) =>
                prevSelected.filter((email, i) => i !== index)
            );
            //setOutboundEmailList((prevList) => [...prevList, removedEmail]);

            setEndUserEmails((prevEndUserEmails) => [...prevEndUserEmails, ...outboundAllocation[index].emailAllocations]);
            setEndUserNames((prevEndUserNames) => [...prevEndUserNames, ...outboundAllocation[index].nameAllocations]);
            const updatedOutboundAllocation = [...outboundAllocation];
            updatedOutboundAllocation.splice(index, 1);
            setOutboundAllocation(updatedOutboundAllocation);

            // setEndUserEmails([...endUserEmails, ...outboundAllocation[index].emailAllocations]);
            // setEndUserNames([...endUserNames, ...outboundAllocation[index].nameAllocations]);
            // setEmailListCount(endUserEmails.length)
            // outboundAllocation.splice(index, 1);

            // if (emailListCount == 0) {
            //     const emails = stepOneFormData.emaillist.split('\n');

            //     // let allocatedCapacity=0
            //     // for(let i=0; i<selectedEmails.length;i++){
            //     //    if (i==index){continue}
            //     //    allocatedCapacity+=selectedEmails[i].dailySendingCapacity
            //     // }
            //     // setEmailListCount(emails.length-allocatedCapacity)

            //     setEndUserEmails([...endUserEmails, ...outboundAllocation[index].emailAllocations]);
            //     setEndUserNames([...endUserNames, ...outboundAllocation[index].emailAllocations]);
            //     setEmailListCount(endUserEmails.length)
            //     outboundAllocation.splice(index, 1);
            // }
            // else {
            //     // const newCapacity= emailListCount+removedEmail.dailySendingCapacity;
            //     // setEmailListCount(newCapacity)
            //     setEndUserEmails([...endUserEmails, ...outboundAllocation[index].emailAllocations]);
            //     setEndUserNames([...endUserNames, ...outboundAllocation[index].emailAllocations]);
            //     setEmailListCount(endUserEmails.length)
            //     outboundAllocation.splice(index, 1);
            // }

        }

    };


    function handleAddOutbound() {
        console.log(outboundAllocation); console.log(selectedEmails); console.log(endUserEmails)

        if (endUserEmails.length > 0) {
            setSubmissionMessage("Allocation not complete")
        }
        else {
            setLoadingAddOutbound(true)
            const requestData = {
                ownerAccount: user.email,
                outboundName: stepOneFormData.name,
                emailList: outboundAllocation
            }
            const url = port + '/registeroutbound'
            dataFetch(url, requestData)
                .then((result) => {
                    if (result.message === "registrationComplete") {
                        // alert("Outbound Registered")
                        //GETTING OUTBOUND DATA
                        refreshUserOutbounds({ ownerAccount: user.email })
                        refreshUserTasks({ ownerAccount: user.email })
                        refreshUserEmails({ ownerAccount: user.email })
                        props.openModal(false);

                        // const newrequestData = { ownerAccount: user.email }
                        // let url = port + '/getuseroutbounds'
                        // dataFetch(url, newrequestData)
                        //     .then((result) => {
                        //         const userOutbounds = result.data;
                        //         if (result.message === "outbounds-found") {
                        //             //PERSIT USER DATA
                        //             dispatch(setUserOutbounds({
                        //                 outbounds: userOutbounds
                        //             }))
                        //         }
                        //     })
                        //     .catch((error) => setSubmissionMessage(error))

                    }
                    else if (result.message === "already-exist") {
                        setLoadingAddOutbound(false);
                        setSubmissionMessage("Sorry this outbound name is already in use. You can use another name")
                    }
                    else {
                        setLoadingAddOutbound(false)
                        setSubmissionMessage("An error occured.")
                    }
                })
                .catch((error) => {
                    setLoadingAddOutbound(false)
                    setSubmissionMessage(error)
                })
        }
    }


    const [stepOneFormData, setStepOneFormData] = useState({
        name: '',
        emaillist: '',
        emailnamelist: ''
    });



    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailRegex.test(email);
    };

    function validateenduserName(name) {
        if (!name) {
            return true;
        }
        const regex = /^[a-zA-Z]+$/;
        return regex.test(name);
    }

    const handleStepOneInputChange = (e) => {
        const { name, value } = e.target;
        setStepOneFormData({
            ...stepOneFormData,
            [name]: value,
        });
    };

    const validateStepOneForm = () => {

        let namecheck = false;
        let emailcheck = false;
        let emailnamecheck = false;
        if (stepOneFormData.name.trim() === '') {
            setOutboundDataError("Outbound name is required")
            return false
        }
        // Check if the 'emaillist' field is empty
        if (stepOneFormData.emaillist.trim() === '') {
            setOutboundDataError("Email List is required")
            return false
        } else {
            const emails = stepOneFormData.emaillist.split('\n');
            const invalidEmails = emails.filter((email) => !validateEmail(email.trim()));
            if (invalidEmails.length > 0) {
                setOutboundDataError('Email List contains some invalid emails.\n' + invalidEmails)
                return false
            }
        }
        // Check if the 'emailend user names' field is empty
        if (stepOneFormData.emailnamelist.trim() === '') {
            // newErrors.emailnamelist = 'end user names is required is required.';
            emailnamecheck = true;
        } else {
            const endusernames = stepOneFormData.emailnamelist.split('\n');
            const invalidnames = endusernames.filter((endusername) => !validateenduserName(endusername.trim()));
            if (invalidnames.length > 0) {
                setOutboundDataError('Enduser name list contains some invalid characters.')
                return false
            }
        }

        return true

    };


    const handleStepOneSubmit = (e) => {
        e.preventDefault();
        const isValid = validateStepOneForm();

        if (isValid) {
            setOutboundDataError("")

            const emails = stepOneFormData.emaillist.split('\n');
            setEmailListCount(emails.length)
            setEndUserEmails(emails)

            let endusernames = stepOneFormData.emailnamelist.split('\n');
            if (endusernames.length != emails.length) {
                const emptyarray = new Array(emails.length)
                endusernames = emptyarray
                setEndUserNames(endusernames)
                setOutboundDataNotification("The name list does not match with the email list\n We have deleted all name list entries")
                setTimeout(() => {
                    setShowStepOne(false)

                }, 1000);
            }
            else {
                setEndUserNames(endusernames)
                setShowStepOne(false)
            }






        } else {

        }
    };


    return (
        <div className="form-holder">
            <h2 className="new-outbound-header">New Outbound {showStepone ? (<></>) : (<i onClick={() => { setShowStepOne(true); setSelectedEmails([]); setOutboundAllocation([]); }} className="fa-solid fa-circle-arrow-left"></i>)}  </h2>

            {showStepone ? (
                <form onSubmit={handleStepOneSubmit} id="frmOutboundDetails">
                    {outboundDataError && <div className='form-error-container'><p className='error'><i class="fa-solid fa-circle-exclamation"></i> {outboundDataError}</p></div>}
                    {outboundDataNotification && <div className='form-error-container'><p className='success'><i class="fa-solid fa-flag-checkered"></i> {outboundDataNotification}</p></div>}
                    <div>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={stepOneFormData.name}
                            onChange={handleStepOneInputChange}
                            placeholder="outbound name"
                        />

                    </div>
                    <div >
                        <>Emails</>
                        <div className="list-container">

                            <textarea
                                id="emaillist"
                                name="emaillist"
                                value={stepOneFormData.emaillist}
                                onChange={handleStepOneInputChange}
                                rows={8}
                                placeholder="email list (one email per line)"
                            />

                        </div>
                        <>Names</>
                        <div>
                            <textarea
                                id="emailnamelist"
                                name="emailnamelist"
                                //value={stepOneFormData.emailnamelist}
                                value={stepOneFormData.emailnamelist}
                                onChange={handleStepOneInputChange}
                                rows={8}
                                placeholder="end-user names (one email per line)"
                            />

                        </div>
                    </div>
                    <button type="submit">Submit</button>
                </form>
            ) : (
                <div>
                    <div className="pop-sub-title">
                        <h2>Allocate Emails</h2>

                        <p>You are to allocate a capacity of {emailListCount}</p>
                    </div>
                    {submissionMessage && <div className='form-error-container'><p className='error'><i class="fa-solid fa-circle-exclamation"></i> {submissionMessage}</p></div>}


                    <h6>Select Emails</h6>
                    <div>
                        {/* <select onChange={handleSelectChange}>
                            <option value="">Select an email</option>
                            {outboundEmailList.map((email, index) => (
                                <option key={index} value={index}>
                                    
                                    <i class="fa-solid fa-battery-full add"></i>
                                    <div>
                                        <p>{email.emailAddress}</p>
                                        <p><i class="fa-solid fa-battery-full add"></i> {email.dailySendingCapacity}</p>
                                    </div>
                                </option>
                            ))}
                        </select> */}
                        <select onChange={handleSelectChange}>
                            <option value="">Select an email</option>
                            {outboundEmailList.map((email, index) => (
                                <option className="mapped-option" key={index} value={index}>

                                    <div>
                                        {email.primaryEmail == true ? (<div>{email.emailAddress}</div>) : (<div>{`${email.emailAddress}....${email.parentEmail}`}</div>)}
                                    </div>

                                </option>
                            ))}
                        </select>

                    </div>
                    <div className="select-email-container">
                        <h2>Selected Emails:</h2>
                        <ul>
                            {selectedEmails.map((email, index) => (
                                <li key={index} className="selectedEmailItem">
                                    <p>{email.emailAddress}</p>
                                    <i onClick={() => handleRemoveEmail(index)} className="fa-solid fa-circle-xmark removeselectedemail"></i>

                                </li>
                            ))}
                        </ul>
                    </div>

                    <button onClick={handleAddOutbound} className="add-outtbound-button">{loadingAddOutbound ? <i className="fa-solid fa-spinner fa-spin spinner"></i> : <p>Add Oubound</p>}</button>
                    <p>{loadingAddOutbound}</p>
                    {/* onClick={() => { if (!loadingAddOutbound) { handleAddOutbound() } }} */}
                </div>
            )}
        </div>
    )

}

export default AddOutbound