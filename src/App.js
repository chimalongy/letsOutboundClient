import Home from "./routes/Home";
import Login from "./routes/Login";
import Registration from "./routes/Registration";
import{BrowserRouter, Routes, Route} from "react-router-dom";

import Dashboard from "./routes/Dashboard";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import UserEmails from "./components/UserEmails";



function App() {
  const issUserLoggedin=!!localStorage.getItem("token")
  return (
  <div>
    
    <BrowserRouter> 
        <Navbar/>
      <Routes>
        <Route path='register' element={<Registration />}></Route>
        <Route path='login' element={<Login />}></Route>
        <Route path='/' element={<Home />}></Route>
        {/* {issUserLoggedin && <Route path='dashboard' element={<Dashboard/> }></Route>} */}
        <Route path='dashboard' element={<Dashboard/> }/>
       
                       
                          
                        
        
      </Routes>
      <Footer/>
        </BrowserRouter>


  </div>
  );
}

export default App;
