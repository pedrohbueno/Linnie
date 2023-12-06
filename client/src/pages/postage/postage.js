import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom"
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './css/modelslide.css'
import axios from 'axios';
import axios2 from 'axiosConfg'
import { AiFillHeart, AiOutlineHeart } from  'react-icons/ai'
import Popup from './popup'; // Certifique-se de que o caminho esteja correto
import { ToastContainer, toast } from 'react-toastify';
import { AuthContext } from 'AuthContext';

import 'react-toastify/dist/ReactToastify.css';
// import yChat from './img/yChat.png'
// import sChat from './img/sChat.png'
function Postage() {
  const { suspend } =  useContext(AuthContext)
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const postId = params.get("slide");
  const [ isLiked, setIsLiked ] = useState(false)
  const [likeCount, setLikeCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate()
  console.log(postId)

  const [show, setShow] = useState(3);
  const [keyForSlider, setKeyForSlider] = useState(0);
  const [messages, setMessages] = useState();
  
  const [ postageData, setPostageData ] = useState()
  
  const meuComponenteRef = useRef(null);

  useEffect(() => {
    // Exemplo de solicitação a uma rota protegida
    console.log('rota: ',localStorage.getItem('jwtToken'))
    if (localStorage.getItem('jwtToken')) {
      axios2.get('http://localhost:8000/postinfo', {
        params: {
          pk_id_patt: parseInt(postId)
        }
      })
      .then((response) => {
        setPostageData(response.data);
        setMessages(response.data.comments)

      })
      .catch((error) => {
        console.log(error)
        console.error(error);
      });
      axios2.get('http://localhost:8000/liked', {
      params: {
        pk_id_patt: parseInt(postId)
      }
      })
      .then((response) => {
        setIsLiked(response.data.bool_liked)
        console.log('Liked:', response.data)
      })
      .catch((error) => {
        console.log(error)
        console.error(error);
      });
    }else{
      axios.get('http://localhost:8000/postinfo2', {
        params: {
          pk_id_patt: parseInt(postId)
        }
      })
      .then((response) => {
        setPostageData(response.data);
        setMessages(response.data.comments)
      })
      .catch((error) => {
        console.log(error)
        console.error(error);
      });
    }
    axios.get('http://localhost:8000/countLike', {
      params: {
        pk_id_patt: parseInt(postId)
      }
    })
    .then((response) => {
      setLikeCount(response.data)

    })
    .catch((error) => {
      console.log(error)
      console.error(error);
    });


  }, [postId]); 
  
  
    
  console.log('messages', messages, isLiked)
  
  const [ commentary, setCommentary ] = useState('')
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (commentary && localStorage.getItem('jwtToken') && suspend === 0) {
      try {
        const commData = {
          cont_comm: commentary
        };
    
        setPostageData(prevState => {
          if (!prevState) return prevState; // Retorna o estado atual se ainda não houver dados
    
          return {
            ...prevState,
            comments: [...prevState.comments, { cont_comm: commentary }] // Adiciona o novo comentário à lista
          };
        });
        // Limpa o campo de comentário
        const response = await axios2.post('http://localhost:8000/CommentCreate', commData)
        if (response.status === 200) {
          const response = await axios2.get('http://localhost:8000/postinfo', {
            params: {
              pk_id_patt: parseInt(postId)
            }
          });
          
          setMessages(response.data.comments);
          setCommentary('');
          
        }
        
  
      } catch (error) {
        console.error('Erro ao enviar dados:', error);
      }
    }
    else{
      if (suspend === 1) {
        toast('Usuário suspendido')
      }else if (!localStorage.getItem('jwtToken')){
        toast('user não Logado')
      }
    }
  }
  
  const handleDownload = () => {
    if (suspend === 1 || !localStorage.getItem('jwtToken')) {
      if (!localStorage.getItem('jwtToken')) {
        toast('user não Logado')
      }else if (suspend === 1 ) {
        toast('Usuário suspendido')
      }
    }else{
    const link = document.createElement('a');
    link.href = postageData.pattern_patt;
    link.download = `${postageData.title_patt}.pdf`;
    link.target = "_blank"; // Abre o link em uma nova aba/janela
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);}
  };

  const handleClick = async () => {
    if (localStorage.getItem('jwtToken') && suspend === 0) {
      try {
        const postData = {
          pk_id_patt: postId,
        };
    
        // Realiza a solicitação HTTP imediatamente
        const response = await axios2.post('http://localhost:8000/like', postData);
        if (response.status === 200) {
          axios.get('http://localhost:8000/countLike', {
            params: {
              pk_id_patt: parseInt(postId)
            }
          })
          .then((response) => {
            setLikeCount(response.data)
  
          })
          .catch((error) => {
            console.log(error)
            console.error(error);
          });
          axios2.get('http://localhost:8000/liked', {
          params: {
            pk_id_patt: parseInt(postId)
          }
          })
          .then((response) => {
            setIsLiked(response.data.bool_liked)
            console.log('Liked:', response.data)
          })
          .catch((error) => {
            console.log(error)
            console.error(error);
          });
        }
      } catch (error) {
        console.error('Erro ao processar "like":', error);
      }
    }else{
      if (suspend === 1) {
        toast('Usuário suspendido')
      }else if (!localStorage.getItem('jwtToken')){
        toast('user não Logado')
      }
    }
  };

  const handleDelete = async () => {
    try {
      const deleteData = {
        pk_id_patt: postId,
      };
  
      // Use async/await para esperar a conclusão da chamada da API
      await axios2.post('http://localhost:8000/deletePost', deleteData);
  
      // Redirecione para a rota /explore após a exclusão bem-sucedida
      navigate('/explore');
    } catch (error) {
      // Lida com erros na chamada da API ou qualquer outra operação no bloco try
      console.error('Erro ao excluir o post:', error);
  
      // Se desejar, você pode adicionar uma notificação de erro ou outra lógica de tratamento aqui
    }
  };
  
  
  useEffect(() => {
    if (postageData) {
      console.log(postageData)
      if (postageData.img_patt1 && postageData.img_patt2 && postageData.img_patt3) {
        setShow(3)
      } else if (postageData.img_patt1 && postageData.img_patt2) {
        setShow(3)
      } else if (postageData.img_patt1) {
        setShow(1)
      }
    }
    // Chame setKeyForSlider para forçar a reinicialização do slider
    setKeyForSlider(prevKey => prevKey + 1);
    if (meuComponenteRef.current) {
      meuComponenteRef.current.scrollTop = meuComponenteRef.current.scrollHeight;
    }

  }, [setKeyForSlider, postageData])

  const settings = {
    className: "slider center",
    centerMode: true,
    centerPadding: "20px",
    arrows:false,
    infinite: true,
    initialSlide: 0,
    slidesToShow: show,
    slidesToScroll: 1,
    draggable: false,
    speed: 500
    
  };
  const [slider, setSlider] = useState(null);

  const next = () => {
    slider.slickNext();
  };

  const prev = () => {
    slider.slickPrev();
  };
  const prevIcon= "<"
  const nextIcon= ">"
  const handleShow = () => {
    // Mostra a janela de popup
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    // Fecha a janela de popup
    setShowPopup(false);
  };

  const handlePopupConfirm = () => {
    handleDelete()
    setShowPopup(false);
  };
  console.log(postageData)
  if (!postageData) {
    return(
      <h1>Carregando</h1>
    )
  }
  return (
    <> 
    <ToastContainer />
    {postageData.isadm_user === 1 &&(
      <button type='button' onClick={handleShow}>
        Apagar
      </button>
    )}
    {showPopup && <Popup onClose={handlePopupClose} onConfirm={handlePopupConfirm} />}
      <Slider key={keyForSlider} {...settings} ref={slider => setSlider(slider)}>
            
        {postageData.img_patt1 && (
          <div className='slide-content'>
              <div className="card mx-auto" style={!postageData.img_patt2 ? { width: '60vw' } : null}>
                <img className='card-img m-auto' src={postageData.img_patt1} alt={postageData.title_patt}/>
                <div className='slideMask card-img-overlay m-auto'></div>
              </div>
          </div>
        )}

        {postageData.img_patt2 && (
          <div className='slide-content'>
              <div className="card">
                <img className='card-img m-auto' src={postageData.img_patt2} alt={postageData.title_patt}/>
                <div className='slideMask card-img-overlay m-auto'></div>
              </div>
          </div>
        )}

        {postageData.img_patt3 && (
          <div className='slide-content'>
              <div className="card">
                <img className='card-img m-auto' src={postageData.img_patt3} alt={postageData.title_patt}/>
                <div className='slideMask card-img-overlay m-auto'></div>
              </div>
          </div>
        )}

        {postageData.img_patt1 && (
          <div className='slide-content'>
              <div className="card">
                <img className='card-img m-auto' src={postageData.img_patt1} alt={postageData.title_patt}/>
                <div className='slideMask card-img-overlay m-auto'></div>
              </div>
          </div>
        )}

        {postageData.img_patt2 && (
          <div className='slide-content'>
              <div className="card">
                <img className='card-img m-auto' src={postageData.img_patt2} alt={postageData.title_patt}/>
                <div className='slideMask card-img-overlay m-auto'></div>
              </div>
          </div>
        )}

        {postageData.img_patt3 && (
          <div className='slide-content'>
              <div className="card">
                <img className='card-img m-auto' src={postageData.img_patt3} alt={postageData.title_patt}/>
                <div className='slideMask card-img-overlay m-auto'></div>
              </div>
          </div>
        )}

      </Slider>
      <button onClick={prev} className='btn-slider btn-prev'><h1 style={{ color: '#D0BEC3', display:postageData.img_patt2 ? 'block' : 'none' }}>{prevIcon}</h1></button>
      <button onClick={next} className='btn-slider btn-next'><h1 style={{ color: '#D0BEC3', display:postageData.img_patt2 ? 'block' : 'none' }}>{nextIcon}</h1></button>

      <div className="container mb-5">
        <div className="row">
          <div className="col-5">

            <h1>{postageData.title_patt}</h1>

            <div className='d-flex flex-row'>
              <div className=''>
                <Link  to={`/user?profile_query=${postageData.pk_id_user}`}>
                  <img className='rounded-circle' src={postageData.pfp_user} alt="" width="100px" height="100px"/>
                </Link>
              </div>
              <h3 className='mx-4 my-auto'>{postageData.name_user}</h3>
            </div>

            <p className='text-break '>{postageData.desc_patt}</p>
          </div>
          <div className="col-4" style={{marginLeft:"110px"}}>
            <div className="text-end">
              <div className="d-flex justify-content-center align-items-center">
                <button onClick={handleClick} style={{color: '#C24E85'}}>
                  {isLiked ? <AiFillHeart /> : <AiOutlineHeart />}
                </button>
                <p className='my-auto fs-3' >{likeCount}</p>
              </div>
              
              <button style={{ backgroundColor: "#c25e84", height:"40px", padding:"7px 40px", borderRadius:"20px",margin:"auto"}} onClick={handleDownload}><h5>Download</h5></button>
              <hr/>
              <h3>Comentários</h3>
            </div>

            <div className='comment-container ' id='yourDiv' ref={meuComponenteRef}>
              {messages.map((comment, index) =>{
                const isUserComment = !comment.bool_comment;
                const commentStyle = isUserComment
                  ? { margin: "-40px 0px 3px 90px" }
                  : { color: "#FCD074", backgroundColor: "black" };
              
                return (
                  <div key={index} className={isUserComment ? "d-flex flex-row" : "mt-5 d-flex flex-row-reverse"}>
                    {isUserComment && (
                      <>
                        <Link className='rounded-circle shadow p-2' to={`/user?profile_query=${comment.pk_id_user}`}>
                          <div className='userBorder'>
                            <img className='rounded-circle' src={comment.pfp_user} alt="" width="60px" height="60px" />
                          </div>
                          
                        </Link>
                        <h4 className={isUserComment ? 'mx-2 mt-4' : 'mx-5'} style={{margin: "-40px 0px 3px 90px", color:'#C25E84'}}>
                          {comment.name_user}
                        </h4>
                      </>
                    )}
                    <>
                      <h4 className={isUserComment ? 'mx-2 mt-4' : 'mx-5'} style={commentStyle}>
                        {comment.cont_comm}
                      </h4>
                    </>
                  </div>
                );
              })}
            </div>
            
            
            <form onSubmit={handleSubmit} className='mt-5 d-flex '>
              <input name="comm" className="mx-4 fs-4 rounded-3 px-3" type="text" placeholder="adicionar comentário..." value={commentary} onChange={(e)=> setCommentary(e.target.value)} />
              <button className='btn btn-dark' type="submit">Enviar</button>
            </form>
          </div>

        </div>
      </div>
    </>
  );  
}


export default Postage;
