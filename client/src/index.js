import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import PrivateRoute from 'PrivateRoute';

//Rotas
import Home from './pages/home/home';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import Password from './pages/auth/password';
import User from './pages/user/user';
import UserEdit from './pages/user/userEdit';
import ErrorPage from './pages/errorPage/errorPage';
import Explore from './pages/explore/explore';
import Postage from './pages/postage/postage';
import CreatePost from './pages/createPost/createPost';
import Skirt from './pages/skirt/skirt';
import Comunity from './pages/comunity/comunity';
import Teste from '_teste';
import Results from './pages/explore/searchResults'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/teste',
        element: <Teste />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        path: 'password',
        element: <Password />
      },
      {
        path: 'user',
        element: <PrivateRoute element={<User />} />
      },
      {
        path: 'user_edit',
        element: <PrivateRoute element={<UserEdit />} />
      },
      {
        path: 'skirt',
        element: <Skirt />
      },
      {
        path: 'explore',
        element: <Explore />
      },
      {
        path: 'results',
        element: <Results />
      },
      {
        path: '/postage',
        element: <Postage />
      },
      {
        path: '/create',
        element: <PrivateRoute element={<CreatePost />} />
      },
      {
        path: '/comunity',
        element: <Comunity />
      }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);
