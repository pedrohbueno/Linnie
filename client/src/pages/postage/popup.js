// Popup.js

import React from 'react';
import './css/popup.css';
import logo from './img/logo.png'

function Popup({ onClose, onConfirm }) {
  return (
    <div className="popup-container">
      <div className="popup">
      <img className="popup-image" src={logo} alt='' />
        <p>Deseja mesmo apagar a postagem?</p>
        <button className='buttonYes' onClick={onConfirm}>Sim</button>
        <button className='buttonNo' onClick={onClose}>Não</button>
      </div> 
    </div>
  );
}

export default Popup;
