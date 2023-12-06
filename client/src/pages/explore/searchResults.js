import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AiFillHeart } from  'react-icons/ai'
import { BsFillChatDotsFill } from  'react-icons/bs'

import axios from 'axios';

function Explore() {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const searchQuery = searchParams.get('search_query') || '';
  const tabQuery = parseInt(searchParams.get('tab_query')) || 1
  const decQuery = parseInt(searchParams.get('dec_query')) || '';
  const sizeQuery = parseInt(searchParams.get('size_query')) || '';
  const tagQuery = parseInt(searchParams.get('tag_query')) || '';
  const [error, setError] = useState(null);
  const [ text, setText ] = useState('')
  console.log(searchQuery, tabQuery)
  
  const [patternData, setPatternData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/results', {
          params: { search_query: searchQuery, tab_query: tabQuery, dec_query: decQuery, size_query: sizeQuery, tag_query: tagQuery},
        });

        if (response.status === 200) {
          setPatternData(response.data.patterns);
          setText('Resultados para: ')
        } else {
          setError(response.data.mensagem);
        }
      } catch (error) {
        console.error('Erro ao buscar padrões:', error);
        setError('Ocorreu um erro ao buscar os padrões.');
        setText('Não foi possivel encontrar resultados para: ')
      }
    };

    fetchData(); // Chamada inicial ao montar o componente
  }, [searchQuery, tabQuery, decQuery, sizeQuery, tagQuery]);

  console.log(error)

  return (
    <div className="container pt-5">
      <div className="d-flex flex-column align-items-center mb-5">
        <h1
          style={{
            fontFamily: "gotu",
            letterSpacing: '4px',
            fontSize: '60px',
          }}
        >
          Pesquisa
        </h1>
        <h4 style={{fontFamily:'Bahnschrift'}}>{text}{searchQuery}</h4>
      </div>
      <div className="row">
        {patternData.map((pattern, index) => {
          return (
              <div
                key={index}
                className="col-sm-12 col-md-6 col-lg-4 col-xl-3 col-xxl-3 mb-5"
              >
                <div className="shadow-lg card card-link">
                  <Link
                    to={`/postage?slide=${pattern.pk_id_patt}`}
                    className="text-decoration-none"
                    style={{ color: 'black' }}
                  >
                    <div className="card">
                      <img
                        src={pattern.img_patt1}
                        alt={pattern.pk_id_patt}
                        className="card-img-top"
                        style={{ height: '400px' }}
                      />
                      <svg className='card-img-overlay' width="320" height="410">
                        <rect x="5" y="5" width="265" height="360" style={{fill:'transparent', strokeWidth:'3', stroke:'#000000', strokeDasharray:'8', strokeLinecap:'round'}} />
                      </svg>
                    </div>
                    <div className="card-footer d-flex justify-content-between">
                      <div className="user d-inline-flex">
                        <img
                          src={pattern.UserL.pfp_user}
                          alt={pattern.UserL.name_user}
                          style={{ width: '35px', height: '35px'}}
                        />
                        <p className="m-auto mx-2" style={{fontFamily:'Bahnschrift'}}>{pattern.UserL.name_user}</p>
                      </div>
                      <div className="d-inline-flex">
                        <BsFillChatDotsFill className='m-auto' color='#FCD074' size={29}/>
                        <p className="m-auto mx-2">{pattern.numberComments}</p>
                        <AiFillHeart className='m-auto' color='#C25E84' size={32}/>
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
  );
}

export default Explore;
