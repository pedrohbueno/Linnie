import { AuthContext } from 'AuthContext';
import { useContext, useState } from 'react';
import styles from './css/create.module.css'
import axios2 from 'axios';
import axios from 'axiosConfg';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import posticon from './img/posticon.png';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Create() {
 
    
    const { haddleChange } =  useContext(AuthContext)

    const [tags, setTags] = useState([]);
    const [years, setYears] = useState([]);
    const [types, setTypes] = useState([]);
    const [sizes, setSizes] = useState([]);

    const navigate = useNavigate();

    const [ imageSelected, setImageSelected ] = useState('')
    const [ imageSelected2, setImageSelected2 ] = useState('')
    const [ imageSelected3, setImageSelected3 ] = useState('')
    const [ fileSelected, setFileSelected ] = useState("")
    const [componentKey, setComponentKey] = useState(0);
    const [ inputState, setInputState ] = useState(false)
    const [ inputState2, setInputState2 ] = useState(false)
    const [ inputState3, setInputState3 ] = useState(false)
    const [ labelElementsDisplay, setLabelElementsDisplay ] = useState("block")
    const [ labelElementsDisplay2, setLabelElementsDisplay2 ] = useState("block")
    const [ labelElementsDisplay3, setLabelElementsDisplay3 ] = useState("block")


    const [ title, setTitle ] = useState()
    const [ tag,  setTag ] = useState()
    const [ year,  setYear ] = useState()
    const [ size,  setSize ] = useState()
    const [ desc, setDesc ] = useState()
    const [ type, setType  ] = useState();

    const [userData, setUserData] = useState([]);

    const handleImageSelected = ()=>{
        setImageSelected('') 
        setInputState(false)
        setLabelElementsDisplay('block')
        setComponentKey((prevKey) => prevKey + 1);
    }
    

    const [ addDisplay, setAddDisplay ] = useState('block')
    const [ addDisplay2, setAddDisplay2 ] = useState('none')
    const [ labelDisplay, setLabelDisplay ] = useState('none')
    const [ labelDisplay2, setLabelDisplay2 ] = useState('none')

    const handleAdd = () =>{
        if (imageSelected) {
            setAddDisplay('none')
            setAddDisplay2('block')
            setLabelDisplay('block')
        }
        else{
            toast("Selecione a primeira imagem")
        }
    }
    const handleAdd2 = () =>{
        if (imageSelected2) {
            setAddDisplay2('none')
            setLabelDisplay2('block')
        }
        else{
            toast("Selecione a segunda imagem")
        }
    }
    const handleImageSelected2 = ()=>{
        setImageSelected2('') 
        setInputState2(false)
        setAddDisplay2('none')
        setLabelDisplay('none')
        setLabelElementsDisplay2('block')
        setComponentKey((prevKey) => prevKey + 1);
        if (labelDisplay2 === 'none') {
            setAddDisplay('block')
        }
    }
    const handleImageSelected3 = ()=>{
        setImageSelected3('') 
        setInputState3(false)
        setLabelDisplay2('none')
        setAddDisplay2('block')
        setLabelElementsDisplay3('block')
        setComponentKey((prevKey) => prevKey + 1);
        if (labelDisplay === 'none') {
            setAddDisplay('block')
            setAddDisplay2('none')
        }
    }

    console.log('Imagens', imageSelected, 'Imagens2',imageSelected2, 'Imagens3', imageSelected3)
    console.log(inputState, inputState2, inputState3,'Imagem: ', imageSelected.name, labelElementsDisplay, 'Filé: ', fileSelected.name)
    const convertToBlob = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(new Blob([reader.result], { type: file.type }));
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    };
    useEffect(() => {
        axios2
          .get('http://localhost:8000/search_info')
          .then((response) => {
            setTags(response.data.tagData);
            setSizes(response.data.sizeData)
            setYears(response.data.decadeData)
            setTypes(response.data.typeData)
          })
          .catch((error) => {
            console.error(error);
          });
      }, []);
    
    useEffect(() => {
        if (imageSelected) {
            setInputState(true)
            setLabelElementsDisplay('none')
        }
        if (imageSelected2) {
            setInputState2(true)
            setLabelElementsDisplay2('none')
        }
        if (imageSelected3) {
            setInputState3(true)
            setLabelElementsDisplay3('none')
        }
        
      // Exemplo de solicitação a uma rota protegida
      axios.get('/profile')
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }, [imageSelected, imageSelected2, imageSelected3]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (imageSelected && fileSelected && desc && size && type && year && title && tag) {
            
            try {

                const formData = new FormData();
                const blobImage1 = await convertToBlob(imageSelected);
                formData.append("file", blobImage1, "image1.png");
                
                if (imageSelected2) {
                    const blobImage2 = await convertToBlob(imageSelected2);
                    formData.append("file", blobImage2, "image2.png");
                }
                
                if (imageSelected3) {
                    const blobImage3 = await convertToBlob(imageSelected3);
                    formData.append("file", blobImage3, "image3.png");
                }
                formData.append("title_patt", title);
                formData.append("desc_patt", desc);
                formData.append("fk_id_size", size);
                formData.append("fk_id_tag", tag);
                formData.append("fk_id_pt", type);
                formData.append("fk_id_dc", year);
                let pdfUrl = ''
                if (fileSelected) {
                    const pdfFormData = new FormData();
                    pdfFormData.append("file", fileSelected);
                    pdfFormData.append("upload_preset", "pwtmennc");
            
                    const pdfResponse = await axios2.post(
                    "https://api.cloudinary.com/v1_1/linnieimages/image/upload",
                    pdfFormData
                    );
            
                    pdfUrl = pdfResponse.data.secure_url; 
                    formData.append("pattern_patt", pdfUrl);
                }
    
                const response = await axios.post('/createPost', formData);
                const responseData = response.data;
    
                if (responseData) {
                    navigate(`/postage?slide=${responseData.pk_id_patt}`);
                    window.location.reload();
                }
            } catch (error) {
                console.error('Erro ao enviar dados:', error);
            }
            
        }
        else {
            toast("Selecione a primeira imagem")
        }
    };
      
    const handleFormKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    }
    
    
    console.log(labelDisplay)
    

    return(
        <div className='container-fluid p-5' onLoad={haddleChange}>
            
            <ToastContainer />
            <form className={`form ${styles.FormCreate}`} onKeyDown={handleFormKeyDown}>
            <div className='d-flex justify-content-center w-100' key={componentKey}>
                <input
                    className={styles.Input}
                    type="file"
                    id='imgInput'
                    accept="image/*"
                    disabled={inputState}
                    onChange={(e) => {
                        setImageSelected(e.target.files[0])
                    }}
                />
                    <label className={`card shadow-sm rounded-4 d-flex mx-4 ${styles.imgInputLabel}`} htmlFor="imgInput" style={{
                            backgroundImage: imageSelected ? `url(${URL.createObjectURL(imageSelected)})` : 'none',
                            backgroundRepeat:'no-repeat',
                            backgroundPosition:'center',
                            backgroundSize: '57%'
                        }}>
                        <button className='btn btn-primary rounded-5 align-self-end' onClick={handleImageSelected} style={{
                            width: '50px', 
                            height:'50px',
                            margin: '-15px',
                            position: 'absolute',
                            zIndex:'99',
                            border: 'none',
                            backgroundColor: '#C25E84', 
                            display: labelElementsDisplay === "block" ? "none" : 'block'
                            }}>X</button>
                        <h4 className='mx-auto mt-auto' style={{display: labelElementsDisplay, fontFamily: "Gotu"}} >Adicionar Fotos</h4>
                        <img className='mx-auto mb-auto' src={posticon} width={100} height={100} alt="" style={{display: labelElementsDisplay}} />
                        <svg className='card-img-overlay' width="100%" height="100%">
                            <rect x="5" y="5" width="98%" height="98%" style={{fill:'transparent', strokeWidth:'6', stroke:'grey', strokeDasharray:'20', strokeLinecap:'round'}} />
                        </svg>
                    </label>
                    <button type='button' className='my-auto rounded-5' style={{
                        width: '100px',
                        height: '100px',
                        flexShrink: '0',
                        display: addDisplay
                    }} onClick={handleAdd}>
                    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="100" height="100" rx="25" fill="#DCD5D7"/>
                        <rect width="44.1667" height="6.46039" rx="3.2302" transform="matrix(0 -1 -1 0 53.125 72.5)" fill="#696969"/>
                        <rect width="44.1667" height="6.46039" rx="3.2302" transform="matrix(1 0 0 -1 27.8145 53.6475)" fill="#696969"/>
                    </svg> 
                    </button>
                    <div className='mx-4' style={{ display: labelDisplay }}>
                        <input
                            className={styles.Input}
                            type="file"
                            id='imgInput2'
                            accept="image/*"
                            disabled={inputState2}
                            onChange={(e) => {
                            setImageSelected2(e.target.files[0])
                            }}
                        />
                        <label className={`card shadow-sm rounded-4 d-flex ${styles.imgInputLabel}`} htmlFor="imgInput2" style={{
                                backgroundImage: imageSelected2 ? `url(${URL.createObjectURL(imageSelected2)})` : 'none',
                                backgroundRepeat:'no-repeat',
                                backgroundPosition:'center',
                                backgroundSize: '57%',
                            }}>
                            <button className='btn btn-primary rounded-5 align-self-end' onClick={handleImageSelected2} style={{
                                width: '50px', 
                                height:'50px',
                                margin: '-15px',
                                position: 'absolute',
                                zIndex:'99',
                                border: 'none',
                                backgroundColor: '#C25E84'
                                }}>X</button>
                            <h4 className='mx-auto mt-auto' style={{display: labelElementsDisplay2}} >Adicionar Fotos</h4>
                            <img className='mx-auto mb-auto' src={posticon} width={100} height={100} alt="" style={{display: labelElementsDisplay2}} />
                            <svg className='card-img-overlay' width="100%" height="100%">
                                <rect x="5" y="5" width="98%" height="98%" style={{fill:'transparent', strokeWidth:'6', stroke:'grey', strokeDasharray:'20', strokeLinecap:'round'}} />
                            </svg>
                        </label>
                    </div>
                    <button type='button' className='my-auto rounded-5' style={{

                        width: '100px',
                        height: '100px',
                        flexShrink: '0',
                        display: addDisplay2
                    }} onClick={handleAdd2}>
                    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="100" height="100" rx="25" fill="#DCD5D7"/>
                        <rect width="44.1667" height="6.46039" rx="3.2302" transform="matrix(0 -1 -1 0 53.125 72.5)" fill="#696969"/>
                        <rect width="44.1667" height="6.46039" rx="3.2302" transform="matrix(1 0 0 -1 27.8145 53.6475)" fill="#696969"/>
                    </svg> 
                    </button>
                    <div className='mx-4' style={{ display: labelDisplay2 }}>
                        <input
                            className={styles.Input}
                            type="file"
                            id='imgInput3'
                            accept="image/*"
                            disabled={inputState3}
                            onChange={(e) => {
                            setImageSelected3(e.target.files[0])
                            }}
                        />
                        <label className={`card shadow-sm rounded-4 d-flex mx-auto ${styles.imgInputLabel}`} htmlFor="imgInput3" style={{
                                backgroundImage: imageSelected3 ? `url(${URL.createObjectURL(imageSelected3)})` : 'none',
                                backgroundRepeat:'no-repeat',
                                backgroundPosition:'center',
                                backgroundSize: '57%'
                            }}>
                            <button className='btn btn-primary rounded-5 align-self-end' onClick={handleImageSelected3} style={{
                                width: '50px', 
                                height:'50px',
                                margin: '-15px',
                                position: 'absolute',
                                zIndex:'99',
                                border: 'none',
                                backgroundColor: '#C25E84'
                                }}>X</button>
                            <h4 className='mx-auto mt-auto' style={{display: labelElementsDisplay3}} >Adicionar Fotos</h4>
                            <img className='mx-auto mb-auto' src={posticon} width={100} height={100} alt="" style={{display: labelElementsDisplay3}} />
                            <svg className='card-img-overlay' width="100%" height="100%">
                                <rect x="5" y="5" width="98%" height="98%" style={{fill:'transparent', strokeWidth:'6', stroke:'grey', strokeDasharray:'20', strokeLinecap:'round'}} />
                            </svg>
                        </label>
                    </div>
                </div>
                <div className="container p-5">
                <li className='d-flex my-3'>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: 51, height: 51, background: '#F9F9F9', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: '50%', marginRight: '10px' }} />
                            <img style={{ width: 43, height: 43, position: 'absolute', left: 4.40, top: 4.22 }} src={userData.pfp_user} alt='' width={60} height={60} />
                        <div>
                            <h5 className='mt-3' style={{ color: '#1B1B1B', fontSize: 15, fontFamily: 'Gotu', fontWeight: '400', wordWrap: 'break-word' }}>{userData.name_user}</h5>
                        </div>
                    </div>
                </li>

                    <input className={`fs-5 form-control mb-3 ${styles.inputTitle}`} type='text' placeholder="Título da postagem..." onChange={(e)=>{setTitle(e.target.value)}} />



                    <div className='d-flex mt-5 mb-4'>
                        <div className='' >
                        <label className={`control-label`} style={{width:'10rem', fontFamily: 'gotu', fontSize: '20px', color:'#696969'}} htmlFor="year">Tag</label>
                            <select id="year" name="year" className={`form-control mb-3 rounded-5 ${styles.selectInputTag}`} required onChange={(e)=>{setTag(e.target.value)}}>
                                <option value="">Selecionar a tag...</option>
                                {
                                    tags.map((tag, index) =>
                                    <option value={index} key={index}>{tag.title_tag}</option>

                                )}
                            </select>
                        </div>
                        <div className='mx-3' >
                            <label className={`control-label ${styles.selectInputLabel}`} style={{width:'10rem', fontFamily: 'gotu', fontSize: '20px', color:'#696969'}} htmlFor="type">Tipo </label>
                            <select id="type" name="type" className={`form-control mb-3 rounded-5 ${styles.selectInput}`} style={{width:'10rem'}} required onChange={(e)=>{setType(e.target.value)}}>
                                <option value="">Nenhum</option>
                                {
                                    types.map((type, index) =>
                                    <option value={index} key={index}>{type.title_pt}</option>

                                )}
                            </select>
                        </div>
                        <div className='mx-3' >
                            <label className={`control-label ${styles.selectInputLabel}`} htmlFor="year" style={{fontFamily: 'Gotu', fontSize: '20px', color:'#696969'}}>Década</label>
                            <select id="year" name="year" className={`form-control mb-3 rounded-5 ${styles.selectInput}`} onChange={(e)=>{setYear(e.target.value)}}>
                                <option value="">Nenhum</option>
                                {
                                    years.map((year, index) =>
                                    <option value={index} key={index}>{year.title_dc}</option>

                                )}
                            </select>
                        </div>
                        <div className={styles.divSelect} >
                            <label className={`control-label ${styles.selectInputLabel}`} htmlFor="size" style={{fontFamily: 'gotu', fontSize: '20px', color:'#696969'}}>Tamanho</label>
                            <select id="size" name="size" className={`form-control mb-3 rounded-5 ${styles.selectInput}`} onChange={(e)=>{setSize(e.target.value)}}>
                                <option value="">Nenhum</option>
                                {
                                    sizes.map((size, index) =>
                                    <option value={index} key={index}>{size.title_size}</option>

                                )}
                            </select>
                        </div>
                        
                    </div>

                    <textarea className={`form-control mb-3 rounded-5 ${styles.description}`} placeholder="Descrição" style={{fontFamily: 'Gotu', fontSize: '25px', color:'#696969', resize: 'none'}} rows="13" onChange={(e)=>{setDesc(e.target.value)}}/>
                    <img src="img/createpost.png" alt="" className={styles.descImg }/>
            
                    <div className={`d-flex  justify-content-end ${styles.divbottum}`}>
                        <div className={`d-flex  justify-content-end`} >
                            <p className='text-center my-auto'>{fileSelected.name}</p>
                            <input className={styles.Input} type="file" id='fileSubmit' onChange={(e) =>{setFileSelected(e.target.files[0])}} />
                            <label className={`btn btn-light shadow-sm mx-4 rounded-4 ${styles.fileInputLabel}`} htmlFor="fileSubmit">Importar Arquivo</label>
                            <button type="submit" className="btn btn-dark rounded-4" style={{backgroundColor:'#C25E84', border: 'none', fontFamily:'Gotu', width:'135px', height:'40px', fontSize:'20px'}} onClick={handleSubmit}>Enviar</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Create
