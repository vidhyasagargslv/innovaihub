import React from 'react'
import './Aispace.css'

export default function Aispace1({ onAddRoom }) {

  
  return (
    <div className="main rounded-xl">
      <div className="Frame24 h-56 flex-col justify-start items-center gap-16 inline-flex">
        <div className="Frame23 flex-col justify-start items-center gap-6 flex">
          <div className="heading1 text-center text-white text-6xl font-normal font-['moonhouse'] uppercase tracking-widest max-md:text-3xl">
            Embark on the AI Odyssey
          </div>
          <div className=" heading2 text-center text-2xl font-normal font-['moonhouse'] uppercase tracking-widest max-md:text-base">
            Click to Journey Beyond
          </div>
        </div>
        <div className="Plus w-30 h-20 relative max-md:w-16 max-md:h-16">
        <button className='btn px-12 py-3 btn-warning rounded-3xl' onClick={onAddRoom}>Dive in</button>
        </div>
      </div>
    </div>
  );
}
