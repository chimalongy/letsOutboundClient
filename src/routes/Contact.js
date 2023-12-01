
import React, { useState } from 'react';


import Bkg11 from "../images/bkg11.png"
import '../styles/Contact.css';


export default function Contact() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form fields
        const errors = {};
        if (!name.trim()) {
            errors.name = 'Name is required';
        }
        if (!email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Email is invalid';
        }
        if (!message.trim()) {
            errors.message = 'Message is required';
        }

        if (Object.keys(errors).length === 0) {
            // Form is valid, proceed with submitting the data
            const formData = { name, email, message };
            console.log(formData);
            // You can perform further actions, like sending the data to a server
        } else {
            // Form is invalid, display the errors
            setErrors(errors);
        }
    };

    return (
        <div className='Section'>
            <div className='contact-details'>
            <h2 className='section5header section2header'>CONTACT US</h2>
            <h3><i className="fa-solid fa-phone"></i>   Phone:</h3><label>(081) 579-67548</label>
            <h3><i className="fa-solid fa-envelope"></i>   Email:</h3><label>me.letsoutbound@gmail.com</label>

           </div>
            <div className='section-content'>
                <div className='section-content-left'>
                    <img src={Bkg11} alt='contact-us' />
                </div>
                <div className='section-content-right'>
                    <div className='form-holder'>
                        <form onSubmit={handleSubmit}>
                            <h2>Send us a message</h2>
                            <div>
                                <label htmlFor="name">Name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                {errors.name && <p>{errors.name}</p>}
                            </div>

                            <div>
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {errors.email && <p>{errors.email}</p>}
                            </div>

                            <div>
                                <label htmlFor="message">Message:</label>
                                <textarea
                                    id="message"
                                    rows={8}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                {errors.message && <p>{errors.message}</p>}
                            </div>

                            <button className='form-button' type="submit">Submit</button>
                        </form>
                    </div>
                </div>


            </div>

            {/* <Footer/> */}
        </div>
    )
}
