import React, { useState } from 'react'
import "../styles/LoginForm.css"
import { Link, useNavigate } from 'react-router-dom';
import dataFetch from '../modules/dataFetch';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../modules/redux/userDataSlice';
import { setUserEmails } from '../modules/redux/userEmailsSlice';
import { setUserOutbounds } from '../modules/redux/userOutboundsSlice';
import { setUserTasks } from '../modules/redux/userTasksSlice';
import useDataUpdater from '../modules/useDataUpdater';

function LoginForm(props) {
    const port="http://localhost:4000"
    const {refreshUserOutbounds}= useDataUpdater()
    const {refreshUserEmails}= useDataUpdater()
    const {refreshUserTasks}= useDataUpdater()
    const user = useSelector((state) => state.user.userData);
    const uEmails = useSelector((state) => state.userEmails.userEmails);
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [submissionMessage, setSubmissionMessage] = useState()
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = "Email is required.";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = "Invalid email format.";
        }

        if (!formData.password) {
            newErrors.password = "Password is required.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            //Authenticate User
            const requestData = {
                email: formData.email,
                password: formData.password
            };
            const url = port+'/login'
            dataFetch(url, requestData)
                .then((result) => {
                    console.log("this is the result of the first check message: " + result.message)
                    if (result.message === "login-success") {
                        //login successfull
                        setSubmissionMessage("")
                        const token = result.token
                        const userData = result.userData
                        console.log(userData)
                        localStorage.setItem("token", token);
                        

                        refreshUserOutbounds({ownerAccount: userData.email})
                        refreshUserTasks({ownerAccount: userData.email})
                        refreshUserEmails({ownerAccount: userData.email})
                        dispatch(
                            login({
                                firstName: userData.firstName,
                                lastName: userData.lastName,
                                email: userData.email,
                            })

                        )
                        navigate("/dashboard")
                        
                        // //Get Outbond EEmails
                        // const requestData = {
                        //     ownerAccount: userData.email
                        // }
                        // let url = port+'/getuseroutboundemails'
                        // dataFetch(url, requestData)
                        //     .then((result) => {
                        //         const userEmails = result.data;
                        //         if (result.message === "emails-found") {

                                   
                                   

                        //             //GETTING OUTBOUND DATA
                        //             const newrequestData = {
                        //                 ownerAccount: userData.email
                        //             }
                        //             let url = port+'/getuseroutbounds'
                        //             console.log(url)
                        //             dataFetch(url, newrequestData)
                        //                 .then((result) => {
                        //                     const userOutbounds = result.data;

                        //                     if (result.message === "outbounds-found") {

                        //                         //Getting user Tasks
                        //                         const newrequestData = {
                        //                             ownerAccount: userData.email
                        //                         }
                        //                         let url =port+'/getusertasks'
                        //                         dataFetch(url, newrequestData)
                        //                             .then((result) => {
                        //                                 const userTasks= result.data

                        //                                 //PERSIT USER DATA
                        //                                 dispatch(
                        //                                     login({
                        //                                         firstName: userData.firstName,
                        //                                         lastName: userData.lastName,
                        //                                         email: userData.email,
                        //                                     })

                        //                                 )

                        //                                 dispatch(setUserEmails({
                        //                                     emails: userEmails
                        //                                 }))
                        //                                 dispatch(setUserOutbounds({
                        //                                     outbounds: userOutbounds
                        //                                 }))
                                                        
                        //                                 dispatch(setUserTasks({
                        //                                     task: userTasks
                        //                                 }))
                                                        

                        //                                 navigate("/dashboard")
                        //                             })
                        //                             .catch(error => console.log(error))


                        //                     }
                        //                 })
                        //                 .catch(error => console.log(error))


                        //         }
                        //     })
                        //     .catch(error => console.log(error))

                    }
                    else if (result.message === "not-registered") { setSubmissionMessage("This email is not registered.") }
                    else if (result.message === "wrong-password") { setSubmissionMessage("we could not log you in. An error occured.") }

                })

                .catch(error => console.log(error))

            //  console.log("user-data")
            //  console.log(user);
            //console.log("user-emails: ")
            // console.log(uEmails.emails)
            //  console.log("is Array? "+Array.isArray(uEmails.emails))








            // setFormData({
            //     email: "",
            //     password: "",
            // });
        }
    };
    return (

        <div className='login-form'>

            <div className="form-holder">
                <h2>Login Form</h2>
                <form onSubmit={handleSubmit}>
                    {submissionMessage && <p className='error'>{submissionMessage}</p>}
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && <p className="error">{errors.email}</p>}
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors.password && <p className="error">{errors.password}</p>}
                    </div>
                    <button type="submit">Login</button>

                </form>
            </div>
            <div className="login-nav">
                <p onClick={() => { props.showPasswordUpdate() }}>Forgot password ?</p> | <Link to="/register">Create Account</Link>
            </div>

        </div>
    )
}

export default LoginForm