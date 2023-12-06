import React, { useState, useEffect } from "react";
import {IoMdArrowDropright} from 'react-icons/io';
import SkirtPopup from '../../partials/SkirtPartials/SkirtPopup'

import styles from './css/skirt.module.css';

import cicle from './img/cicle.svg';
import half from './img/half.svg';
import quarter from './img/quarter.svg';
import how from './img/how.png'

function Skirt() {
  useEffect(() => {
    document.body.classList.add(styles.background); // adiciona classe ao body
    return () => {
      document.body.classList.remove(styles.background); // remove classe do body
    };
  }, []);
  const [imagem, setImagem] = useState(cicle);
  const [display, setDisplay] = useState(true);

  function handleSelected(opcao) {
    switch (opcao) {
      case "opcao1":
        setImagem(cicle);
        break;
      case "opcao2":
        setImagem(half);
        break;
      case "opcao3":
        setImagem(quarter);
        break;
      default:
        setImagem();
    }
    
  }

  function toggleDropdown() {
    setDisplay(!display);
    var arrow = document.getElementById("arrow")
    if (!display) {
      arrow.style.transform = 'rotate(0deg)';
    } else {
      arrow.style.transform = 'rotate(90deg)';
    }
  }
  function changeType(e) {
    setType(e.target.value)
    setDisplay(true)
  }

  //Popup
  const [buttonPopup, setButtonPopup] = useState(false)

  //Calculadora
  const [type, setType] = useState('cicle')
  const [measure, setMeasure] = useState('cm')
  const [waist, setWaist] = useState([])
  const [length, setLength] = useState([])

  const [currentRadius, setcurrentRadius] = useState(0)
  const [currentFabric, setcurrentFabric] = useState(0)
  var fabric = 0
  var radius = 0
  

  function calc() {
    if(measure === 'in'){
    if (type === 'cicle') {
      radius = ((1/4*waist)*4)/6.28 
    } else if (type === 'half') {
      radius = ((1/2* waist)*4)/6.28
    } else if (type === 'quarter') {
      radius = ((waist)*4)/6.28
    }
    fabric =  parseFloat(length) + parseFloat(radius) + 7.87
  }else if (measure === 'cm'){
    if (type === 'cicle') {
      radius = ((1/4*waist)*10.16)/15.95
    } else if (type === 'half') {
      radius = ((1/2* waist)*10.16)/15.95
    } else if (type === 'quarter') {
      radius = ((waist)*10.16)/15.95
    }
    fabric = parseFloat(length) + parseFloat(radius)
  }
    console.log(radius)
    console.log(fabric)
    setcurrentRadius(radius.toFixed(2))
    setcurrentFabric(fabric.toFixed(2))
    console.log('Radius: ',radius)
    console.log('Fabric: ',fabric)
    setWaist([])
    setLength([])
    console.log('Waist: ',waist)
    console.log('Length: ',length)
    if (radius !== 0  && fabric !== null) {
      setButtonPopup(true)
    }
  }
  return (
    <div className="container-fluid" style={{padding:'0.1% 20%'}}>
      <h1 className="mt-1" style={{fontFamily: 'Gotu'}}>Saias</h1>
      <h5 className="text-center mb-5" style={{fontFamily:'Gothic A1'}}>Calcule as medidas de modelos de saias!</h5>

      <div className={`mt-5 ${styles.skirExemple}`} style={{marginLeft: '7%'}}>
        <p className="btn fs-2" style={{border:"none", fontFamily:'Gothic A1'}} onClick={toggleDropdown}>
          Modelos de Saias <IoMdArrowDropright id="arrow" color="#C25E84"/>
        </p>
        <div
          className={styles.options}
          style={{display: display ? "none" : "block" }}
          >
            <input name="skirtType" type="radio" id="cicle" value="cicle"  onClick={changeType}/>
          <label htmlFor="cicle" className="btn" onClick={() => handleSelected("opcao1")}>
            Saia Circular
          </label><br />
            <input name="skirtType" type="radio" id="half" value="half" onClick={changeType}/>
          <label htmlFor="half" className="btn" onClick={() => handleSelected("opcao2")}>
            Saia Semi Circular
          </label><br />
            <input name="skirtType" type="radio" id="quarter" value="quarter" onClick={changeType}/>
          <label htmlFor="quarter" className="btn" onClick={() => handleSelected("opcao3")}>
            Saia Três Quartos
          </label>
        </div>
      </div>
      <form className="row">
        <div className={` col-sm-12 col-lg-7 mx-auto`}>
          {imagem && <img src={imagem} alt="imagem do filtro" style={{width:'100%'}}/>}
        </div>
        
        <div className={`${styles.Forms} col-sm-12 col-lg-4 my-auto mt-5 d-flex flex-column align-self-start align-items-center mx-auto`}>
          <h3 className="mb-4  mt-5">Centímetros ou polegadas?</h3>
          <div className={`${styles.FormCheck} form-check`}>
            <input type="radio" className="btn-check" name="options" id="cm" value='cm' onClick={(e) => setMeasure(e.target.value)} defaultChecked/>
            <label className="btn btn-secondary" htmlFor="cm">
              <p> cm </p>
            </label>
            <input type="radio" className="btn-check" name="options" id="in" value='in' onClick={(e) => setMeasure(e.target.value)}/>
            <label className="btn btn-secondary" htmlFor="in">
              <p> in </p>
            </label>
          </div>
          <h3 className="mt-5">Medidas da cintura</h3>
          <div>
              <input className="form-control shadow-none" type="number" value={waist} onChange={(e) => setWaist(e.target.value)}/>
          </div>
          <h3 className="mt-3">Medidas do comprimento</h3>
          <div>
            <input className="form-control shadow-none" type="number" value={length} onChange={(e) => setLength(e.target.value)} />
          </div>
          <div>
            <button className="mx-auto btn btn-dark" type="button" onClick={calc}><p>Enviar</p></button>
          </div>
        </div>
      </form>
      <div className="row mt-5">
        <div className="col mx-5 px-5">
          <h1 className="mt-5" style={{fontFamily: 'Gothic A1', color: '#C25E84'}}>Como usar?</h1>
          <h3 style={{fontFamily: 'Gotu'}}> Se você é novo na área de costura e ficou perdido com essa tela, não se preocupe! Nós, do Linniê, estamos aqui para te ajudar a entender esse mundo, começando por como usar nossa calculadora para saias godê. Aqui estão alguns passos para você seguir e confeccionar seu primeiro molde: </h3>
          <h3 style={{fontFamily: 'Gotu'}}> <span className="fw-bold"> 1° passo: </span> Após colocar suas medidas nos campos necessários, anote-os para fazer os passos abaixo; </h3>
          <h3 style={{fontFamily: 'Gotu'}}> <span className="fw-bold"> 2° passo: </span> Com um papel Kraft (ou outro material de sua escolha), demarque o raio de sua cintura usando a quina do papel de base, formando um 1/4 de círculo (O do Lin é 3cm!); </h3>
          <h3 style={{fontFamily: 'Gotu'}}> <span className="fw-bold"> 3° passo: </span> Agora, usando a linha que acabou de tracejar como base, marque o comprimento de sua saia, da mesma maneira que fez no 2° passo; </h3>
          <h3 style={{fontFamily: 'Gotu'}}> <span className="fw-bold"> 4° passo: </span> Corte o molde seguindo suas marcações; </h3>
          <h3 style={{fontFamily: 'Gotu'}}> <span className="fw-bold"> 5° passo: </span> Coloque seu molde acima do tecido de sua escolha (segurando-o com alfinetes, de preferência!) e faça demarcações contornando o molde no tecido; </h3>
          <h3 style={{fontFamily: 'Gotu'}}> <span className="fw-bold"> 6° passo: </span> Corte o tecido seguindo as marcações feitas, e agora a saia está pronta para costurar! </h3>
        </div>
        <div className="col mx-5">
          <img className="mt-5" src={how} alt="" style={{width:'100%'}} />
        </div>

        <SkirtPopup trigger={buttonPopup} setTrigger={setButtonPopup}>
          <h1 className="text-center" style={{color:"#C25E84"}}>Resultados</h1>
          <hr className="mx-auto rounded-3" style={{width:"38%",height:"3px",backgroundColor:"#C25E84", color:"#C25E84", opacity:"80%"}} />
          <h4 className="text-center mt-4 mb-4">O raio da sua cintura é: <span className="mx-3" style={{color:"#C25E84"}}>{currentRadius}</span> </h4>
          <h4 className="text-center">A quantidade de tecido <br /> necessaria para a sua saia é: <span className="mx-3" style={{color:"#C25E84"}}>{currentFabric}</span> </h4>
          <hr className="rounded-3 mt-5 mb-4" style={{height:"3px",backgroundColor:"#C25E84", color:"#C25E84", opacity:"80%"}} />
          <h4 className="text-center"> Caso tenha alguma dúvida de como fazer <br /> sua saia, observe o molde ilustrativo ao lado <br /> e as instruções abaixo!</h4>
        </SkirtPopup>
      </div>
    </div>
  );
}

export default Skirt;
