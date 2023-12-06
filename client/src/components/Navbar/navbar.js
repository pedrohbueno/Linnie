import React, { useState, useRef, useEffect, useContext } from 'react';
import { useLocation,Link, useNavigate } from 'react-router-dom';
//Imagens
import lin from './img/lin.png';
import explore_fill from './img/explore_fill.png';
import skirt_fill from './img/skirt_fill.png';
import comn_fill from './img/comn_fill.png'
import explore_border from './img/explore_border.png';
import skirt_border from './img/skirt_border.png';
import comn_border from './img/comn_border.png'

//Partials
import AuthCheck from 'partials/NavbarPartials/AuthCheck/AuthCheck';

//CSS
import { BsSearch } from  'react-icons/bs'
import styles from './css/navbar.module.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import SearchTab from '../../partials/NavbarPartials/SearchTab/SearchTab';
import { AuthContext } from 'AuthContext';

function Navbar() {
  const navigate = useNavigate();
  const { value, setValue, dec, size, tag } =  useContext(AuthContext)
  const [searchTerm, setSearchTerm] = useState('');

  console.log(value)
  const location = useLocation();
  let explore;
  let skirt;
  let comn;
  if (location.pathname === '/explore') {
    explore = explore_fill;
  } else {
    explore = explore_border;
  }
  if (location.pathname === '/skirt') {
    skirt = skirt_fill;
  } else {
    skirt = skirt_border;
  }
  if (location.pathname === '/comunity') {
    comn = comn_fill;
  } else {
    comn = comn_border;
  }

  const [tabDisplay, setTabDisplay] = useState('none')

  const divRef = useRef(null);
  
  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Verifica se o clique ocorreu fora da div
      if (divRef.current && !divRef.current.contains(event.target)) {
        setTabDisplay('none');
        setValue('1')
      }
    };

    // Adiciona o ouvinte de evento de clique ao nível do documento
    document.addEventListener('click', handleOutsideClick);

    // Remove o ouvinte de evento quando o componente é desmontado
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [setValue]);
  const handleSearch = (term) => {
    if(tag || size || dec ||term.trim().length > 0){
      navigate(`/results?search_query=${term}&tab_query=${value}&dec_query=${dec}&size_query=${size}&tag_query=${tag}`);
      setTabDisplay('none');
      setSearchTerm('')
      window.location.reload();
      console.log('dasda', value, searchTerm, term)
    }
  };
  console.log(value, searchTerm)

  return (
    <>
      <nav className={`${styles.navcustom} shadow-none navbar navbar-expand-lg navbar-light fixed-top`} ref={divRef}>
        <div className="container-fluid d-flex">
          <Link className="navbar-brand mt-3" to="/">
            <img src={lin} width="120" height="60" className="d-inline-block align-top" alt="" />
          </Link>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mx-5">
              <li className="nav-item">
                <Link className="nav-link" aria-current="page" to="/explore"><img src={explore} width="32" height="32" alt="" /></Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/skirt"><img src={skirt} width="32" height="32" alt="" /></Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/comunity"><img src={comn} width="32" height="32" alt="" /></Link>
              </li>
            </ul>
              <form className="d-flex" 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch(searchTerm);
              }}>
                <input 
                 className="form-control shadow-none search-input"
                 type="text"
                 placeholder="Pesquisar no site"
                 aria-label="search"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 onClick={() => setTabDisplay('block')}
                />
                <button type='submit'>
                  <BsSearch 
                    className={`my-auto ${styles.inputIcon}`} 
                    size={15} 
                    style={{position:'relative', right:'30', cursor:"pointer"}} 
                  /> 
                </button>
                <div> <SearchTab display={tabDisplay}  /></div>
              </form>
          </div>
          <AuthCheck/>
        </div>
      </nav>  
    </>
  );
}
export default Navbar;
