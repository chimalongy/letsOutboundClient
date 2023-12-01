import React, { useEffect } from 'react'
import "../styles/Home.css"
import { useNavigate } from 'react-router-dom'

import heroimg from "../images/heroimg.png"
import emailint from "../images/emailint.png"
import userInterface from "../images/userInterface.png"
import precision from "../images/precision.png"
import responsive from "../images/responsive.png"
import signup from "../images/signup.png"
import addemail from "../images/addemail.png"
import createoutbound from "../images/createoutbound.png"
import scheduletask from "../images/scheduletask.png"



import FeaturesLeft from '../components/FeaturesLeft'
import FeaturesRight from '../components/FeaturesRight'
import HIW from '../components/HIW'

import AOS from "aos";
import "aos/dist/aos.css"

function Home() {
  let navmove = useNavigate()
  useEffect(() => {
    AOS.init({ duration: 1500 })
  }, [])

  return (
    <div>
      <div id="hero" className='section-dark section'>


        <div className='home-section-container section1 '>

          <div className='section1-left'>
            <h1 data-aos="fade-up">Unlock the Power of Timely Communication.</h1>
            <p data-aos="fade-up" data-aos-duration='2000'>simplify email scheduling with our Gmail integration.</p>
            <button className='site-button-short-thick' data-aos="fade-up" data-aos-duration='2500' onClick={() => {
              navmove("/register")
            }}>Get Started</button>
          </div>
          <div className='section1-right'>
            <img src={heroimg} alt="feature-image" data-aos="fade-up" />
          </div>

        </div>

      </div>

      <div id="feautres" className='section-light section'>
        <div className='home-section-container'>

          <h1 className='section-header' data-aos="zoom-in" data-aos-duration='1000'>Feautures</h1>

          <div className='feautures-container'>



            <div><FeaturesLeft image={emailint} heading={"Seamless Gmail Integration"} description={"Effortlessly schedule and send emails directly from your Gmail account."} data-aos="slide-right" data-aos-duration='1000' /></div>
            <div><FeaturesLeft image={userInterface} heading={"Intuitive User Interface"} description={"Our easy-to-use platform ensures you'll be scheduling emails like a pro in no time."} data-aos="slide-left" data-aos-duration='1000' /></div>
            <div><FeaturesLeft image={precision} heading={"Precision and Accuracy"} description={"Reliable scheduling ensures your emails reach the right recipients at the perfect time."} data-aos="slide-right" data-aos-duration='1000' /></div>
            <div><FeaturesLeft image={responsive} heading={"Accessible Anywhere"} description={"Access your scheduled emails on any device, wherever you are."} data-aos="slide-left" data-aos-duration='1000' /></div>




          </div>



        </div>

      </div>

      <div id="HIW" className='section-dark'>
        <div className='home-section-container'>
          <h1 className='section-header dark-header' data-aos="zoom-in" data-aos-duration='1000'>How it Works</h1>
          <div className='HIW-cards'>
            <div><HIW number={1} image={signup} heading={"Sign up"} description={"Create an account for free in 2 minutes to get started."} /></div>
            <div><HIW number={2} image={addemail} heading={"Add emails"} description={"Add your gmail account for outbounding"} /></div>
            <div><HIW number={3} image={createoutbound} heading={"Create outbound"} description={"Create outbounds and allocate list to emails"} /></div>
            <div><HIW number={4} image={scheduletask} heading={"Assign Tasks"} description={"Add and schedule task to your outbounds"} /></div>
          </div>
        </div>
      </div >

      <div id='FAQ' className='section-light section'>
        <div class="home-section-container" >
          <h1 className='section-header' data-aos="zoom-in" data-aos-duration='1000'>Frequently asked questions</h1>
          <div class="page-specific-container">
            <details className='home-details' data-aos="fade-up" data-aos-duration='500'>
              <summary className='home-summary'>WHAT IS LETSOUTBOUND<i class="fa-solid fa-chevron-right"></i></summary>
              <p>Let's outbound is an easy to use platform for scheduling and performing you email outbound tasks</p>
            </details>

            <details className='home-details' data-aos="fade-up" data-aos-duration='700'>
              <summary className='home-summary'>HOW MANY GMAIL ACCONTS CAN I ADD <i class="fa-solid fa-chevron-right"></i></summary>
              <p>There are no limit to the numbr of gmail accounts you can add to your LETSOUTBOUND account. As a matter of fact, your sending capacity increases with more emails.</p>
            </details>

            <details className='home-details' data-aos="fade-up" data-aos-duration='900'>
              <summary className='home-summary'>DOES MY EMAILS LAND IN THE INBOX? <i class="fa-solid fa-chevron-right"></i></summary>
              <p>This is completely dependent on the email itself. LETSOUTBOUND does not interfer with your Gmail account and the overall health of your Gmail depends on you. We advise you follow the Gmail <a href='https://support.google.com/mail/answer/81126?hl=en'>Email sender guidelines</a> </p>
            </details>
            <details className='home-details' data-aos="fade-up" data-aos-duration='1200'>
              <summary className='home-summary'>CAN I SEND FROM A CUSTOM EMAIL LINKED WITH GMAIL <i class="fa-solid fa-chevron-right"></i></summary>
              <p>No. You can cannot send emails from external emails linked to you gmail. We are currently working to add this feauture and will make a public annoncement when rolled out.</p>
            </details>
          </div>


        </div>
      </div>


    </div>
  )
}

export default Home