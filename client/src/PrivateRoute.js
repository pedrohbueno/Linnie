import { AuthContext } from 'AuthContext';
import { useContext } from 'react';
import {  Navigate } from 'react-router-dom';

function PrivateRoute({ element }) {
    const { user } = useContext(AuthContext)
    // Coloque aqui a lógica de autenticação, por exemplo, verificar se o usuário está logado.
  
    return user ? (
        element
    ) : (
        <Navigate to="/login" /> // Redireciona para a página de login se o usuário não estiver autenticado.
     );
}


export default PrivateRoute