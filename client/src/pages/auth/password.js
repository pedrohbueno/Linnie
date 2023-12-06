//Modules
import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorPopup from '../../components/ErrorPopup/errorPopup'

//CSS
import styles from './css/auth.module.css'

//imagens
import logo from './img/lin.png'
import axios from 'axios';

function Password() {
  useEffect(() => {
    document.body.classList.add(styles.background); // adiciona classe ao body
    return () => {
      document.body.classList.remove(styles.background); // remove classe do body
    };
    }, []);

    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [displayEmail, setDisplayEmail] = useState('block');
    const [displayPassword, setDisplayPassword] = useState('none');
    const navigate = useNavigate();
    const [buttonPopup, setButtonPopup] = useState(false)

    const handleEmail = async () => {
      try {
        const userData = {
          email_user: email,
        }
        const response = await axios.post('http://localhost:8000/emailVerification', userData);
        console.log('Resposta do servidor:', response.data);
    

        if(response.data === 'OK'){
          
          setDisplayEmail('none')
          setDisplayPassword('block')
        }
        
      } catch (error) {
        if (error.response) {
          const { data } = error.response;
          if (data && data.erro && data.mensagem) {
            setError(data.mensagem);
            setButtonPopup(true)
          } else {
            setError('Erro desconhecido na autenticação');
            setButtonPopup(true)
          }
        } else if (error.request) {
        setError('Sem resposta do servidor. Verifique sua conexão com a internet.');
        setButtonPopup(true)
        } else {
        setError('Erro ao enviar a solicitação.');
        setButtonPopup(true)
        }
        setEmail('')  
        setPassword('')  
      }}
    const handlePassUpdate = async () => {
      try {
        const userData = {
          pass_user: password,
          conf_pass_user: confPassword,
        }
        const response = await axios.post('http://localhost:8000/passUpdate', userData);

        if(response.data === 'OK'){
          
          navigate('/login');
        }
        
      } catch (error) {
        if (error.response) {
          const { data } = error.response;
          if (data && data.erro && data.mensagem) {
            setError(data.mensagem);
            setButtonPopup(true)
          } else {
            setError('Erro desconhecido na autenticação');
            setButtonPopup(true)
          }
        } else if (error.request) {
        setError('Sem resposta do servidor. Verifique sua conexão com a internet.');
        setButtonPopup(true)
        } else {
        setError('Erro ao enviar a solicitação.');
        setButtonPopup(true)
        }
        setEmail('')  
        setPassword('')  
      }}
      console.log(error)
      
    const handleFormKeyDown = (e) => {
      if (e.key === 'Enter') {
          e.preventDefault();
      }
    }
  return (
    <div className="container mt-5">
      <ErrorPopup trigger={buttonPopup} setTrigger={setButtonPopup} error={error}/>
      <div className={`${styles.row} row`}>
        <div className="col-sm-12 col-md-9 col-lg-6 col-xl-5 col-xxl-5 m-auto">
          <form onKeyDown={handleFormKeyDown}>
            <div className="d-flex justify-content-center"><img src={logo} alt="" /></div>
            <h1 style={{display:displayEmail}}>Digite seu email</h1>
            <h1 style={{display:displayPassword}}>Digite sua nova senha</h1>
            <p style={{display:displayEmail}}>
                <label htmlFor="user_email">E-mail</label>
                <input name="email_user" type="email" id='user_email' required="required" value={email} onChange={(e)=> setEmail(e.target.value)} />
            </p>

            <p style={{display:displayPassword}}>
                <label htmlFor="user_password">Senha</label>
                <input name="pass_user" type="password" id='user_password' required="required" value={password} onChange={(e)=> setPassword(e.target.value)} />
            </p>

            <p style={{display:displayPassword}}>
                <label htmlFor="user_conf_password">Confirme sua senha</label>
                <input name="conf_pass_user" type="password" id='conf_user_password' required="required" value={confPassword} onChange={(e)=> setConfPassword(e.target.value)} />
            </p>
            <button className={`mx-auto ${styles.btnC25E84}`} style={{display: displayEmail}} type="button" onClick={handleEmail}>
              Enviar
            </button>
            <button className={`mx-auto ${styles.btnC25E84}`} style={{display: displayPassword}} type="button" onClick={handlePassUpdate}>
              Alterar senha
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Password;
