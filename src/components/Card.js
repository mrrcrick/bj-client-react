import { useState, useEffect } from 'react';

function Card ( id, cardimg ) {
  useEffect(()=> {}, [] );
  return (
    <div className='card-holder' card-id={ id }>
        <img src={ cardimg }></img>
    </div>
  );

}


export default Card;
