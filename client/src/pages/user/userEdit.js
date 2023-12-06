// React
import React, { useEffect, useState } from 'react';
import style from './css/user.module.css';
import axios from '../../axiosConfg'; // Importe o Axios configurado
import axios2 from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AiOutlineArrowRight } from 'react-icons/ai';
function UserEdit() {
  
  const [ imageSelected, setImageSelected ] = useState('')

  const [value, setValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const [name, setName] = useState();
  const [userEditData, setUserEditData] = useState(null);

  useEffect(() => {
    document.body.classList.add('backgroundImage'); // adiciona classe ao body
    return () => {
      document.body.classList.remove('backgroundImage'); // remove classe do body
    };
  }, []);


  function handleSelected(image) {
    switch (image) {
      case "perfil1":
        setValue('profiles/profile1.png');
        break;
      case "perfil2":
        setValue('profiles/profile2.png');
        break;
      case "perfil3":
        setValue('profiles/profile3.png');
        break;
      case "perfil4":
        setValue('profiles/profile4.png');
        break;
      case "perfil5":
        setValue('profiles/profile5.png');
        break;
      default:
        setValue();
    }
  }

  useEffect(() => {
    // Exemplo de solicitação a uma rota protegida
    axios.get('/edit')
      .then((response) => {
        setUserEditData(response.data);
        setName(response.data.name_user);
        setValue(response.data.pfp_user);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const profile = value;
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    let imgUrl = '';
    if (imageSelected) {
      const formData = new FormData();
      formData.append("file", imageSelected);
      formData.append("upload_preset", "pwtmennc");

      const response = await axios2.post(
      "https://api.cloudinary.com/v1_1/linnieimages/image/upload",
      formData
      );

      imgUrl = response.data.secure_url;
    }
    try {
      const userData = {
        nick_user: 'nick',
        name_user: name,
        pfp_user: imgUrl ? imgUrl: profile,
      };
      const response = await axios.post('/update', userData);

      // Verifique se a resposta da requisição é bem-sucedida antes de navegar
      if (response.status === 200) {
        navigate('/user');
        window.location.reload();
      } else {
        console.error('Erro ao enviar dados. Status:', response.status);
      }
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
    }
  };
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  function handleChange(e) {
    
    setIsOpen(false);
    setImageSelected(e.target.files[0])
    setValue(URL.createObjectURL(e.target.files[0]))
  }
  

  if (userEditData === null) {
    // Aguarde até que os dados sejam carregados
    return <div>Loading...</div>;
  }
  

  return (
    <div className={`container-fluid ${style.userEdit} `}>
      <div className='d-flex'>

        <div className={`col-3 col-x-5 p-3 m-5 mx-auto ${style.box}`} style={{ height: '60%' }}>
          <div className='row'>
            <div className='col'>
              <div className={`card ${style.userEditAvatar}`}>
                <img className={`rounded-circle card-img ${style.avatarPreview}`} id='avatarPreview' src={value ? value : userEditData.pfp_user} alt="" />
                <div className="btn-group card-img-overlay">
                  <button
                    type="button"
                    className={`btn btn-secondary rounded-circle fs-1 m-5 ${style.btnAvatarChange}`}
                    onClick={handleToggle}
                  >
                    <AiOutlineArrowRight color='black' />
                  </button>
                  {isOpen && (
                    <ul className={`${style.userEditDropdown}`} >
                      <div className={`d-flex align-items-center ${style.dropdownMenu}`} >
                        <button onClick={() => handleSelected("perfil1")}>
                          <img src="../profiles/profile1.png" alt='' />
                        </button>
                        <button onClick={() => handleSelected("perfil2")}>
                          <img src="../profiles/profile2.png" alt='' />
                        </button>
                        <button onClick={() => handleSelected("perfil3")}>
                          <img src="../profiles/profile3.png" alt='' />
                        </button>
                        
                        <button onClick={() => handleSelected("perfil4")}>
                          <img src="../profiles/profile4.png" alt='' />
                        </button>
                        <button onClick={() => handleSelected("perfil5")}>
                          <img src="../profiles/profile5.png" alt='' />
                        </button>
                        <label 
                          className={`form-label text-white ${style.chooseAvatar}`} 
                          htmlFor="chooseAvatar"
                          style={{
                            backgroundImage: imageSelected ? `url(${URL.createObjectURL(imageSelected)})` : 'none'
                          }}
                  
                        >{imageSelected ? '': '+'}</label>
                        <input type="file" className="input-file d-none " id="chooseAvatar" accept="image/*" onChange={handleChange}/>
                      </div>
                    </ul>
                  )}
                </div>
              </div>
              <div className='d-flex mt-5'>
                <div className='mx-auto'>
                  <p className={style.userEditSubTitle}>Seguidores</p>
                  <h2 className='mx-4'>{userEditData?.follower_user}</h2>
                </div>
                <div className={style.verticalLine}></div>
                <div className='mx-auto'>
                  <p className={style.userEditSubTitle}>Seguindo</p>
                  <h2 className='mx-4'>{userEditData?.following_user}</h2>
                </div>
              </div>
              <button className={`mx-auto ${style.userEditButton}`} type='submit' onClick={handleUpdate}>Salvar alterações</button>
            </div>
          </div>
        </div>

        <div className={`col-6 m-5 mx-auto`}>
          <div className={`p-5 ${style.box}`}>
            <div className='d-flex flex-column align-items-center'>
              <h1 className={style.userEditTitle}>Meu Perfil</h1>
              <div className={style.horizontalLine}></div>
              <h5 className={`mx-auto text-center ${style.userEditSubTitle}`}>*veja e edite suas informações visíveis</h5>
            </div>
            <div className="d-flex mt-5">
              <div className='mx-auto'>
                <label className='form-label' htmlFor="userName">Nome de usuário:</label><br />
                <input
                  className='form-control'
                  type='text'
                  name='userName'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className='mx-auto'>
                <label className='form-label' htmlFor="surName">Apelido</label><br />
                <input className='form-control' type="text" name='surName' value={userEditData?.surName} />
              </div>
            </div>
          </div>

          <div className={`mt-5 p-5 ${style.box}`}>
            <div className='d-flex flex-column align-items-center'>
              <h1 className={style.userEditTitle}>Informações pessoais</h1>
              <div className={style.horizontalLine}></div>
              <h5 className={`mx-auto text-center ${style.userEditSubTitle}`}>*Atualize as informações pessoais da sua conta</h5>
            </div>
            <div className="d-flex mt-5">
              <div className='mx-auto'>
                <label className='form-label' htmlFor="name">Nome:</label><br />
                <input className='form-control' type="text" name='name' value={name} />
              </div>
              <div className='mx-auto'>
                <label className='form-label' htmlFor="">Sobrenome</label><br />
                <input className='form-control' type="text" name='surName' value={userEditData.surName} />
              </div>
            </div>
            <div className="d-flex mt-5">
            <div className='mx-auto'>
              <label className='form-label' htmlFor="email">E-mail:</label><br />
              <input className='form-control' type="text" name='email' value={userEditData.email} />
            </div>
              <div className='mx-auto'>
                <label className='form-label' htmlFor="phone">Telefone</label><br />
                <input className='form-control' type="text" name='phone' />
              </div>
            </div>
            <button className={`mx-auto mt-5 ${style.userEditButton}`}  style={{ width:"auto", paddingLeft: "100px", paddingRight: "110px", }}>
              <Link style={{
                color: "#fff",
                textDecoration: "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize:"20px",
                width:"auto"
              }}
              to="/">Redefinir Senha</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserEdit;
