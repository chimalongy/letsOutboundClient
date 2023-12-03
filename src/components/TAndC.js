import React from 'react'
import "../styles/TAndC.css"

function TAndC() {
    return (
        <div className='tanc form-holder'>
            <div className='tandcheader'>
                <h1>Terms and Conditions</h1>
                <p>Last Updated: [1/12/2023]</p>
            </div>

            <section>
                <h2>1. User Eligibility</h2>
                <p>1.1. You must be at least 18 years old to use our services.</p>
                <p>1.2. By using our services, you represent and warrant that you have the legal capacity to enter into these Terms.</p>
            </section>

            <section>
                <h2>2. Account Registration</h2>
                <p>2.1. To use certain features of our services, you may be required to create an account.</p>
                <p>2.2. You are responsible for maintaining the confidentiality of your account information, including your app password generated on your Gmail account.</p>
            </section>

            {/* Add more sections for each point in your Terms and Conditions */}

            <section>
                <h2>12. Contact Information</h2>
                <p>12.1. For any questions or concerns regarding these Terms, please contact LetsOutbound at [letsoutbound@gmail.com].</p>
            </section>

            <p>
                By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and any modifications thereto.
            </p>

            <footer>
                <p>LetsOutbound</p>
                {/* <p>[Your Company Address]</p>
            <p>[Your Contact Email]</p>
            <p>[Your Contact Phone Number]</p> */}
            </footer>
        </div>
    );

}

export default TAndC