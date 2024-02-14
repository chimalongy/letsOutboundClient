
import React,{useEffect} from 'react'
import "../styles/Features.css"
import AOS from "aos";
import "aos/dist/aos.css"
function FeaturesRight(props) {
  useEffect(() => {
    AOS.init({ duration: 1500 })
  }, [])
  return (
    <div className='features'>
      {/* data-aos="slide-left"data-aos-duration='1000' */}
      <div className='wordings'>
        <h3 data-aos="zoom-in-right"data-aos-duration='1000'> <i class="fa-regular fa-circle-dot"></i> {props.heading}</h3>
        <p data-aos="zoom-in-right"data-aos-duration='1000'>{props.description}</p>
      </div>
      {/* data-aos="slide-right"data-aos-duration='1000' */}
      <div className='image'>
        <img src={props.image} alt="feature-image" data-aos="slide-left"data-aos-duration='1000' />
      </div>
    </div>
  )
} 

export default FeaturesRight