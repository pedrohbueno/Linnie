import React, { useState, useEffect } from 'react';

const ImagemAnimada = () => {
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
    }, 400); // Altere este valor para ajustar a velocidade da animação (em milissegundos)

    // Função de limpeza do intervalo para evitar vazamentos de memória
    return () => clearInterval(intervalId);
  }, [imagens.length]); // O useEffect depende do comprimento do array de imagens

  return (
    <div className='w-100 d-flex align-items-center justify-content-center'>
      <img className='m-auto' src={imagens[imagemAtual]} alt={`Imagem ${imagemAtual + 1}`} />
    </div>
  );
};

export default ImagemAnimada;
