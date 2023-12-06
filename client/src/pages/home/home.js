//CSS
import styles from './css/home.module.css';

//Imagens
import lin from './img/exploreimg.svg'
import nie from './img/createimg.svg'
import create from './img/create.svg'
import explore from './img/explore.svg'
import blueprint from './img/blueprint.svg'
import title from './img/title.svg'

//Partials
import DevCardsList from "../../partials/HomePartials/DevCardsList"

//Modules
import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from 'AuthContext';
import { ToastContainer, toast } from 'react-toastify';

function Home() {
  const { suspend } =  useContext(AuthContext)
  useEffect(() => {
    document.body.classList.add(styles.background); // adiciona classe ao body
    return () => {
      document.body.classList.remove(styles.background); // remove classe do body
    };
  }, []);
  console.log('ssususu', suspend)

  const suspendAlarm = ()=> {
    if (suspend === 1) {
      toast('Usuário suspendido')
    }
  }
  return (
    <>
      <ToastContainer/>
      <div className={`${styles.area} ${styles.coloredText} mt-5`}>
        <div className={`${styles.a1} col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mx-auto`}>
          <img src={title} alt="" style={{width:'55%'}}/>
          <h3 style={{margin:'6vh 13vw 30vh 8vw', textAlign:'center'}} > Junte-se à nossa rede social de costura <br /> e encontre a inspiração, aprendizado e <br /> conexões com outros<br /> apaixonados por costura! </h3>
        </div>
        <div className={`${styles.a2} col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mx-auto mt-5`}>
            <Link  to="/explore" className='d-flex'>
              <div className='mt-5'>
                <h2 style={{marginRight:'90px'}}>Explorar</h2>
                <img src={explore} alt="" style={{width:'70%', marginLeft:'80px'}}/>
              </div>
              <img src={lin} alt="Lin" className={styles.imgBtn}  style={{marginLeft:'-20px'}}/>
            </Link>
            <Link to={suspend === 0 ? `/create` : ''} className='d-flex' onClick={suspendAlarm}>
              
              <img src={nie} alt="nie"  className={styles.imgBtn} style={{marginLeft:'-40px', marginRight:'-40px'}}/>
              <div className='mt-5'>
                <h2 style={{marginLeft:'15vw', marginBottom:'-60px', fontSize:'3.6rem'}}>Criar</h2>
                <img src={create} alt="" style={{width:'60%'}}/>
              </div>
            </Link>
        </div>
      </div>
      <div className={`card ${styles.blueprint} ${styles.coloredText}`}>
        <img className='card-img' src={blueprint} alt="blueprint"/>
        <div className={`card-img-overlay`}>
          <h1 style={{fontSize:'2.3vw', textAlign:'initial', marginLeft:'0', marginTop:'5.5vw'}}>
          <span>O que é o Linniê?</span>
          </h1>
          <h3 style={{textAlign:'initial', marginLeft:'0', marginTop:'3.0vw'}}>
           O Linniê é uma ferramenta importante para o estudo da moda, 
          <br/>permitindo que as pessoas tenham acesso a informações,
          <br/>inspiração e que expressem sua individualidade por meio da
          <br/>criação de peças únicas e personalizadas.
          <br/>Em resumo, é uma ferramenta valiosa pois permite que
          <br/>os todos consigam acompanhar as últimas tendências,
          <br/>descubram novos designers, conectem-se com outros
          <br/>estudantes e profissionais do setor e fiquem atualizados 
          <br/>sobre as últimas notícias e eventos na moda.
          </h3>
        </div>
      </div>
      <div className={styles.devsArea}>
        <h1 className='mx-auto my-5' style={{fontFamily:'Gotu', fontSize:'3rem'}}>Desenvolvedores</h1>
        <DevCardsList/>
      </div>
    </>
  );
}

export default Home;
