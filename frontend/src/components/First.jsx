import React from 'react'
import Navbar from './Navbar'
import  '../App.css'
import  Chatbot from './Chatbot'

function First() {
  function reload() {
    window.location.reload();
  }
  return (
    <div className='bg-[#413c78]'>
      <div className="textlogo flex  items-start pt-7">
        <img src="/innovaihub logo.jpeg" alt="logo" className='sidelogo logo ml-5 cursor-pointer' onClick={reload}/>
        <img src="/text_logo-.png" alt="Logo" className='logoimage '/>
      </div>
    <div className='first-container w-full h-screen'>
    <div className='first-nav '><Navbar/></div>
    <div><Chatbot/></div>
   
    </div>
    </div>
  )
}

export default First