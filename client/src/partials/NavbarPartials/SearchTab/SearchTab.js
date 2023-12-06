import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import axios2 from 'axiosConfg';
import styles from './css/search.module.css'; // Importando os estilos CSS Modules
import CropImage from './CropImage.js'
import image1 from './img/image1.png'
import image2 from './img/image2.png'
import image3 from './img/image3.png'
import { AuthContext } from 'AuthContext';
import { useNavigate } from 'react-router-dom';

function SearchTab(props) {
  const { value, setValue,  setDec,  setSize,  setTag } =  useContext(AuthContext)

  const navigate = useNavigate()


  const [users, setUsers] = useState([]);
  const [tags, setTags] = useState([]);
  const [years, setYears] = useState([]);
  const [types, setType] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [ selectedImage, setSelectedImage ] = useState('')

  const handleChange = (event) => {
    setValue(event.target.value);
  };


  useEffect(() => {
    if (localStorage.getItem('jwtToken')) {
      axios2
      .get('http://localhost:8000/search_info2')
      .then((response) => {
        setUsers(response.data.userData);
        setTags(response.data.tagData);
        setSizes(response.data.sizeData)
        setYears(response.data.decadeData)
        setType(response.data.typeData)
      })
      .catch((error) => {
        console.error(error);
      });
    }else{
    axios
      .get('http://localhost:8000/search_info')
      .then((response) => {
        setUsers(response.data.userData);
        setTags(response.data.tagData);
        setSizes(response.data.sizeData)
        setYears(response.data.decadeData)
        setType(response.data.typeData)
      })
      .catch((error) => {
        console.error(error);
      });}

      
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
  
    if (file) {
      const reader = new FileReader();
  
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
  
      reader.readAsDataURL(file);
    }
  };
  console.log('years:', years, 'sizes:',sizes, 'tags:',tags, 'types:',types, 'users:',users)
  return (
    <div style={{ display: props.display, width: '100%' }} >
      <div className={` ${styles.tabContainer}`}> 
        <ul className="nav nav-tabs mt-3 mb-5 d-flex justify-content-center ">
          <li className="nav-item">
            <button
              type='button'
              className={`mx-4  ${value === '1' ? 'active' : ''}`}
              onClick={() => handleChange({ target: { value: '1' } })}
            >
              <h2>Usuários</h2>
            </button>
          </li>
          <div className='divider'></div>
          <li className="nav-item">
            <button
              type='button'
              className={`mx-4  ${value === '2' ? 'active' : ''}`}
              onClick={() => handleChange({ target: { value: '2' } })}
            >
              <h2>Tags</h2>
            </button>
          </li>
          <li className="nav-item">
            <button
              type='button'
              className={`mx-4  ${value === '3' ? 'active' : ''}`}
              onClick={() => handleChange({ target: { value: '3' } })}
            >
              <h2>Imagem</h2>
            </button>
          </li>
        </ul>

        {value === '1' && (
          <div className={`tab-content row ${styles.usersContainer}`}>
            <ul className=" list-group">
              {users.map((user, index) => (
                <li className={`list-group-item d-flex ${styles.userContent}`} key={index} onClick={()=>{
                  navigate(`/user?profile_query=${user.pk_id_user}`)
                  window.location.reload()
                }}>
                  <img className="rounded-circle" src={user.pfp_user} alt="" />
                  <div className='my-auto'>
                    <h4>{user.name_user}</h4>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {value === '2' && (
          <div className={`tab-content row ${styles.tagsContainer}`}>
            <div className="col-md-3">
              <h1>Décadas</h1>
              <div className="d-flex flex-wrap">
                {years.map((dec, index) => (
                  <div className={`m-auto form-check d-flex`} key={index}>
                    <input
                      type="radio"
                      className="btn-check btn"
                      name="decadesOptions"
                      id={dec.title_dc}
                      value={dec.title_dc}
                      onChange={() => setDec(index+1)}
                    />
                    <label
                      className={`btn btn-light mx-auto my-2 rounded-5 ${styles.searchTags}`}
                      htmlFor={dec.title_dc}
                    >
                      <p>{dec.title_dc}</p>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-md-3">
              <h1 className="text-center">Tamanho</h1>
              <div className="d-flex flex-wrap">
                {sizes.map((size, index) => (
                  <div className={`form-check m-auto`} key={index}>
                    <input
                      type="radio"
                      className="btn-check btn"
                      name="sizesOptions"
                      id={size.title_size}
                      value={size.title_size}
                      onChange={()=>setSize(index+1)}
                    />
                    <label
                      className={`btn btn-light mx-auto my-2 rounded-5 ${styles.searchTags}`}
                      htmlFor={size.title_size}
                    >
                      <p>{size.title_size}</p>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-md-3">
              <h1>Outros</h1>
              <div className="d-flex flex-wrap">
                {tags.map((tag, index) => (
                  <div className={`form-check m-auto`} key={index}>
                    <input
                      type="radio"
                      className="btn-check btn"
                      name="tagsOptions"
                      id={tag.title_tag}
                      value={tag.title_tag}
                      onChange={()=>setTag(index+1)}
                    />
                    <label
                      className={`btn btn-light mx-auto my-2 rounded-5 ${styles.searchTags}`}
                      htmlFor={tag.title_tag}
                    >
                      <p>{tag.title_tag}</p>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-md-3">
              <h1>Tipos</h1>
              <div className="d-flex flex-wrap">
                {types.map((tag, index) => (
                  <div className={`form-check m-auto`} key={index}>
                    <input
                      type="radio"
                      className="btn-check btn"
                      name="tagsOptions"
                      id={tag.title_pt}
                      value={tag.title_pt}
                      onChange={()=>setTag(index+1)}
                    />
                    <label
                      className={`btn btn-light mx-auto my-2 rounded-5 ${styles.searchTags}`}
                      htmlFor={tag.title_pt}
                    >
                      <p>{tag.title_pt}</p>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {value === '3' && (
          <div className={'tab-content'}>
            <div className='d-flex flex-column mt-3'>
                <input className={styles.imgInput} type="file" id='imgSubmit' accept="image/*" onChange={handleFileChange}/>
                <label className={`card shadow-sm rounded-4 d-flex mx-auto ${styles.imgInputLabel}`} htmlFor="imgSubmit">
                    <img className='m-auto' src="img/camera.png" alt="" />
                    <svg className='card-img-overlay' width="100%" height="100%">
                        <rect x="5" y="5" width="98%" height="98%" style={{fill:'transparent', strokeWidth:'6', stroke:'grey', strokeDasharray:'20', strokeLinecap:'round'}} />
                    </svg>
                </label>
                <h4 className='mx-auto my-4'>Importe uma imagem para procurar postagens</h4>
                <div className='d-flex mx-auto'>
                  <img src={image1} className='h-100 m-4' alt='' width='200'/>
                  <img src={image2} className='h-100 m-4' alt='' width='200'/>
                  <img src={image3} className='h-100 m-4' alt='' width='200'/>
                </div>
            </div>
            {selectedImage && (
              <CropImage 
                img={selectedImage}
              />
              
            )}
          </div>
        )}
      </div>
    </div>
  )
}



export default  SearchTab ;