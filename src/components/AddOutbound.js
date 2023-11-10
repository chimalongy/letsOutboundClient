import { useState, useRef, useEffect } from "react";
import '../styles/AddOutbound.css'
import dataFetch from "../modules/dataFetch";
import { setUserEmails } from '../modules/redux/userEmailsSlice';
import { useDispatch, useSelector } from 'react-redux';
import OutboundEmails from "./OutboundEmails";
import { setUserOutbounds } from '../modules/redux/userOutboundsSlice';

function AddOutbound(props) {
    const port = ""
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
                        alert(`You cannot allocate ${selectedEmail.emailAddress} and ${selectedEmail.parentEmail} in the same outbound`)
                    }
                    else if ((selectedEmail.primaryEmail == true) && (selectedEmails.some((email) => email.parentEmail === selectedEmail.emailAddress))) {
                        alert(`You cannot allocate ${selectedEmail.emailAddress} and its secondary email in the same outbound`)
                    }
                    else {
                        console.log("old end user emails lent" + endUserEmails.length)

                        setSelectedEmails((prevSelected) => [...prevSelected, selectedEmail]);
                        let newAllocation = endUserEmails.slice(0, selectedEmail.dailySendingCapacity);
                        let nameAllocation = endUserNames.slice(0, selectedEmail.dailySendingCapacity);
                       
                        let allocation = {
                            allocatedEmail: selectedEmail.emailAddress,
                            sendingFrom: selectedEmail.primaryEmail?selectedEmail.emailAddress:selectedEmail.parentEmail,
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
                        alert("You hava already added this email")
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
                            alert("You hava already added this email")
                        }
                        else {

                            console.log("old end user emails lent" + endUserEmails.length)

                            setSelectedEmails((prevSelected) => [...prevSelected, selectedEmail]);
                            let newAllocation = endUserEmails.slice(0, selectedEmail.dailySendingCapacity);
                            let nameAllocation = endUserNames.slice(0, selectedEmail.dailySendingCapacity);
                           
                           
                            let allocation = {
                                allocatedEmail: selectedEmail.emailAddress,
                                sendingFrom: selectedEmail.primaryEmail?selectedEmail.emailAddress:selectedEmail.parentEmail,
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
            alert("Allocation is not Complete")
        }
        else {

            const requestData = {
                ownerAccount: user.email,
                outboundName: stepOneFormData.name,
                emailList: outboundAllocation
            }
            const url = port + '/registeroutbound'
            dataFetch(url, requestData)
                .then((result) => {
                    if (result.message === "registrationComplete") {
                        alert("Outbound Registered")
                        //GETTING OUTBOUND DATA
                        const newrequestData = { ownerAccount: user.email }
                        let url = port + '/getuseroutbounds'
                        dataFetch(url, newrequestData)
                            .then((result) => {
                                const userOutbounds = result.data;
                                if (result.message === "outbounds-found") {
                                    //PERSIT USER DATA
                                    dispatch(setUserOutbounds({
                                        outbounds: userOutbounds
                                    }))
                                }
                            })
                            .catch(error => console.log(error))
                        props.openModal(false);
                    }
                    else if (result.message === "already-exist") {
                        setSubmissionMessage("Sorry this outbound name is already in use. You can use another name")
                    }
                    else {
                        setSubmissionMessage("An error occured.")
                    }
                })
                .catch(error => console.log(error))
        }
    }


    const [stepOneFormData, setStepOneFormData] = useState({
        name: '',
        emaillist: '',
        emailnamelist: ''
    });

    const [stepOneFormDataErrors, setStepOneFormDataErrors] = useState({
        name: '',
        emaillist: [],
        emailnamelist: []
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

    const validateStepOneForm = (stepOneFormData, errors) => {
        const newErrors = { ...errors };
        let namecheck = false;
        let emailcheck = false;
        let emailnamecheck = false;
        if (stepOneFormData.name.trim() === '') {
            newErrors.name = 'Name is required.';
            namecheck = false;
        } else {
            errors.name = '';
            namecheck = true;
        }

        // Check if the 'emaillist' field is empty
        if (stepOneFormData.emaillist.trim() === '') {
            newErrors.emaillist = 'Email List is required.';
            emailcheck = false;
        } else {
            const emails = stepOneFormData.emaillist.split('\n');
            const invalidEmails = emails.filter((email) => !validateEmail(email.trim()));

            if (invalidEmails.length > 0) {
                newErrors.emaillist = 'Email List contains some invalid emails.\n' + invalidEmails;
                emailcheck = false;
            } else {
                errors.emaillist = ''; // Clear the error message if the 'emaillist' field is not empty
                emailcheck = true;
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
                newErrors.emailnamelist = 'Enduser name list contains some invalid characters.';
                emailnamecheck = false;
            } else {
                errors.emaillist = ''; // Clear the error message if the 'emaillist' field is not empty
                emailnamecheck = true;
            }
        }




        setStepOneFormDataErrors(newErrors)
        if ((emailcheck == true) && (namecheck == true) && (emailnamecheck == true)) {
            return true
        }
        else {
            return false
        }

    };


    const handleStepOneSubmit = (e) => {
        e.preventDefault();
        const isValid = validateStepOneForm(stepOneFormData, stepOneFormDataErrors);

        if (isValid) {

            const emails = stepOneFormData.emaillist.split('\n');
            setEmailListCount(emails.length)
            setEndUserEmails(emails)
            let endusernames = stepOneFormData.emailnamelist.split('\n');
            if (endusernames.length != emails.length) {
                const emptyarray = new Array(emails.length)
                endusernames = emptyarray
                alert("The name list does not match with the email list\n We have deleted all name list entries")
            }
            setEndUserNames(endusernames)

            setShowStepOne(false)


            setStepOneFormDataErrors({ name: '', emaillist: '', emailnamelist: "" })
        } else {

        }
    };


    return (
        <div className="form-holder">
            <h2 className="new-outbound-header">New Outbound {showStepone ? (<></>) : (<i onClick={() => { setShowStepOne(true); setSelectedEmails([]); setOutboundAllocation([]); }} className="fa-solid fa-circle-arrow-left"></i>)}  </h2>

            {showStepone ? (
                <form onSubmit={handleStepOneSubmit} id="frmOutboundDetails">

                    <div>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={stepOneFormData.name}
                            onChange={handleStepOneInputChange}
                            placeholder="outbound name"
                        />
                        <span className="error">{stepOneFormDataErrors.name}</span>
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
                            <p className="error">{stepOneFormDataErrors.emaillist}</p>
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
                            <span className="error">{stepOneFormDataErrors.emailnamelist}</span>
                        </div>
                    </div>
                    <button type="submit">Submit</button>
                </form>
            ) : (
                <div>
                    <button onClick={() => {
                       console.log(outboundAllocation)


                    }}>Click</button>
                    <h2>Allocate Emails</h2>
                    {submissionMessage && <p className='error'>{submissionMessage}</p>}
                    <p>You are to allocate a capacity of {emailListCount}</p>
                    <h6>Select Emails</h6>
                    <div>
                        <select onChange={handleSelectChange}>
                            <option value="">Select an email</option>
                            {outboundEmailList.map((email, index) => (
                                <option key={index} value={index}>
                                    {`${email.emailAddress} [${email.dailySendingCapacity} cap]`}
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
                                    <button onClick={() => handleRemoveEmail(index)}><i className="fa-solid fa-circle-xmark removeselectedemail"></i> </button>

                                </li>
                            ))}
                        </ul>
                    </div>

                    <button onClick={handleAddOutbound} className="add-outtbound-button">AddOutbound</button>
                </div>
            )}
        </div>
    )

}

export default AddOutbound