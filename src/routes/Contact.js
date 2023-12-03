
import React, { useState } from 'react';


import Bkg11 from "../images/bkg11.png"
import '../styles/Contact.css';
import dataFetch from '../modules/dataFetch';


export default function Contact() {
    const port = "http://localhost:4000"
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState("");
    const [messagesent, setMessageSent] = useState(false)
    const [loadingSubmit, setLoadingSubmit] = useState(false)

    const validateform = () => {


        // Validate form fields

        if (!name.trim()) {
            setErrors('Name is required');
            return false
        }
        else if (!email.trim()) {
            errors.email = 'Email is required';
            setErrors('Email is required');
            return false
        }
        else if (!/\S+@\S+\.\S+/.test(email)) {

            setErrors('Email is invalid');
            return false
        }
        else if (!message.trim()) {
            setErrors('Message is required');
            return false
        }
        else {
            return true
        }
    };

    function handleSubmit() {
        if (validateform()) {
            setLoadingSubmit(true)
            const requestData = {
                name: name,
                email: email,
                message: message
            }
            let url = port + "/contact"
            dataFetch(url, requestData)
                .then((reply) => {
                    if (reply.message == "sent") {
                        setLoadingSubmit(false)
                        setMessageSent(true)
                    }
                    else {
                        setLoadingSubmit(false)
                        setErrors("Counldnt send your message. Please try again.")
                    }
                })
                .catch((error) => {
                    setLoadingSubmit(false)
                    setErrors(error)

                })


        }
    }

    return (
        <div className='Section'>
            <div className='contact-details'>
                <h2 className='section5header section2header'>CONTACT US</h2>
                <h3><i className="fa-solid fa-phone"></i>   Phone:</h3><label>(081) 579-67548</label>
                <h3><i className="fa-solid fa-envelope"></i>   Email:</h3><label>letsoutbound@gmail.com</label>
                <div className="socials">
                    <i href="https://facebook.com" class="fa-brands fa-facebook"></i>
                    <i href="https://twitter.com" class="fa-brands fa-x-twitter"></i>
                    <i href="https://linkedin.com" class="fa-brands fa-linkedin"></i>
                    {/* <a href="https://instagram.com"><FontAwesomeIcon icon={faInstagram} /> Instagram</a> */}
                </div>
            </div>
            <div className='section-content'>
                <div className='section-content-left'>
                    <img src={Bkg11} alt='contact-us' />
                </div>
                <div className='section-content-right'>
                    <div className='form-holder'>
                        {messagesent ? (<>
                            <i class="fa-regular fa-circle-check cofirmation-icon"></i>
                            <h2>Thank you for reaching out</h2>
                            <div>You'll recieve a reply in the next 48 hours</div>
                        </>) : (
                            <>
                                <h2>Send us a message</h2>
                                <form onSubmit={(e) => { e.preventDefault() }}>
                                    {errors && <div className='form-error-container'><p className='error'><i class="fa-solid fa-circle-exclamation"></i> {errors}</p></div>}
                                    <div>
                                        <label htmlFor="name">Name:</label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email">Email:</label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="message">Message:</label>
                                        <textarea
                                            id="message"
                                            rows={8}
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                        />

                                    </div>

                                    <button type="submit" onClick={() => { if (!loadingSubmit) { handleSubmit() } }}>
                                        {loadingSubmit ? <i className="fa-solid fa-spinner fa-spin spinner"></i> : <p>Send Message</p>}</button>
                                </form>

                            </>)}
                    </div>
                </div>


            </div>

            {/* <Footer/> */}
        </div>
    )
}
