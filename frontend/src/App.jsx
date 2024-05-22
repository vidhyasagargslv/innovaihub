import React,{useState} from 'react'
import './App.css'
import Card from './components/Card'
import Details from './components/Details'
//import Google from './components/Google'
//import Navbar from './components/Navbar'
//import Heropage from './components/Heropage'
import LoginPage from './components/Loginpage'
import SignupPage from './components/SignupPage'
import Popular from './components/navcomponents/Popular'
import Favourites from './components/navcomponents/Favourites'
import Myspace from './components/navcomponents/Myspace'
import Error from './components/Error'
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar'
import Heropage from './components/Heropage'
import First from './components/First'
import Loginpage from './components/Loginpage'
import Aispace1 from './components/Ai_space/Aispace1'
import Aispace2 from './components/Ai_space/Aispace2'
import Aispace3 from './components/Ai_space/Aispace3'
import Aispace4 from './components/Ai_space/Aispace4'


function App() {
  const [toolsUpdated, setToolsUpdated] = useState(false);
  

  return (
    <>
    <Error>
    <Router>
      <div>
      <ToastContainer />
        <Routes>
        <Route path="/card" element={<Card />} />
        <Route path="/navbar" element={ <Navbar/>} />
        <Route path="/" element={<Heropage />} />
        <Route path="/aispace" element={<Aispace1 />} />
        <Route path="/aispace2" element={<Aispace2 />} />
        <Route path="/first/aispace3" element={<Aispace3 toolsUpdated={toolsUpdated}/>} />
        <Route path="/aispace4" element={<Aispace4 setToolsUpdated={setToolsUpdated}  />} />


        
          <Route path="/login" element={<LoginPage/>}/>
          <Route path='/signup' element={<SignupPage/>}/>
          <Route path='/first' element = {<First/>}/>
            <Route path="/product/:id" element={<Details />} />
            <Route path="/first/Home" element={<Card />} />
            <Route path="/first/Popular" element={<Popular />} />
            <Route path="/first/Favourites" element={<Favourites />} />
            <Route path="/first/MySpace" element={<Myspace/>} />
            <Route path="/first/Logout" element={<Loginpage/>} />
            

        </Routes>
      </div>
    </Router>
    </Error>
    
    
    </>
  )
}

export default App
