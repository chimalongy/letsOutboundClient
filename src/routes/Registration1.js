import React, { useState, useRef } from 'react'
import "../styles/Registration.css";
import dataFetch from '../modules/dataFetch';
import { Link } from 'react-router-dom'



function Registration() {
    const port = ""
    const continueButton = useRef()
    let [formValid, setFormValid] = useState(false)
    const [emailVerificationCode, setEmailVerificationCode] = useState("")
    const [verifyEmailError, setVerifyEmailError] = useState("");
    const [generatedCode, setGeneratedCode] = useState("");
    const [submissionMessage, setSubmissionMessage] = useState()
    function generateRandomCode(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomCode = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomCode += characters.charAt(randomIndex);
        }
        return randomCode;
    }
    //==========================form
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setErrors({ ...errors, [name]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // // Validate form data
        const validationErrors = validateForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        }
        else {
            const requestData = {
                email: formData.email,
            };
            const url = port + '/finduser';
            const result = await dataFetch(url, requestData)
            if (result.message === "found") {
                setSubmissionMessage("This email has been registered. Please Login")
            }
            else {
                setSubmissionMessage("")
                const randomCode = generateRandomCode(8)
                setGeneratedCode(randomCode);
                continueButton.current.disabled = true;
                const url = port + '/sendregisterationcode'; // Replace with your actual API endpoint
                const requestData = {
                    recieverName: formData.firstname,
                    reciverEmail: formData.email,
                    code: randomCode
                };

                const result = await dataFetch(url, requestData)
                if (result.message) {
                    setFormValid(true);
                }
            }



        }
    };
    const handleVerifyEmailChange = (e) => {
        setEmailVerificationCode(e.target.value)
    }
    const handleRegistrationComplete = async () => {
        if (emailVerificationCode === generatedCode) {
            setVerifyEmailError("")

            const requestData = {
                firstName: formData.firstname,
                lastName: formData.lastname,
                email: formData.email,
                password: formData.password
            };
            const url = port + '/register';
            const result = await dataFetch(url, requestData)
            if (result.message) {
                alert("Regstration Complete")
                window.location.assign("/login")
            }
        }
        else {
            setVerifyEmailError("invalid code")
        }
    }

    const validateForm = (data) => {
        let errors = {};

        if (!data.firstname.trim()) {
            errors.firstname = 'first name is required';
        }

        if (!data.lastname.trim()) {
            errors.lastname = 'last name is required';
        }

        if (!data.email.trim()) {
            errors.email = 'email is required';
        } else if (!isValidEmail(data.email)) {
            errors.email = 'Invalid email format';
        }

        if (!data.password) {
            errors.password = 'password is required';
        } else if (data.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (data.password !== data.confirmPassword) {
            errors.confirmPassword = 'passwords do not match';
        }
        return errors;
    };

    const isValidEmail = (email) => {
        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };



    return (
        <div className='Registration section-light'>
            <div className='form-holder'>
                <h2>Registrater</h2>
                <form onSubmit={handleSubmit}>
                    {submissionMessage && <p className='error'>{submissionMessage}</p>}
                    <div>
                        <input
                            type="text"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleChange}
                            placeholder='first name'
                        />
                        {errors.firstname && <div className="error">{errors.firstname}</div>}
                    </div>
                    <div>

                        <input
                            type="text"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            placeholder='last name'
                        />
                        {errors.lastname && <div className="error">{errors.lastname}</div>}
                    </div>
                    <div>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder='email'
                        />
                        {errors.email && <div className="error">{errors.email}</div>}
                    </div>
                    <div>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder='password'
                        />
                        {errors.password && <div className="error">{errors.password}</div>}
                    </div>
                    <div>

                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder='confirm password'
                        />
                        {errors.confirmPassword && (
                            <div className="error">{errors.confirmPassword}</div>
                        )}
                    </div>
                    <button ref={continueButton} type="submit">Continue</button>
                </form>
                {
                    formValid ? (
                        <div className='verify-email-form'>
                            <p>Verify Email</p>
                            <div>
                                <input
                                    type="password"
                                    name="emailVerificationCode"
                                    value={emailVerificationCode}
                                    onChange={handleVerifyEmailChange}
                                    placeholder='verification code'
                                />
                                <span className='error'>{verifyEmailError}</span>
                            </div>
                            <button onClick={() => {
                                handleRegistrationComplete();
                            }}>Complete Registration</button>

                        </div>) : ("")
                }
            </div>
            <div>
                <p> Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
}

export default Registration