import './App.css';
import { useLocation, Outlet, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar/navbar';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { AuthContext } from 'AuthContext';
import axios from 'axiosConfg';
function App() {
  const location = useLocation();
  const navigate = useNavigate()

  const [user, setUser] = useState(true)
  const [value, setValue] = useState('1');
  
  const  [ dec, setDec ]  =  useState(null)
  const [ size, setSize ] =  useState(null)
  const [ tag, setTag ] =  useState(null)
  const [ suspend, setSuspend ] =  useState()
  
  
  const logout = () =>{
    localStorage.removeItem('jwtToken');
    setUser(false)
  }

  const haddleChange = ()=>{
    if(user ===  false){
      navigate("/login")
    }
  }


  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token){
      setUser(true)
      axios.get('/suspendInfo')
      .then((response) => {
        setSuspend(response.data.suspend_user);
        console.log(response.data)
      })
      .catch((error) => {
        console.error(error);
      });
    }else{
      setUser(false)
    }
    if (!(location.pathname === '/login' || location.pathname === '/register')) {
      document.body.classList.add("appBody"); // adiciona classe ao body
      return () => {
        document.body.classList.remove("appBody"); // remove classe do body
      };
    }
  }, [location.pathname]);

  if (location.pathname === '/login' || location.pathname === '/register') {
    return (
      <AuthContext.Provider
        value={{  }}>
        <div className="App">
          <header className="App-header">
            <Outlet />
          </header>
        </div>
      </AuthContext.Provider>
    );
  } else {
    return (
      <AuthContext.Provider
        value={{ user, logout, haddleChange, value, setValue, dec, setDec, size, setSize, tag, setTag, suspend }}>
        <div className="App">
          <header className="App-header">
            <Navbar />
            <Outlet />
          </header>
        </div>
      </AuthContext.Provider>
    );
  }
}

export default App;
