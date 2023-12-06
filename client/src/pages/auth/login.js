//Modules
import React, {useEffect, useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons'
import ErrorPopup from '../../components/ErrorPopup/errorPopup'

//CSS
import styles from './css/auth.module.css'

//imagens
import logo from './img/lin.png'
import axios from 'axios';

function Login() {
  useEffect(() => {
    document.body.classList.add(styles.background); // adiciona classe ao body
    return () => {
      document.body.classList.remove(styles.background); // remove classe do body
    };
    }, []);

    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [buttonPopup, setButtonPopup] = useState(false)

    const handleLogin = async () => {
      try {
        const userData = {
          email_user: email,
          pass_user: password,
        }
        const response = await axios.post('http://localhost:8000/login', userData);
        const { token } = response.data;

        localStorage.setItem('jwtToken', token);

        navigate('/');
        
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
        }
      }
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
                <h1>Seja Bem-Vindo</h1>
                <p>
                    <label htmlFor="user_email">E-mail</label>
                    <input name="email_user" type="email" id='user_email' required="required" value={email} onChange={(e)=> setEmail(e.target.value)} />
                </p>

                <p>
                    <label htmlFor="user_password">Senha</label>
                    <input name="pass_user" type="password" id='user_password' required="required" value={password} onChange={(e)=> setPassword(e.target.value)} />
                </p>

                <div className="d-flex flex-column align-items-center">
                    <Link to="/password">Esqueceu sua senha?</Link>
                    <button className={styles.btnC25E84} type="button" onClick={handleLogin}>
                        Entrar
                    </button>

                    <div className={styles.icons}>
                        <FontAwesomeIcon icon={faFacebook} />
                        <FontAwesomeIcon icon={faInstagram} />
                        <FontAwesomeIcon icon={faTwitter} />
                    </div>
                    <div className="d-flex">
                        <p>Não tem conta?</p>
                        <Link to="/register">Crie uma</Link>
                    </div>
                </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
