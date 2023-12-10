import React, { useState, useRef, useEffect } from 'react';
//import countriesData from './countriesData'; // Import the dataset for countries, states, and cities
import '../styles/Registration.css';
import Dashboard from './Dashboard';
import dataFetch from '../modules/dataFetch';
import registerImage from "../images/register.png"
import Modal from '../components/Modal';
import TAndC from '../components/TAndC';

const RegistrationPage = () => {
  const port = "http://localhost:4000"
  const firstName = useRef(null);
  const lastName = useRef(null);
  const email = useRef(null);
  const password = useRef(null);
  const confirmPassword = useRef(null);
  const regButton = useRef(null);
  const regConfirmDiv = useRef(null);
  const [isTandCisChecked, setTandC] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalChildren, setModalChildren] = useState(null);

  const [formError, setFormError] = useState("");
  const [validationCodeError, setValidationCodeError] = useState("")
  const [loadingRegEmail, setLoadingRegEmail] = useState(false)
  const [loadingRegUser, setLoadingRegUser] = useState(false)

  const [generatedCode, setGeneratedCode] = useState("");

  const [regCodetime, setRegCodeTime] = useState(0); // 5 seconds
  let validationCode = "";
  const [emailValidationCode, setEmailValidationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);





  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };







  function disableRegInputs() {
    firstName.current.disabled = true;
    lastName.current.disabled = true;
    email.current.disabled = true;
    password.current.disabled = true;
    confirmPassword.current.disabled = true;

  }
  function enableRegInputs() {
    firstName.current.disabled = false;
    lastName.current.disabled = false;
    email.current.disabled = false;
    password.current.disabled = false;
    confirmPassword.current.disabled = false;

  }










  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',

  });
  // const [validationCode, setValidationCode] = useState('');







  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value.trim() // Trim the value to remove leading/trailing spaces
    }));
  };

  const handleSendCode = async () => {

    if (formData.firstName.trim().length === 0 || formData.lastName.trim().length === 0) {
      setFormError('First name and last name cannot be empty!');
      return;
    }
    else if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    else if (formData.password.trim().length < 6 || formData.confirmPassword.trim().length < 6) {
      setFormError('Passwords length should be 6 or more characters');
      return;
    }

    else if (isTandCisChecked == false) {
      setFormError('Read and accept the terms and condition');
      return;
    }
    else {
      setLoadingRegEmail(true);
      disableRegInputs()

      const requestData = {
        email: formData.email,
      };
      const url = port + '/finduser';
      await dataFetch(url, requestData)
        .then((result) => {
          if (result.message == "found") {

            setFormError('This email is registered. Please Login');
            setLoadingRegEmail(false);
            enableRegInputs()

          }
          else {

            const randomCode = generateRandomCode()
            setGeneratedCode(randomCode);
            // const url = port + '/sendregisterationcode'; // Replace with your actual API endpoint
            const requestData = {
              recieverName: formData.firstName,
              reciverEmail: formData.email,
              code: randomCode
            };


            // const requestData = {
            //   reciverName: formData.firstName,
            //   recieverEmail: formData.email,
            //   code: randomCode
            // }


            console.log(requestData)
            let url = port + '/sendregisterationcode'; // Replace with your actual API endpoint
            console.log(url)
            dataFetch(url, requestData)
              .then((result) => {

                if (result.message === "email sent") {
                  setLoadingRegEmail(false);
                  setIsCodeSent(true)
                  setFormError("")
                  setValidationCodeError("")
                  validationCode = ""

                }
                else {
                  setLoadingRegEmail(false);
                  //setFormError("An error occured while sending verification email")
                  enableRegInputs()
                  setFormError(result)
                }

              })


              .catch(error => {
                setFormError("An error occured while sending verification email")

              })






            // dataFetch(url, requestData)
            //  .then((result) => {
            // if (result.message === "email sent") {
            //   setLoadingRegEmail(false);
            //   setIsCodeSent(true)
            //   setFormError("")
            //   setValidationCodeError("")
            //   validationCode = ""

            // }
            // else {
            //   setLoadingRegEmail(false);
            //   //setFormError("An error occured while sending verification email")
            //   enableRegInputs()
            //   setFormError(result.message)
            // }
            // })
            // .catch(error => { setFormError("An error occured while sending verification email") })

            //send code



          }
        })
        .catch(error => { })




    }
  };

  // ===================================REGISTER USER====================================




  async function registerNewUser() {
    setLoadingRegUser(true);
    if (formData.verificationCode.trim().length == 6) {
      if (formData.verificationCode == generatedCode) {
        setValidationCodeError("")
        const requestData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        };
        const url = port + '/register';
        const result = await dataFetch(url, requestData)
        if (result.message == "registrationComplete") {
          //setLoadingRegUser(false)
          setRegistrationComplete(true)
          setTimeout(() => {

            window.location.assign("/login")
          }, 1000);

        }


      }
      else {
        setLoadingRegUser(false)
        setValidationCodeError("Incorrect code")
      }
    }
    else {
      setLoadingRegUser(false)
      setValidationCodeError("Invalid code")
    }
  }

  const generateRandomCode = () => {
    // Generate a random 6-character validation code
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };
  // =================================================================




  return (
    <div className='Section'>
      <div className='section-container'>
        <div className='section-container-left'>
          <h1>
            Join us today!
          </h1>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.

          </p>

          <img src={registerImage} alt='reg-image' />



        </div>
        <div className='section-container-right'>
          <form onSubmit={(event) => { event.preventDefault(); }}>
            {!isCodeSent ? (
              <div>
                {/* <div>{formError && <p className='error'>{formError}</p>}</div> */}

                {formError && <div className='form-error-container'><p className='error'><i class="fa-solid fa-circle-exclamation"></i> {formError}</p></div>}

                <div>
                  <label htmlFor="firstName">First Name:</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    ref={firstName}
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName">Last Name:</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    ref={lastName}
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    ref={email}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password">Password:</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    ref={password}
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword">Confirm Password:</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    ref={confirmPassword}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className='confirm-buttons'   >



                  <label className='choice-lable'>
                    <input type='checkbox'
                      name="terms"
                      checked={isTandCisChecked}
                      onChange={
                        () => {

                          setTandC(!isTandCisChecked);

                        }
                      }


                    />I have read the <p onClick={() => {
                      setModalChildren(<TAndC />)
                      setShowModal(true);
                    }}>Terms and Conditions</p>
                  </label>


                  <button type="button" onClick={() => {
                    if (!loadingRegEmail) { handleSendCode() }
                  }}>
                    {loadingRegEmail ? <i className="fa-solid fa-spinner fa-spin spinner"></i> : <p>Next</p>}</button>

                </div>

              </div>
            ) : (
              <div >

                {validationCodeError && <div className='form-error-container'><p className='error'><i class="fa-solid fa-circle-exclamation"></i> {validationCodeError}</p></div>}
                <div className='validation-code-div'>

                  <i class="fa-regular fa-circle-left" onClick={() => {
                    setIsCodeSent(false)
                  }}></i>
                  {registrationComplete ? (<p><i class="fa-regular fa-circle-check reg-complete"></i> Registration completed</p>) : (<p htmlFor="validationCode"><i className="fa-regular fa-bell fa-shake"></i>  Verification code sent </p>)}

                  <div>

                    <input
                      type="text"
                      id="verificationcode"
                      name="verificationCode"
                      value={formData.verificationCode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <button type="button" onClick={() => {
                  if (!loadingRegUser) { registerNewUser() }
                }} >
                  {loadingRegUser ? <i className="fa-solid fa-spinner fa-spin spinner"></i> : <p> Complete Registration</p>}</button>

              </div>
            )}


          </form>

          <div className='login-opt'>
            <p>Already have an account? <strong onClick={() => { window.location.assign("/login") }}>Login</strong></p>
          </div>
        </div>
      </div >
      {showModal ? (<Modal header="Add Account" children={modalChildren} show={setShowModal}></Modal>) : (<></>)}
    </div >
  );
};




export default RegistrationPage;
