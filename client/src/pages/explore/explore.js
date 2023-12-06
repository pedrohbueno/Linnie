import { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AiFillHeart } from  'react-icons/ai';
import { BsFillChatDotsFill } from  'react-icons/bs';
import axios from 'axios';
import button from './img/button.png'

import { AuthContext } from 'AuthContext';

function Explore() {
  
  const [patternData, setPatternData] = useState([]);
  const [ userData, setUserData ] = useState();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const profileQuery = searchParams.get('profile_query') || '';
  const { suspend } =  useContext(AuthContext)
  
  useEffect(() => {
    // Exemplo de solicitação a uma rota protegida
    axios.get('http://localhost:8000/explore')
      .then((response) => {
        setPatternData(response.data.patterns);
      })
      .catch((error) => {
        console.error(error);
      });

    axios.get('/profile')
    .then((response) => {
      setUserData(response.data);

      console.log(response.data)
    })
    .catch((error) => {
      console.error(error);
    })
  }, []);
  
  console.log('patterns: ', patternData)

  return (
    
    <><div className="container pt-5">
      <div className="d-flex flex-column align-items-center mb-5">
        <h1
          style={{
            fontFamily: "gotu",
            letterSpacing: '2px',
            fontSize: '40px',
          }}
        >
          O melhor do Linniê
        </h1>
        <h5 style={{ fontFamily: 'Gotu' }}>Os projetos no destaque de hoje</h5>
      </div>
      <div className="row">
        {patternData.map((pattern, index) => {
          return (
            <div
              key={index}
              className="col-sm-12 col-md-6 col-lg-4 col-xl-3 col-xxl-3 mb-5"
            >
              <div className="card card-link" style={{ boxShadow: "0px 4px 9px #808080", borderRadius: '20px' }}>
                <Link
                  to={`/postage?slide=${pattern.pk_id_patt}`}
                  className="text-decoration-none"
                  style={{ color: 'black' }}
                >
                  <div style={{ borderRadius: '10px' }} className="card">
                    <img
                      src={pattern.img_patt1}
                      alt={pattern.pk_id_patt}
                      className="card-img-top"
                      style={{
                        height: '400px',
                        boxShadow: '0px 4px 9px #808080'
                      }} />

                  </div>
                  <div className="card-footer d-flex justify-content-between">
                    <div className="user d-inline-flex">
                      <img
                        className='rounded-5'
                        src={pattern.UserL.pfp_user}
                        alt={pattern.UserL.name_user}
                        style={{ width: '35px', height: '35px' }} />
                      <p className="m-auto mx-2" style={{ fontFamily: 'Gotu', fontSize: 20.5 }}>{pattern.UserL.name_user}</p>
                    </div>
                    <div className="d-inline-flex">
                      <BsFillChatDotsFill className='m-auto' color='#FBCB66' size={19} />
                      <p className="m-auto mx-2">{pattern.numberComments}</p>
                      <AiFillHeart className='m-auto' color='#DA4F4F' size={23} />
                      <p className="m-auto mx-2">{pattern.numberLikes}</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    {!profileQuery &&(
      <Link to="/create" style={{
        display: 'block',
        position: 'fixed',
        color: '#C25E84',
        backgroundColor: 'transparent',
        bottom: '80px',
        right: '80px',
        zindex: '3'
      }}>
        <img src={button} alt="" />
      </Link>)
    }
  </>
  );
}

export default Explore;
