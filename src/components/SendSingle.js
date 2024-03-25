import React from 'react'
import { useState, useRef } from 'react';
import dataFetch from '../modules/dataFetch';
import { useDispatch, useSelector } from 'react-redux';
import ReactQuill from 'react-quill';
// You can choose a different theme if you like
import 'react-quill/dist/quill.core.css';
import 'react-quill/dist/quill.snow.css'
import 'react-quill/dist/quill.bubble.css';
// import 'react-quill/dist/quill.crimson.css';

function SendSingle(props) {
  const port = ""
  const uEmails = useSelector((state) => state.userEmails.userEmails.emails);
  const uOutbounds = useSelector((state) => state.userOutbounds.userOutbounds.outbounds);
  const uTasks = useSelector((state) => state.userTasks.userTasks.task);

  const [loadingSending, setLoadingSending] = useState(false)

  const [formError, setFormEror] = useState("")
  const [sendingResponse, setSendingResponse] = useState("")
  const [outboundEmails, setoutboundEmails] = useState([])
  const [selectedOutbound, setSelectedOutbound] = useState({})
  const [selectedEmail, setSelectedEmail] = useState(undefined)
  const [isFollowUp, setIsFollowUp] = useState(false)
  const [selectedOption, setSelectedOption] = useState('text');
  const [formData, setFormData] = useState({
    sender: "",
    reciever: '',
    recieverName: "",
    subject: '',
    body: ''
  });

  let emailselector = useRef()

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      body: '',
    }));
  };


  function findSenderEmail() {
    // console.log(selectedOutbound)
    let senderEmail = {
      allocatedEmail: "",
      sendingFrom: "",
      thread: ""

    }

    outerLoop:
    for (let i = 0; i < selectedOutbound.emailList.length; i++) {
      for (let j = 0; j < selectedOutbound.emailList[i].emailAllocations.length; j++) {
        if (selectedOutbound.emailList[i].emailAllocations[j] == formData.reciever) {
          senderEmail.allocatedEmail = selectedOutbound.emailList[i].allocatedEmail
          senderEmail.sendingFrom = selectedOutbound.emailList[i].sendingFrom
          senderEmail.thread = selectedOutbound.emailList[i].threadIDs[j]
          break outerLoop
        }
      }
    }

    return senderEmail
  }

  function getEmailData(allocatedEmail, sendingEmail) {
    //let email = []
    if (allocatedEmail === sendingEmail) {
      return uEmails.filter((email) => email.emailAddress == allocatedEmail)
    }
    else {
      return uEmails.filter((email) => email.emailAddress == allocatedEmail && email.parentEmail == sendingEmail)
    }

  }

  async function handleSubmit2(e) {
    e.preventDefault()
    let request = {
      sendingEmail: "",
      sendingFrom: "",
      senderName: "",
      reciever: "",
      emailPassword: "",
      emailSignature: "",
      emailSubject: "",
      emailBody: "",
      thread: "",
      type: "",
      bodyType: selectedOption
    }

    if (validateInputs()) {
      setLoadingSending(true)

      if (isFollowUp == true) {
        let senderEmail = findSenderEmail()
        console.log(senderEmail)
        if (senderEmail.allocatedEmail == '') {
          setFormEror("This reciever was not found in the database")
          setLoadingSending(false)
          return
        }
        else {
          const EmailData = getEmailData(senderEmail.allocatedEmail, senderEmail.sendingFrom)
          request.sendingEmail = senderEmail.allocatedEmail
          request.sendingFrom = senderEmail.sendingFrom
          request.thread = senderEmail.thread
          request.senderName = EmailData[0].senderName
          request.reciever = formData.reciever
          request.emailPassword = EmailData[0].password
          request.emailSignature = EmailData[0].signature
          request.emailSubject = formData.subject
          request.emailBody = formData.body
          request.type = 'followup'

        }
        console.log(request)
      }
      else {
        request.sendingEmail = selectedEmail.emailAddress
        request.sendingFrom = selectedEmail.primaryEmail ? selectedEmail.emailAddress : selectedEmail.parentEmail
        request.thread = ""
        request.senderName = selectedEmail.senderName
        request.reciever = formData.reciever
        request.emailPassword = selectedEmail.password
        request.emailSignature = selectedEmail.signature
        request.emailSubject = formData.subject
        request.emailBody = formData.body
        request.type = "newemail"
      }
      const url = port + "/sendSingle"
      const response = await dataFetch(url, request)
      if (response.message = "sent") {
        setSendingResponse("sent");
        setTimeout(() => {
          props.openModal(false);
        }, 2000);
      }
      else { setLoadingSending(false); setSendingResponse("sendig failed"); props.openModal(false); }
      console.log(request)
    }
    else {
      setLoadingSending(false)
      return
    }

  }

  const handleEmailSelect = (e) => {
    console.log("index changed")
    setSelectedEmail(uEmails[e.target.value])
    console.log(selectedEmail)

  }

  const handleOutboundSelect = (e) => {
    const outbound = uOutbounds[e.target.value]
    setSelectedOutbound(outbound)
    setPreviousSubject(outbound.outboundName)
  }


  function setPreviousSubject(OutboundName) {
    let taskList = uTasks.filter(task => task.outboundName == OutboundName)
    console.log(taskList)
    let previousTask = taskList[taskList.length - 1]

    setFormData((prevFormData) => ({
      ...prevFormData,
      subject: previousTask.taskSubject
    }));
  }

  function handleFollowUpChecked() {
    setFormData((prevFormData) => ({
      ...prevFormData,
      subject: ""
    }));
    setIsFollowUp((prevState) => { return !prevState })
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

  };

  function validateInputs() {
    setFormEror("")
    console.log(isFollowUp, selectedEmail)
    if (!isFollowUp && selectedEmail == undefined) { setFormEror("Please select a sending email"); return false }
    else if (formData.reciever == "") { setFormEror("Please add receiver email"); return false }
    else if (formData.subject == "") { setFormEror("Please add a subject to the email"); return false }
    else if (formData.body == "") { setFormEror("Email body cannot be empty"); return false }
    else {
      setFormEror("")
      return true;
    }
  }

  const handleEditorChange = (value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      body: value,
    }));

  };




  return (
    <div className='form-holder'>
      <p>{isFollowUp.toString()}</p>
      <h2>Send Single Email</h2>

      <form onSubmit={handleSubmit2}>
        {formError && <div className='form-error-container'><p className='error'><i class="fa-solid fa-circle-exclamation"></i> {formError}</p></div>}
        <div>

          <div>
            <label className='choice-lable'>
              <input
                type="checkbox"
                checked={isFollowUp}
                onChange={handleFollowUpChecked}
              />
              <p>Follow Up</p>
            </label>
          </div>

          <div>
            {
              isFollowUp ? (
                <select onChange={handleOutboundSelect} >
                  <option value="">Select Outbound</option>
                  {uOutbounds.map((outbound, index) => (
                    <option className="mapped-option" key={index} value={index}>

                      <div>
                        {outbound.outboundName}
                      </div>

                    </option>
                  ))}
                </select>
              ) :

                (
                  <div>

                    <select onChange={handleEmailSelect} ref={emailselector} >
                      <option value="">Select Email</option>
                      {uEmails.map((email, index) => (
                        <option className="mapped-option" key={index} value={index}>

                          <div>
                            {email.primaryEmail == true ? (<div>{email.emailAddress}</div>) : (<div>{`${email.emailAddress}....${email.parentEmail}`}</div>)}
                            {/* {email} */}
                          </div>

                        </option>
                      ))}
                    </select>

                  </div>
                )
            }
          </div>


        </div>
        <div>
          <input
            placeholder='reciever email'
            type="text"
            id="reciever"
            name="reciever"
            value={formData.reciever}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            placeholder='Subject'
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
          />
        </div>


        <div>


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













            {selectedOption === 'text' ? (
              <div>
                <textarea
                  placeholder='email body'
                  id="body"
                  name="body"
                  value={formData.body}
                  onChange={handleChange}
                  rows={5}
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











          </div>
        </div>



        <button type="submit">{loadingSending ? (<i class="fa-solid fa-spinner fa-spin"></i>) : ("Send Email")}</button>
      </form >





    </div >
  )
}

export default SendSingle