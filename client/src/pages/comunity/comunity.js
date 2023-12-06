import axios from "axiosConfg";
import { useState } from "react";


const Comunity = () => {
  const [ commentary, setCommentary ] = useState('')
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const commData = {
        cont_comm: commentary
      };
  
      console.log(commentary)
      await axios.post('http://localhost:8000/CommentCreate', commData);

    } catch (error) {
      console.error('Erro ao enviar dados:', error);
    }

  };
  return (
    <div className="container">
      <div className="col-6 card p-5" style={{height:'23rem', backgroundColor: "#F9F9F9"}}>
        <div className="mx-5 mb-4"><p>Saia, você é mais do que um gato para mim, é um membro querido da família. Sou grato por cada momento que passamos juntos e ansioso pelo futuro que temos pela frente. Obrigado por ser a companheira leal e amorosa que você é.</p></div>
        <div className="d-flex flex-column ">
          <div className="d-flex">
            <img className="" src="profiles/profile1.png" alt="" width={60}/>
            <div>
              <h5 className="my-auto mt-2 mx-2">Nome de usuário</h5>
              <p className="my-auto mx-2"> 01/09/2023</p>
            </div>
          </div>
          <hr/>
          <form onSubmit={handleSubmit}>
            <input name="comm" class="mx-4 fs-4" type="text" placeholder="adicionar comentário..." onChange={(e)=> setCommentary(e.target.value)} />
            <button type="submit">Enviar</button>
          </form>
          </div>
        {/* <svg className='card-img-overlay' width="100%" height="100%">
          <rect x="5" y="5" width="99%" height="97%" style={{fill:'transparent', strokeWidth:'3', stroke:'#000000', strokeDasharray:'8', strokeLinecap:'round'}} />
        </svg> */}
      </div>
      
    </div>
  );
};

export default Comunity;
