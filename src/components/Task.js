import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import dataFetch from '../modules/dataFetch';
import "../styles/Task.css"
import { setUserOutbounds } from '../modules/redux/userOutboundsSlice';
import { setUserTasks } from '../modules/redux/userTasksSlice';
import useDataUpdater from '../modules/useDataUpdater';
import ReactQuill from 'react-quill';

// You can choose a different theme if you like
import 'react-quill/dist/quill.core.css';
import 'react-quill/dist/quill.snow.css'
import 'react-quill/dist/quill.bubble.css';
// import 'react-quill/dist/quill.crimson.css';



export default function Task(props) {
    const port = ""
    const [taskContentError, setTaskContentError] = useState("")
    const [loadingAddTask, setLoadingAddTask] = useState(false)

    const { refreshUserOutbounds } = useDataUpdater()
    const { refreshUserEmails } = useDataUpdater()
    const { refreshUserTasks } = useDataUpdater()

    const dispatch = useDispatch()
    const user = useSelector((state) => state.user.userData);

    const uOutbounds = useSelector((state) => state.userOutbounds.userOutbounds.outbounds);
    const uEmails = useSelector((state) => state.userEmails.userEmails.emails);
    const uTasks = useSelector((state) => state.userTasks.userTasks.task);


    let backbutton = useRef();
    const [currentOutbound, setCurrentOutbound] = useState(props.data)
    const [selectedOption, setSelectedOption] = useState('text');
    const [content, setContent] = useState('');//rich text editor content

    useEffect(() => {
        backbutton.current.style.display = "none";
        refreshUserOutbounds({ ownerAccount: user.email })
        refreshUserEmails({ ownerAccount: user.email })
        refreshUserTasks({ ownerAccount: user.email })
        getOutboundData();

    }, [])

    //get the outbound
    function getOutboundData() {
        //get outbound data
        // const result = uOutbounds.find(outbound => outbound.outboundName === props.outboundName)


        //1 GET OUTBOUND EMAILS
        let emailsAdresses = [];
        let sendingAdresses = []
        for (let i = 0; i < props.data.emailList.length; i++) {
            console.log(props.data.emailList[i].allocatedEmail)
            emailsAdresses.push(props.data.emailList[i].allocatedEmail)
            sendingAdresses.push(props.data.emailList[i].sendingFrom)
        }
        console.log(sendingAdresses)

        //2 GET OUTBOUND EMAILS
        const EmailData = [];
        for (let i = 0; i < uEmails.length; i++) {
            for (let j = 0; j < emailsAdresses.length; j++) {
                if ((uEmails[i].emailAddress === emailsAdresses[j]) && (uEmails[i].primaryEmail == true)) {
                    EmailData.push(uEmails[i])
                }
                else if (((uEmails[i].emailAddress === emailsAdresses[j]) && (uEmails[i].primaryEmail !== true)) && (uEmails[i].parentEmail == sendingAdresses[j])) {
                    EmailData.push(uEmails[i])
                }
            }
        }

        //3 GET ASSIGNED DATES

        let secondaryEmails = []
        let disableddates = []
        for (let j = 0; j < EmailData.length; j++) {
            let k = EmailData[j];

            if (k.primaryEmail == true) {
                //getDates from primary emails
                for (let l = 0; l < k.daysAssigned.length; l++) {
                    disableddates.push(k.daysAssigned[l][0])
                }
            }
            else {
                secondaryEmails.push(k)
            }
        }

        //get dates from the primary emails of the secondary emails
        if (secondaryEmails.length > 0) {
            console.log("Secondary Emails: " + secondaryEmails.length)
            for (let i = 0; i < secondaryEmails.length; i++) {
                for (let j = 0; j < uEmails.length; j++) {
                    if (uEmails[j].emailAddress === secondaryEmails[i].parentEmail) {
                        for (let l = 0; l < uEmails[j].daysAssigned.length; l++) {
                            disableddates.push(uEmails[j].daysAssigned[l][0])
                        }
                    }
                }
            }
        }



        console.log("Initial Disabled Dates");
        console.log(disabledDates);
        console.log("current disabled dates")
        setDisabledDates([...disabledDates, ...disableddates])
        console.log(disabledDates);

    }

    const [showDate, setShowDate] = useState(true)
    const [dateSelectionError, setDatSelectionError] = useState("");
    const [sendingRateError, setSendingRateError] = useState("");

    const currentDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0] + 'T00:00';
    const [sendingDay, setSendingDay] = useState()
    const [sendingTime, setSendingTime] = useState()
    const [selectedDate, setSelectedDate] = useState('');
    const [sendingRate, setSendingRate] = useState(0)
    const [disabledDates, setDisabledDates] = useState(["2023-10-18T00:00", "2023-10-27T00:00", "2023-10-25T00:00"]); // Replace with your actual disabled dates
    // const disabledDates = ["2023-10-20T12:00", "2023-10-25T15:30", "2023-11-05T10:00"];

    const maxDate = new Date(Math.max(...disabledDates.map(date => new Date(date))))
    const formattedMaxDate = maxDate.toISOString().slice(0, 16);

    const handleDateChange = (e) => {
        const newSelectedDate = e.target.value;
        setSelectedDate(newSelectedDate);
    }


    const [formData, setFormData] = useState({
        subject: '',
        greeting: '',
        body: '',
    });


    const validateForm = () => {

        if (formData.subject.trim() === '') {

            setTaskContentError("Subject is required")
            return false
        }
        else if (formData.greeting.trim() === '') {

            setTaskContentError("Greeting is required")
            return false
        }
        else if (formData.body.trim() === '') {

            setTaskContentError("Body is required")
            return false
        }
        else {
            return true
        }


    };

    const handleSubmit = async (e) => {
        e.preventDefault();



        if (validateForm()) {
            setLoadingAddTask(true)
            const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            let taskbody = formData.body
            let taskgreeting = formData.greeting.trim().replace(/[^a-zA-Z0-9\s]/g, '')



            // if (selectedOption == "html") {
            //     let newTaskbody = ""
            //     let newbody = [];
            //     let tempDiv = document.createElement('div');
            //     tempDiv.innerHTML = taskbody;
            //     let paragraphs = tempDiv.getElementsByTagName('p');
            //     for (let i = 0; i < paragraphs.length; i++) {
            //         newbody.push(paragraphs[i].innerText);
            //     }

            //     let newbody2 = newbody.filter(element => element != "")
            //     for (let i = 0; i < newbody2.length; i++) {
            //         newTaskbody += `<p>${newbody2[i]}</p>`
            //     }

            //     taskbody = newTaskbody

            // }


            const requestData = {
                ownerAccount: user.email,
                outboundName: props.data.outboundName,
                taskName: `${props.data.outboundName}>task>${props.data.tasks + 1}`,
                taskDate: sendingDay,
                taskTime: sendingTime,
                taskSendingRate: sendingRate,
                taskSubject: formData.subject,
                taskGreeting: taskgreeting,
                taskBody: taskbody,
                taskBodyType: selectedOption == "text" ? "text" : "html",
                timeZone: userTimeZone
            }

            let url = port + '/registertask'
            let result = await dataFetch(url, requestData)
            if (result.message == "registrationComplete") {
                // UPDATE SENDING DATES
                // Get today's date
                const today = new Date();
                // Extract year, month, and day
                const year = today.getFullYear();
                const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are zero-based
                const day = today.getDate().toString().padStart(2, '0');
                // Create the formatted date string
                const formattedDate = `${year}-${month}-${day}`;

                console.log("formatted date" + formattedDate);

                //GET OUTBOUND EMAILS 
                url = port + "/updatedaysassigned"
                for (let i = 0; i < props.data.emailList.length; i++) {
                    let emailToUpdate = props.data.emailList[i].sendingFrom
                    const requestData = {
                        ownerAccount: user.email,
                        email: emailToUpdate,
                        day: formattedDate,
                        taskName: `${props.data.outboundName}>task>${props.data.tasks + 1}`
                    }
                    dataFetch(url, requestData)
                        .then()
                        .catch(error => { console.log(error) })
                }


                refreshUserOutbounds({ ownerAccount: user.email })
                refreshUserEmails({ ownerAccount: user.email })
                refreshUserTasks({ ownerAccount: user.email })
                props.openModal(false);
            }
            else {
                setTaskContentError("An error occured. Check internet connection")
                setLoadingAddTask(false)

            }


        } else {
            // Form has errors, do not submit
            setLoadingAddTask(false)

        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        setFormData((prevFormData) => ({
            ...prevFormData,
            body: '',
        }));
    };

    const handleEditorChange = (value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            body: value,
        }));

    };



    return (
        <div className='form-holder task'>
            <h2 className="new-outbound-header">New Task <i ref={backbutton} onClick={() => { setShowDate(true); backbutton.current.style.display = "none"; }} className="fa-solid fa-circle-arrow-left"></i> </h2>

            <div className='pop-sub-title' >
                <p>For: <b>{props.data.outboundName}</b> Task: {props.data.tasks + 1}</p>
            </div>
            {
                showDate ? (
                    <div className='date-select'>


                        {(dateSelectionError || sendingRateError) && <div className='form-error-container'><p className='error'><i class="fa-solid fa-circle-exclamation"></i> {(dateSelectionError || sendingRateError)}</p></div>}
                        <h3></h3>
                        <label htmlFor="datePicker">Select a date:</label>
                        <input
                            type="datetime-local"
                            id="datePicker"
                            name="datePicker"
                            min={formattedDate}
                            value={selectedDate}
                            // max={formattedMaxDate}
                            onChange={handleDateChange}


                        />
                        <p>Sending speed in seconds:</p>
                        <input
                            type="number"
                            value={sendingRate}
                            onChange={(e) => { setSendingRate(e.target.value) }}
                        />
                        <button className='site-button-thin' onClick={() => {

                            if (selectedDate == "") {
                                setDatSelectionError("Please choose a date")
                            }
                            else if (sendingRate == "" || sendingRate == null || sendingRate <= 0) {
                                setSendingRateError("sending rate cannot be less than orr equal to 0")
                            }

                            else {
                                getOutboundData()
                                var date_str = selectedDate.split('T')[0];
                                var time_str = selectedDate.split('T')[1];

                                //check if selected date is disabled
                                let check = false
                                const checkString = date_str + "T00:00"
                                console.log("Check string = " + checkString)
                                for (let i = 0; i < disabledDates.length; i++) {
                                    if (disabledDates[i] == date_str) {
                                        check = true;
                                    }
                                }


                                if (check) {
                                    //setDatSelectionError("One of your email is scheduled to perform a task on the selected date.\nPlease choose a different date")
                                    //validate sending capacity
                                    //get ssending email arrays and their capacity
                                    let canSend = true;
                                    let defaultingEmail = ""
                                    let sendingEmailArray = [];
                                    let allocatedCapacity = []
                                    for (let i = 0; i < props.data.emailList.length; i++) {
                                        sendingEmailArray.push(props.data.emailList[i].sendingFrom)
                                        allocatedCapacity.push(props.data.emailList[i].emailAllocations.length)
                                    }

                                    // compapare sending dates
                                    Loop1: for (let i = 0; i < uEmails.length; i++) {
                                        for (let j = 0; j < sendingEmailArray.length; j++) {
                                            if (uEmails[i].emailAddress == sendingEmailArray[j]) {
                                                let hasSelectedDate = false;
                                                let previousAssingedTaskNames = []
                                                for (let k = 0; k < uEmails[i].daysAssigned.length; k++) {
                                                    if (uEmails[i].daysAssigned[k][0] == date_str) {
                                                        hasSelectedDate = true
                                                        previousAssingedTaskNames.push(uEmails[i].daysAssigned[k][1])
                                                    }
                                                }
                                                if (hasSelectedDate) {
                                                    console.log(previousAssingedTaskNames)
                                                    // get task details
                                                    let previousTasks = []
                                                    let OverAllPreviousCapacities = 0;
                                                    for (let l = 0; l < previousAssingedTaskNames.length; l++) {
                                                        for (let indx = 0; indx < uTasks.length; indx++) {
                                                            if (uTasks[indx].taskName == previousAssingedTaskNames[l]) {
                                                                previousTasks.push(uTasks[indx])
                                                            }
                                                        }
                                                    }

                                                    console.log(previousTasks)

                                                    if (previousTasks.length > 0) {

                                                        for (let indexI = 0; indexI < previousTasks.length; indexI++) {
                                                            let previousOutboundName = previousTasks[indexI].outboundName
                                                            let previousAssignedOutbound = uOutbounds.filter((item) => item.outboundName == previousOutboundName)
                                                            let previousAssignedCapacity = 0;
                                                            if (previousAssignedOutbound.length > 0) {
                                                                let previousAssignedAllocation = previousAssignedOutbound[0].emailList.filter((item) => item.sendingFrom == sendingEmailArray[j])
                                                                previousAssignedCapacity = previousAssignedAllocation[0].emailAllocations.length
                                                                OverAllPreviousCapacities += previousAssignedCapacity;
                                                            } else {
                                                                previousAssignedCapacity += 0;
                                                                OverAllPreviousCapacities += previousAssignedCapacity;
                                                            }
                                                        }

                                                    }
                                                    else {
                                                        OverAllPreviousCapacities += 0;
                                                    }


                                                    console.log(`
                                                         OVERALL PREVIOUS CAPACITIES FOR THIS DAY: ${OverAllPreviousCapacities}\n
                                                         ALLOCATED CAPACITY FOR THIS TASK: ${allocatedCapacity[j]}\n
                                                         DAILY SENDING CAPACITY: ${uEmails[i].dailySendingCapacity}\n
                                                         `)

                                                    if (uEmails[i].dailySendingCapacity < (OverAllPreviousCapacities + allocatedCapacity[j])) {
                                                        canSend = false;
                                                        defaultingEmail = sendingEmailArray[j];
                                                        break Loop1;
                                                    }

                                                }
                                            }
                                        }
                                    }

                                    if (!canSend) {
                                        setDatSelectionError("You cannot assign more tasks on this date because the daily sending capacity of " + defaultingEmail + " will be exceeded")
                                    }
                                    else {
                                        setSendingDay(date_str)
                                        setSendingTime(time_str)
                                        backbutton.current.style.display = "block"
                                        console.log(props.data.tasks + 1)
                                        setShowDate(false)
                                    }



                                }
                                else if (sendingRate <= 0) {
                                    setDatSelectionError("Sending speed should be greater than 0")
                                }
                                else {
                                    setSendingDay(date_str)
                                    setSendingTime(time_str)
                                    backbutton.current.style.display = "block"
                                    console.log(props.data.tasks + 1)
                                    setShowDate(false)
                                }
                            }

                        }}>Next</button>
                    </div>
                )
                    :
                    (
                        <div>
                            {taskContentError && <div className='form-error-container'><p className='error'><i class="fa-solid fa-circle-exclamation"></i> {taskContentError}</p></div>}
                            <form onSubmit={handleSubmit}>
                                <div>

                                    <input
                                        placeholder='email subject'
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                    />

                                </div>

                                <div>

                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <input
                                            placeholder='Hi, Hello, Good Morning'
                                            type="text"
                                            id="greeting"
                                            name="greeting"
                                            value={formData.greeting}
                                            onChange={handleInputChange}
                                            style={{ width: "200px" }}
                                        />
                                        , [Name]
                                    </div>

                                </div>


                                <div className='bodyOptionContainer'>
                                    <p>Body</p>
                                    <div className='chooseTextType'>
                                        <div>
                                            <label>
                                                <input
                                                    type="radio"
                                                    value="text"
                                                    checked={selectedOption === 'text'}
                                                    onChange={handleOptionChange}
                                                />
                                                Text
                                            </label>
                                        </div>

                                        <div>
                                            <label>
                                                <input
                                                    type="radio"
                                                    value="html"
                                                    checked={selectedOption === 'html'}
                                                    onChange={handleOptionChange}
                                                />
                                                HTML
                                            </label>
                                        </div>

                                    </div>
                                </div>

                                {selectedOption === 'text' ? (
                                    <div>

                                        <textarea
                                            placeholder='email body'
                                            id="body"
                                            name="body"
                                            value={formData.body}
                                            onChange={handleInputChange}
                                            rows={8}
                                        />


                                    </div>
                                ) :
                                    (
                                        <div className="my-rich-text-editor">
                                            <ReactQuill
                                                theme="snow"
                                                value={formData.body}
                                                onChange={handleEditorChange}
                                            />

                                        </div>
                                    )}





                                {"[Email Signature]"}
                                <button type="submit">{loadingAddTask ? (<i class="fa-solid fa-spinner fa-spin"></i>) : ("Add New Task")}</button>
                            </form>



                        </div>
                    )
            }




        </div>
    )
}
