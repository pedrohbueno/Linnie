// AuthCheck.js
import React, { useContext, useEffect, useState } from 'react';
import Popup from './popup'; // Certifique-se de que o caminho esteja correto
import { Link } from 'react-router-dom';
import { AuthContext } from 'AuthContext';
import axios from 'axiosConfg';
import { ButtonPink, ButtonYellow } from '../../../components/Inputs/buttons/buttons';
import styles from './css/authcheck.module.css';
import MobileDropdown from '../MobileDropdown/MobileDropdown';

export default function AuthCheck() {
  const { logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Exemplo de solicitação a uma rota protegida
    axios
      .get('/profile')
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleLogout = () => {
    // Mostra a janela de popup
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    // Fecha a janela de popup
    setShowPopup(false);
  };

  const handlePopupConfirm = () => {
    // Lógica de logout aqui
    setShowPopup(false);
    logout(); // Logout após confirmação
    window.location.reload()
  };

  if (userData) {
    return (
      <>
        <div className={`${styles.dropdown} dropdown`}>
          <button
            className="btn dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img src={userData.pfp_user} width="50" height="50" alt="" />
          </button>
          <ul className={`${styles.dropdownMenu} dropdown-menu`} aria-labelledby="dropdownMenuButton" style={{ left: '-5rem', top: '4.4rem' }}>
            <li>
              <Link className="dropdown-item" to="/user">
                Perfil
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/settings">
                Ajuda
              </Link>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <Link className="dropdown-item" to="" onClick={handleLogout}>
                Sair
              </Link>
            </li>
          </ul>
        </div>
        <MobileDropdown />
        {showPopup && <Popup onClose={handlePopupClose} onConfirm={handlePopupConfirm} />}
      </>
    );
  } else {
    return (
      <div className="d-flex">
        <ButtonPink className="mx-auto btn btn-dark" text="Entrar" width="4rem" link="/login" />
        <ButtonYellow text="Cadastrar" width="6rem" link="/register" />
      </div>
    );
  }
}
