import React, { useEffect } from 'react'
import "../styles/HIW.css"
import AOS from "aos";
import "aos/dist/aos.css"

function HIW(props) {
  useEffect(() => {
    AOS.init({ duration: 1500 })
  }, [])
  return (
    <div className='HIW'>
      <div className='number-container'data-aos="fade-up" data-aos-duration='500'>
        <div>
          {props.number}
        </div>
      </div>
      <div className='image-container'>
        <img src={props.image} alt={`HIW${props.number}`} data-aos="zoom-in" data-aos-duration='500' />
      </div>
      <div className='data-container'>
        <h4 data-aos="zoom-in" data-aos-duration='500'>{props.heading} </h4>
        <p data-aos="zoom-in" data-aos-duration='500'>{props.description} </p>
      </div>
    </div>
  )
}

export default HIW