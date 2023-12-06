//Modules
import { useState } from 'react'

//CSS
import styles from "./css/devcardslist.module.css";

//Imagens

import pedro from './img/pedro.png'
import victor from './img/victor.png'
import sarah from './img/sarah.png'
import vitoria from './img/vitoria.png'
import sophia from './img/sophia.png'

function DevCards({ name, surname, job, image, color, hvcolor}) {
  
  const [isHover, setIsHover] = useState(false);

  const handleMouseEnter = () => {
     setIsHover(true);
  };

  const handleMouseLeave = () => {
     setIsHover(false);
  };

  const boxStyle = {
     backgroundColor: isHover ? hvcolor : '#F7F7F8',
  };

  return (
    <div className="col-8 col-sm-4 col-md-3 col-lg-2 col-xl-2 col-xxl-2 m-auto custom-col">
      <div className={styles.card}
      style={boxStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      >
        <img src={image} alt="" className={styles.devsImg} />
        <div 
          className={`${styles.devsInfo} text-center m-3`}
          style={{color:color}}
        >
          <h1>{name}</h1>
          <h2>{surname}</h2>
          <p>{job}</p>
        </div>
      </div>
    </div>
  );
}

const devList = [
  {
    name: "Victor", surname: "Nadalini",
    job: "Back-end Developer",
    image: victor,
    color: "#FCD074",
    hvcolor: "#fcd17433"
  },
  {
    name: "Sarah", surname: "Guelere",
    job: "Documentação, Gestão, Diário de Bordo e Ilustração.",
    image: sarah,
    color: "#FC7474",
    hvcolor: "#fc74742c"
  },
  {
    name: "Sophia", surname: "Gonçalves",
    job: "Designer, Diário de Bordo e Documentação.",
    image: sophia,
    color: "#74A2FC",
    hvcolor: "#74a1fc2d"
  },
  {
    name: "Vitoria", surname: "Izabel",
    job: "ilustração, Banco de Dados, Programadora",
    image: vitoria,
    color: "#A874FC",
    hvcolor: "#a874fc2a"
  },
  {
    name: "Pedro", surname: "Bueno",
    job: "Programador Front-End e Back-End Support",
    image: pedro,
    color: "#51A31F",
    hvcolor: "#52a31f2f"
  },
];

function DevCardsList() {
  return (
    <div className="row justify-content-center" style={{maxWidth: '100%'}}>
      {devList.map((dev, index) => (
        <DevCards
          key={index}
          name={dev.name}
          surname={dev.surname}
          job={dev.job}
          image={dev.image}
          color={dev.color}
          hvcolor={dev.hvcolor}
        />
      ))}
    </div>
  );
}

export default DevCardsList;
