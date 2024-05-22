import React from 'react'
import '../styles/Card.css'

function Rating({rating}) {
    
  return (
    <div className="rating rating-lg">
      {[...Array(5)].map((_, index) => (
        <span key={index} className={rating > index ? "star filled" : "star"}>
          ★
        </span>
      ))}
    </div>
  )
}

export default Rating