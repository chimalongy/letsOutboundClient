import React, { useState } from 'react';
import '../styles/Login.css'; // Import CSS file for styling
import dataFetch from '../modules/dataFetch';
import { login } from "../modules/redux/userDataSlice"
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';



import { setUserEmails } from '../modules/redux/userEmailsSlice';
import { setUserOutbounds } from '../modules/redux/userOutboundsSlice';
import { setUserTasks } from '../modules/redux/userTasksSlice';
import useDataUpdater from '../modules/useDataUpdater';

const Login = () => {
  const port = ""
  const dispatch = useDispatch();
  const { refreshUserOutbounds } = useDataUpdater()
  const { refreshUserEmails } = useDataUpdater()
  const { refreshUserTasks } = useDataUpdater()
  const user = useSelector((state) => state.user.userData);
  const uEmails = useSelector((state) => state.userEmails.userEmails);
  const navigate = useNavigate()




  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [forgotPassword, showForgotPassword] = useState(false)

  const [retrivePassword, setRetrivePassword] = useState("");
  const [retrivePasswordError, setRetrivePasswordError] = useState("");
  const [retriveCodeSent, setRetriveCodeSent] = useState(false);

  const [updatePasswordCode, setUpdatePasswordCode] = useState("");
  const [updatePasswordCodeError, setUpdatePasswordCodeError] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [updatePasswordCorrect, setUpdatePasswordCorrect] = useState(false)

  const [generatedCode, setGeneratedCode] = useState("");

  const [loadingUpdateCode, setLoadingUpdateCode] = useState(false)
  const [loadingUpdatePassword, setLoadingUpdatePassword] = useState(false)
  const [loadingLogin, setLoadingLogin] = useState(false)
  const [passwordUpdated, setPasswordUpdated] = useState(false)


  const [loginError, setLoginError] = useState("")
  var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const generateRandomCode = () => {
    // Generate a random 6-character validation code
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };



  const validateForm = () => {
    const errors = {};

    if (!email.trim()) {

      setLoginError("Email or Username is required")
      return false;
    }

    if (!password) {

      setLoginError("Password is required")
      return false;

    }
    else if (password.trim().length < 6) {
      setLoginError("Password should be 6 or more characters")
      return false;
    }

    return true
  };



  function sendverificationcode() {

    setLoadingUpdateCode(true)
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if ((retrivePassword.trim().length < 1) || (!emailPattern.test(retrivePassword))) {
      setRetrivePasswordError("Invalid email");
      setLoadingUpdateCode(false)

    }//HEEREE
    else {
      setRetrivePasswordError("");
      // CHECK IF USER EXIST
      const requestData = {
        email: retrivePassword
      }
      const url = 'http://localhost:4000/finduser';
      dataFetch(url, requestData)
        .then((result) => {
          if (result.message === "found") {
            //GENERATE/ SEND CODE
            const randomCode = generateRandomCode()
            setGeneratedCode(randomCode);
            const requestData = {
              recieverEmail: retrivePassword,
              code: randomCode
            }
            const url = 'http://localhost:4000/sendUpdatePasswordCode';
            dataFetch(url, requestData)
              .then((result) => {
                if (result.message === "email-sent") {
                  //switch

                  setRetriveCodeSent(true)
                  setLoadingUpdateCode(false)
                }
                else {
                  setLoadingUpdateCode(false)
                  setRetrivePasswordError("We couldnt send code to this email")
                }

              })
              .catch(error => { setRetrivePasswordError("An error occured while sending verification email"); setLoadingUpdateCode(false) })



          }
          else if (result.message === "not-found") {
            setRetrivePasswordError("This email is not registered");
            setLoadingUpdateCode(false)
          }
          else {
            setRetrivePasswordError("An error occured. Check your internet connection");
            setLoadingUpdateCode(false)
          }

        })
        .catch(error => {
          setRetrivePasswordError("An error occured while sending verification email")
          setLoadingUpdateCode(false)

        })

    }
  }

  function saveandupdatenewpassword() {
    setLoadingUpdatePassword(true)
    if (!loadingUpdatePassword) {// this line make the button unclickable when loading
      if (newPassword.trim().length === 0 || confirmNewPassword.trim().length === 0) {
        setNewPasswordError("some feilds are empty")
        setLoadingUpdatePassword(false)
        return
      }
      else if (newPassword !== confirmNewPassword) {
        setNewPasswordError('Passwords do not match!');
        setLoadingUpdatePassword(false)
        return

      }
      else if (newPassword.trim().length < 6 || confirmNewPassword.trim().length < 6) {
        setNewPasswordError('Invalid password\nPassword should be 6 or or more characters');
        setLoadingUpdatePassword(false)
        return
      }

      else {
        setNewPasswordError('');
        const requestData = {
          recieverEmail: retrivePassword,
          password: newPassword
        }
        const url = 'http://localhost:4000/updatePassword';
        dataFetch(url, requestData)
          .then((result) => {
            if (result.message == "updated") {
              setPasswordUpdated(true)
              setTimeout(() => {
                setNewPasswordError("")
                setLoadingUpdatePassword(false)
                showForgotPassword(false)
                window.location.assign("/login")
              }, 1000);


            }
            else {
              setNewPasswordError('An error occured');
              setLoadingUpdatePassword(false)
              return
            }
          })
          .catch((error) => {
            setNewPasswordError('An error occured');
            setLoadingUpdatePassword(false)
            return
          })
      }
    }
  }




  const handleLogin = (e) => {
    e.preventDefault();
    setLoadingLogin(true)
    setLoginError("");
    if (!loadingLogin) {
      if (validateForm()) {
        const requestData = {
          email: email,
          password: password
        };
        console.log(requestData)
        const url = port + '/login'
        dataFetch(url, requestData)
          .then((result) => {
            if (result.message === "not-registered") {
              setLoginError("Email not registered");
              setLoadingLogin(false)
            }
            else if (result.message === "wrong-password") {
              setLoginError("Email or password is incorrect")
              setLoadingLogin(false)
            }
            else if (result.message === "login-success") {
              setLoginError("")
              const userData = result.userData
              const token = result.token;
              localStorage.setItem("token", token)
              console.log(userData)
              dispatch(
                login({
                  firstName: userData.firstName,
                  lastName: userData.lastName,
                  email: userData.email,
                }))



              refreshUserOutbounds({ ownerAccount: userData.email })
              refreshUserTasks({ ownerAccount: userData.email })
              refreshUserEmails({ ownerAccount: userData.email })
              navigate("/dashboard")



            }
            else {
              setLoginError(result.message)
              setLoadingLogin(false)
            }

          })




        // Reset form
        // setEmail('');
        // setPassword('');
        // setRememberMe(false);
        // setErrors({});
      }
      else {
        alert("invalid form")
        setLoadingLogin(false)
      }
    }

  };

  return (
    <div>
      {forgotPassword ? (
        <div>
          {!retriveCodeSent ? (
            <div className='login '>
              <h2 className='page-head'>Forgot Password</h2>
              <form onSubmit={(e) => { e.preventDefault() }} className='form-container'>
                {retrivePasswordError && <div className='form-error-container'><p className='error'><i class="fa-solid fa-circle-exclamation"></i> {retrivePasswordError}</p></div>}
                <label>Email:</label>
                <input
                  type="text"
                  value={retrivePassword}
                  onChange={(e) => setRetrivePassword(e.target.value)}
                  required
                />
                <button className='site-button-thin' type="button" onClick={
                  sendverificationcode

                }>{loadingUpdateCode ? <i className="fa-solid fa-spinner fa-spin spinner"></i> : <p> Submit</p>}</button>

                <div className='login-navigator'>
                  <p onClick={() => {
                    showForgotPassword(false)
                    setRetrivePasswordError("");
                  }}><strong>Login</strong> instead</p>
                </div>
              </form>
            </div>
          ) : (
            <div className='login'>

              <div>
                {updatePasswordCorrect ? (
                  <div className='form-container' style={{ margin: "auto" }}>
                    <h2 className='page-head'>Update Password</h2>
                    {newPasswordError && <div className='form-error-container'><p className='error'><i class="fa-solid fa-circle-exclamation"></i> {newPasswordError}</p></div>}
                    {passwordUpdated && <div className='form-error-container'><p className='success'><i class="fa-regular fa-circle-check reg-complete"></i> Password Updated</p></div>}

                    <div className='new-password-change-div'>
                      <div>
                        <label>New password</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>

                      <div>
                        <label>Confirm new password</label>
                        <input
                          type="password"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                      </div>
                      <button className='site-button-thin' onClick={saveandupdatenewpassword}>{loadingUpdatePassword ? <i className="fa-solid fa-spinner fa-spin spinner"></i> : <p> Update Password</p>}</button>

                    </div>
                    <div className='login-navigator'>
                      <p onClick={() => {
                        window.location.reload()
                      }}>Cancel</p>
                    </div>




                  </div>
                ) : (
                  <div className='new-password-change-div' style={{ margin: "auto" }}>
                    <i class="fa-regular fa-circle-left" onClick={() => { setRetriveCodeSent(false) }}></i>
                    <h2 className='page-head'>We sent you a verification code</h2>

                    {updatePasswordCodeError && <div className='form-error-container'><p className='error'><i class="fa-solid fa-circle-exclamation"></i> {updatePasswordCodeError}</p></div>}
                    <input
                      type="text"
                      value={updatePasswordCode}
                      onChange={(e) => setUpdatePasswordCode(e.target.value)}
                    />
                    <button className='site-button-thin' type="button" onClick={() => {
                      if (updatePasswordCode.trim().length == 6) {
                        if (generatedCode === updatePasswordCode) {
                          setUpdatePasswordCodeError("")
                          setUpdatePasswordCorrect(true)
                        }
                        else {
                          setUpdatePasswordCodeError("Wrong code")
                        }
                      }
                      else {
                        setUpdatePasswordCodeError("code must be 6 characters")
                      }


                    }}>Confirm code</button>

                  </div>
                )}


              </div>


            </div>
          )}



        </div>
      ) :

        (<div className="login">
          <h2 className='page-head'>Login</h2>
          <form onSubmit={handleLogin} className='form-container'>

            {loginError && <div className='form-error-container'><p className='error'><i class="fa-solid fa-circle-exclamation"></i> {loginError}</p></div>}

            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

            </div>

            <div>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

            </div>

            <div className="remember-me">
              <label className='choice-lable'>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember Me
              </label >


            </div>

            <button type="submit" onClick={() => {
            }}>{loadingLogin ? <i className="fa-solid fa-spinner fa-spin spinner"></i> : <p> Login</p>}</button>

            <div className='login-navigator'>
              <p onClick={() => {
                showForgotPassword(true)
                setLoginError("")
              }}> Forgot Password?</p>
              <p> New user? <strong onClick={() => {
                window.location.assign("/register")
              }}>Create an Account</strong></p>
            </div>

          </form>


        </div>)}
      <div>

      </div>
    </div>

  );
};

export default Login;
