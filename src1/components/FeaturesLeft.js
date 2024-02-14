import React,{useEffect} from 'react'
import AOS from "aos";
import "aos/dist/aos.css"

export default function FeaturesLeft(props) {
    useEffect(()=>{
        AOS.init({duration:1500})
      },[])
    return ( 
        <div className='features'>
            {/* data-aos="slide-right"data-aos-duration='1000' */}
         <div className='image'>
         <img src={props.image} alt="feature-image" data-aos="slide-right"data-aos-duration='1000' />
        </div>
        {/* data-aos="slide-left"data-aos-duration='1000' */}
         <div className='wordings' >
             <h3 data-aos="zoom-in-left"> <i class="fa-regular fa-circle-dot"></i> {props.heading}</h3>
             <p data-aos="zoom-in-left">{props.description}</p>
         </div>
    
        
     </div>
      )
} 
