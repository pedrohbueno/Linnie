import React, { useState } from 'react';
import { Cropper } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';
import linmin from './img/linmin.cor.png';
import nienie from './img/nienie.png';
import styles from './css/search.module.css';
import axios from 'axios';

function CropImage(props) {
  const [croppedImage, setCroppedImage] = useState();
  const [image] = useState(props.img);

  const onChange = (cropper) => {
    const canvas = cropper.getCanvas();
    if (canvas) {
      const dataURL = canvas.toDataURL();
      setCroppedImage(dataURL);   
      console.log(dataURL)
    }
  };

  const dataURLtoBlob = (dataURL) => {
    return new Promise((resolve, reject) => {
      const byteString = atob(dataURL.split(',')[1]);
      const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
  
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
  
      const blob = new Blob([ab], { type: mimeString });
      resolve(blob);
    });
  }
  
  const handleClick = async () => {
    try {
      // Ensure the image is cropped before proceeding
      if (!croppedImage) {
        console.error('Cropped image is missing.');
        return;
      }

      const formData = new FormData();
      const blob = await dataURLtoBlob(croppedImage);
      formData.append('image', blob, 'cropped_image.png');

      // Send the cropped image data to the backend
      const response = await axios.post('http://localhost:8000/search_by_image', formData, {
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      });

      if (response.status === 200) {
        const result = response.data;
        console.log('Resultados da pesquisa:', result);
      } else {
        throw new Error('Erro ao realizar a pesquisa por imagem');
      }
    } catch (error) {
      console.error('Erro ao realizar a pesquisa por imagem:', error.message);
    }
  };

  

  return (
    <div className="container-fluid mt-5 position-absolute top-50 start-50 translate-middle" styles={{ height: '400px' }}>
      <div className="row bg-white">
        <div className={`col-3 py-5 ${styles.searchRow}`}>
          <img src={linmin} alt="" style={{ rotate: '10deg', marginLeft: '-50px' }} />
          <img src={nienie} alt="" style={{ rotate: '-10deg', marginLeft: '90px' }} />
          <button
            type="button"
            className={`btn shadow-lg fs-4 ${styles.searchButton}`}
            style={{ backgroundColor: '#C25E84' }}
            onClick={handleClick}
          >
            Pesquisar
          </button>
        </div>
        <div className="col-9 card p-4 shadow-sm" style={{ zIndex: '999', height: '80vh' }}>
          <Cropper src={image} onChange={onChange} className={'cropper bg-white card-img'} />
        </div>
      </div>
    </div>
  );
};

export default CropImage;


  
