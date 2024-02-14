import React from 'react'
import { useState } from 'react';
import dataFetch from '../modules/dataFetch';
import { useDispatch, useSelector } from 'react-redux';

function SendSingle(props) {
  const port = ""
  const uEmails = useSelector((state) => state.userEmails.userEmails.emails);
  const [loadingSending, setLoadingSending] = useState(false)

  const [formError, setFormEror] = useState("")
  const [sendingResponse, setSendingResponse] = useState("")

  const [formData, setFormData] = useState({
    sender: "",
    reciever: '',
    subject: '',
    body: ''
  });

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

      if (formData.sender.primaryEmail == false) { sendingFrom = formData.sender.parentEmail }
      else { sendingFrom = sendingEmail }

      const requestData = {
        sendingEmail: sendingEmail,
        sendingFrom: sendingFrom,
        reciever: reciever,
        emailPassword: emailPassword,
        emailSignature: emailSignature,
        senderName: senderName,
        emailSubject: emailSubject,
        emailBody: emailBody
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

  const handleSelectChange = (e) => {
    const sendingEmail = uEmails[e.target.value];
    const name = "sender"
    setFormData({ ...formData, [name]: sendingEmail })
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
          <select onChange={handleSelectChange}>
            <option value="">Select sending email</option>
            {uEmails.map((email, index) => (
              <option className="mapped-option" key={index} value={index}>

                <div>
                  {email.primaryEmail == true ? (<div>{email.emailAddress}</div>) : (<div>{`${email.emailAddress}....${email.parentEmail}`}</div>)}
                </div>

              </option>
            ))}
          </select>
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