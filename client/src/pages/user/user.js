//React
import {  useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

//CSS
import styles from './css/user.module.css'

//Imagens
import button from './img/button.png'
import axios from 'axiosConfg'
import axios2 from 'axios'
import { AuthContext } from 'AuthContext';



function UserCards() {
  const [patternData, setPatternData] = useState()
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const profileQuery = searchParams.get('profile_query') || '';
  useEffect(() => {
    // Exemplo de solicitação a uma rota protegida
    axios.get('/user_pattern', {
      params: {profile_query: profileQuery},
    })
      .then((response) => {
        setPatternData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [profileQuery]);
  if(!patternData){
    return(
      <h2 className='mx-auto text-center' style={{color:'grey', fontFamily:'GothicA1', fontSize:'1.6vw'}}>
        Usuário não tem moldes cadastrados
      </h2>
    )
  }
  return (
    <div className="container pt-5" >
      <div className="row" style={{overflowX:'hidden'}}>
        {patternData.img_patts.map((pattern, index) => {
          const image = pattern;
          return (
            <div
              key={index}
              className="col-sm-12 col-md-6 col-lg-4 col-xl-3 col-xxl-3 mb-5"
            >
              
                <div className="shadow-lg card card-link">
                  <Link
                    to={`/postage?slide=${patternData.pk_id_patts[index]}`}
                    className="text-decoration-none"
                    style={{ color: 'black' }}
                  >
                    <img
                      src={image}
                      alt={'aaa'}
                      className="card-img-top rounded-circle"
                      style={{ height: '400px' }}
                    />
                    <svg className='card-img-overlay' width="360" height="410">
                      <rect x="2" y="2" width="285" height="360" style={{fill:'transparent', strokeWidth:'3', stroke:'#000000', strokeDasharray:'8', strokeLinecap:'round'}} />
                    </svg>
                  </Link>
                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function User() {
  const [userData, setUserData] = useState(null);
  const [queryDisplay, setQueryDisplay] = useState('');
  const [followed, setFollowed] = useState();
  const [following, setFollowing] = useState();
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const profileQuery = searchParams.get('profile_query') || '';
  const { suspend } =  useContext(AuthContext)
  useEffect(() => {
    if (profileQuery) {
      setQueryDisplay('none')
    }else{
      setQueryDisplay('block')
    }
    // Exemplo de solicitação a uma rota protegida
    axios.get('/profile', {
      params: {profile_query: profileQuery},
    })
    .then((response) => {
      setUserData(response.data);
      setFollowed(response.data.followed);
      setFollowing(response.data.following);

      console.log(response.data)
    })
    .catch((error) => {
      console.error(error);
    });
  }, [profileQuery]);

  
  const imagens = [
    '/img/loading1.png',
    '/img/loading2.png',
    '/img/loading3.png',
    '/img/loading4.png',
    '/img/loading5.png',
  ];

  const [imagemAtual, setImagemAtual] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Atualiza para a próxima imagem no array
      setImagemAtual((prevImagem) => (prevImagem + 1) % imagens.length);
    }, 400  ); // Altere este valor para ajustar a velocidade da animação (em milissegundos)

    // Função de limpeza do intervalo para evitar vazamentos de memória
    return () => clearInterval(intervalId);
  }, [imagens.length]);

  const handleSuspend = async () => {
    try {
      console.log(userData.pk_id_user)
  
      const suspendData = {
        pk_id_user: userData.pk_id_user
      }
      // Use async/await para esperar a conclusão da chamada da API
      await axios2.post('http://localhost:8000/suspendUser', suspendData);
  
    } catch (error) {
      // Lida com erros na chamada da API ou qualquer outra operação no bloco try
      console.error('Erro ao excluir o post:', error);
  
      // Se desejar, você pode adicionar uma notificação de erro ou outra lógica de tratamento aqui
    }
  }

  const handleFollow = async () => {
    try {
      console.log(userData.pk_id_user)
  
      const followData = {
        pk_id_user: userData.pk_id_user
      }
      // Use async/await para esperar a conclusão da chamada da API
      const response = await axios.post('http://localhost:8000/followUser', followData);
      if (response.status === 200) {
        axios.get('/profile', {
          params: {profile_query: profileQuery},
        })
        .then((response) => {
          setUserData(response.data);
          setFollowed(response.data.followed);
          setFollowing(response.data.following);
    
          console.log(response.data)
        })
        .catch((error) => {
          console.error(error);
        })
      }
    } catch (error) {
      // Lida com erros na chamada da API ou qualquer outra operação no bloco try
      console.error('Erro ao excluir o post:', error);
  
      // Se desejar, você pode adicionar uma notificação de erro ou outra lógica de tratamento aqui
    }
  }

  const suspendAlarm = ()=> {
    if (userData.suspend_user === 1) {
      toast('Usuário suspendido')
    }
  }

  if (!userData) {
    return (
      <div className='w-100 d-flex align-items-center justify-content-center'>
        <img className='m-auto' src={imagens[imagemAtual]} alt={`Imagem ${imagemAtual + 1}`} />
      </div>
    )
  }
  return(
    <>
      <ToastContainer/>
      <div className="container-fluid">
        <div className="row">
          <div className={`col-sm-5 col-md-4 col-lg-3 col-xl-3 col-xxl-3 p-5 ${styles.sidebar}`}>
            <div className="row d-flex justify-content-center">
              <img src={userData.pfp_user} alt="foto de Perfil inteira" className={styles.userImg}  height='210px'/> 
              <h1>@{userData.name_user}</h1>
            </div>

            <div className='d-flex my-2'>
              <div className='mx-auto'>
                <p className={`col-2 ${styles.userEditSubTitle}`} >Seguidores</p>
                <h2 className='mx-4'>{followed}</h2>
              </div>
              <div className={`mx-auto ${styles.verticalLine}`}></div>
              <div className='mx-auto'>
                <p className={`col-2 ${styles.userEditSubTitle}`}>Seguindo</p>
                <h2  className='mx-4'>{following}</h2>
              </div>
            </div>
            <div className=" d-flex justify-content-center" >
              <Link to={suspend === 0 ? `/user_edit` : ''} className={`btn mb-4 fs-4  ${styles.btnPerfilEdit}`} style={{display: queryDisplay}} onClick={suspendAlarm}>Editar Perfil</Link>
            </div>
            
            <div className="d-flex flex-column justify-content-center" >
              <p className="fs-4 mx-auto" style={{display: queryDisplay}}>Bem vindo ao seu perfil!</p>
              <p className='fs-5 text-center' style={{display: queryDisplay}}>Aqui você consegue acompanhar todas as suas atividades no site Linniê.</p>
            </div>

            {userData.isadm_user === 1&& profileQuery &&(
              <button type='button' onClick={handleSuspend}>
                Suspender
              </button>
            )}
            {userData.isadm_user === 0 && profileQuery && profileQuery !== localStorage.getItem('jwtToken') &&(
              <button className={`${styles.btnSaveFolow}`}  type='button' onClick={handleFollow}>
                {!userData.bool_follow ? 'Seguir' : 'DesSeguir'}
              </button>
            )}
          </div>
          <div className={`${styles.portfolio} col pb-3`}>
            <div className="row p-3">
              <h1 className="mt-5 text-center">Portfólio</h1>
              <UserCards/>
            </div>
          </div>
        </div>
      </div>
      {userData.isadm_user === 0 && !profileQuery &&(
        <Link to="/create" className={styles.createBtn}>
          <img src={button} alt="" className={styles.imgBtn}/>
        </Link>)
      }
    </>
  )
}

export default User