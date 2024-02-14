import React from 'react'
import { useState, useRef } from 'react';
import dataFetch from '../modules/dataFetch';
import { useDispatch, useSelector } from 'react-redux';

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
  const [selectedEmailIndex, setSelectedEmailIndex] = useState("")
  const [isFollowUp, setIsFollowUp] = useState(false)
  const [formData, setFormData] = useState({
    sender: "",
    reciever: '',
    subject: '',
    body: ''
  });

  let emailselector = useRef()
  async function handleSubmit(e) {
    e.preventDefault()
    if (validateInputs()) {
      setLoadingSending(true)

      let sendingEmail = formData.sender.emailAddress
      let sendingFrom = ""
      let reciever = formData.reciever
      let emailPassword = formData.sender.password
      let emailSignature = formData.sender.signature
      let senderName = formData.sender.senderName
      let emailSubject = formData.subject
      let emailBody = formData.body
      let messageID

      if (formData.sender.primaryEmail == false) { sendingFrom = formData.sender.parentEmail }
      else { sendingFrom = sendingEmail }

      let requestData = {}

      if (isFollowUp) {
        let emailAllocations = selectedOutbound.emailList[selectedEmailIndex].emailAllocations
        let recieverIndex; let recieverExist = false

        for (let i = 0; i < emailAllocations.length; i++) {
          if (emailAllocations[i] === reciever) {
            recieverIndex = i;
            recieverExist = true
          }
        }

        if (recieverExist == true) {
          messageID = selectedOutbound.emailList[selectedEmailIndex].threadIDs[recieverIndex] || ""
        }
        else {
          setFormEror("Could not find this email in the allocation list")
          return
        }

      }

      requestData = {
        sendingEmail: sendingEmail,
        sendingFrom: sendingFrom,
        reciever: reciever,
        emailPassword: emailPassword,
        emailSignature: emailSignature,
        senderName: senderName,
        emailSubject: emailSubject,
        emailBody: emailBody,
        thread: isFollowUp ? messageID : "",
        type: isFollowUp ? "followup" : "newemail"
      }




      const url = port + "/sendSingle"

      const response = await dataFetch(url, requestData)

      if (response.message = "sent") {
        setSendingResponse("sent");
        setTimeout(() => {
          props.openModal(false);
        }, 2000);
      }
      else { setLoadingSending(false); setSendingResponse("sendig failed"); props.openModal(false); }





    }
  }

  const handleEmailSelect = (e) => {
    const sendingEmail = uEmails[e.target.value];
    setSelectedEmailIndex(e.target.value)

    const name = "sender"
    setFormData({ ...formData, [name]: sendingEmail })
  }

  const handleOutboundSelect = (e) => {

    try {
      const outbound = uOutbounds[e.target.value]
      setSelectedOutbound(outbound)
      let outboundEmails = [];

      for (let allocation of outbound.emailList) {
        if (allocation.allocatedEmail == allocation.sendingFrom) {
          let emailData = uEmails.filter(email => email.emailAddress == allocation.allocatedEmail)
          outboundEmails.push(emailData[0])
        }
        else {
          let emailData = uEmails.filter(email => (email.emailAddress == allocation.allocatedEmail) && (email.parentEmail == allocation.sendingFrom))
          outboundEmails.push(emailData[0])
        }

        setoutboundEmails(outboundEmails)
        emailselector.current.disabled = false
      }
      console.log(outboundEmails)
    } catch (error) {
      emailselector.current.disabled = true
    }

  }

  function handleFollowUpChecked() {
    setIsFollowUp(!isFollowUp);
    if (!isFollowUp) {
      let taskList = uTasks.filter(task => task.outboundName == selectedOutbound.outboundName)
      console.log(taskList)
      let previousTask = taskList[taskList.length - 1]

      setFormData((prevFormData) => ({
        ...prevFormData,
        subject: previousTask.taskSubject
      }));



    }
    else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        subject: ""
      }));
    }
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

  };

  function validateInputs() {

    if (formData.sender == "") { setFormEror("Please select a sending email"); return false }
    else if (formData.reciever == "") { setFormEror("Please add receiver email"); return false }
    else if (formData.subject == "") { setFormEror("Please add a subject to the email"); return false }
    else if (formData.body == "") { setFormEror("Email body cannot be empty"); return false }
    else {
      setFormEror("")
      return true;
    }
  }






  return (
    <div className='form-holder'>
      <h2>Send Single</h2>

      <form onSubmit={handleSubmit}>
        {formError && <div className='form-error-container'><p className='error'><i class="fa-solid fa-circle-exclamation"></i> {formError}</p></div>}
        <div>

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

          <label>Send from:</label>
          <select onChange={handleEmailSelect} ref={emailselector} disabled={true}>

            {outboundEmails.map((email, index) => (
              <option className="mapped-option" key={index} value={index}>

                <div>
                  {email.primaryEmail == true ? (<div>{email.emailAddress}</div>) : (<div>{`${email.emailAddress}....${email.parentEmail}`}</div>)}
                  {/* {email} */}
                </div>

              </option>
            ))}
          </select>
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
          <input
            placeholder='reciever'
            type="text"
            id="reciever"
            name="reciever"
            value={formData.reciever}
            onChange={handleChange}
          />
        </div>
        <div>
          <textarea
            placeholder='body'
            rows={5}
            id="body"
            name="body"
            value={formData.body}
            onChange={handleChange}
          />
        </div>

        <button type="submit">{loadingSending ? (<i class="fa-solid fa-spinner fa-spin"></i>) : ("Send Email")}</button>
      </form>





    </div>
  )
}

export default SendSingle