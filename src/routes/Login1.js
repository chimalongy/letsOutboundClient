
import React, { useEffect, useState } from "react";
import "../styles/Login.css"
import LoginForm from "../components/LoginForm";
import UpdatePassword from "../components/UpdatePassword";



const Login = () => {
  let [showLogin, setShowLogin]=useState(true)

  useEffect(()=>{
    setShowLogin(true)
  },[])

  return (
    <div className="Login section-light">
      
     {showLogin?(<LoginForm showPasswordUpdate={()=>setShowLogin(false)} />):(<UpdatePassword showLogin={()=>setShowLogin(true)} />)}
    </div>
  );
};

export default Login;
