//Modules
import React, {useContext, useEffect, useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons'


//CSS
import styles from './css/auth.module.css'

//imagens
import logo from './img/lin.png'
import { AuthContext } from 'AuthContext';
import axios from 'axios';

function Register() {
  useEffect(() => {
    document.body.classList.add(styles.background); // adiciona classe ao body
    return () => {
      document.body.classList.remove(styles.background); // remove classe do body
    };
  }, []);
  const { user } =  useContext(AuthContext)
  console.log(user)
  const [ name, setName] = useState()
  const [ email, setEmail] = useState()
  const [ pass, setPass] = useState()
  const [ confpass, setConfPass] = useState()
  const  profile = 'profiles/profile1.png'

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const userData = {
        name_user: name,
        email_user: email,
        pfp_user: profile,
        pass_user: pass,
        conf_pass_user: confpass
      };
  
      const response = await axios.post('http://localhost:8000/add', userData);

      const { token } = response.data;

      localStorage.setItem('jwtToken', token);
      navigate('/');
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
    }

  };
  const handleFormKeyDown = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
    }
}
  return (
    <div className="container  mt-3">
      <div className={`${styles.row} row`}>
        <div className="col-sm-12 col-md-9 col-lg-6 col-xl-5 col-xxl-5 m-auto">
          <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown}>
            <div className="d-flex justify-content-center"><img src={logo} alt="" /></div>
            <h1>Crie sua conta</h1>
            <p>
              <label htmlFor="user_name">Nome de usuário</label>
              <input id="user_name" name="name_user" type="text" required="required" onChange={(e)=>{setName(e.target.value)}}/>
            </p>

            <p>
              <label htmlFor="user_email">E-mail</label>
              <input id="user_email" name="email_user" type="text" required="required" onChange={(e)=>{setEmail(e.target.value)}}/>
            </p>

            <p>
              <label htmlFor="user_password">Senha</label>
              <input id="user_password" name="pass_user" type="password" required="required" onChange={(e)=>{setPass(e.target.value)}}/>
            </p>

            <p className="mb-5">
              <label htmlFor="user_password_confirm">Confirme sua senha</label>
              <input id="user_password_confirm" name="conf_pass_user" type="password" required="required" onChange={(e)=>{setConfPass(e.target.value)}}/>
            </p>

            <div className="d-flex flex-column align-items-center">

              <button className={styles.btnC25E84} type="submit" > Cadastrar </button>
              <div className={styles.icons}>
                <FontAwesomeIcon icon={faFacebook} />
                <FontAwesomeIcon icon={faInstagram} />
                <FontAwesomeIcon icon={faTwitter} />
              </div>
              <div className="d-flex">
                <p>Já tem uma conta?</p>
                <Link to="/login">Entrar</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
