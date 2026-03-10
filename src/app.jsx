import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';

import { AuthState } from './authState';
import { Login } from './login/login';
import { Home } from './home/home';
import { Notes } from './notes/notes';
import { Connect } from './connect/connect';

function App() {
  const [userName, setUserName] = React.useState(localStorage.getItem('username') || '');
  const currentAuthState = userName ? AuthState.Authenticated : AuthState.Unauthenticated;
  const [authState, setAuthState] = React.useState(currentAuthState);


  return (
    <BrowserRouter>
      <div className="app">
        <header>
          <NavLink className="bar-item-button" to="/">
            Login
          </NavLink>

          {authState === AuthState.Authenticated && (
            <NavLink className="bar-item-button" to="/home">
              Home
            </NavLink>
          )}

          {authState === AuthState.Authenticated && (
            <NavLink className="bar-item-button" to="/notes">
              Notes
            </NavLink>
          )}

          {authState === AuthState.Authenticated && (
            <NavLink className="bar-item-button" to="/connect">
              Connect
            </NavLink>
          )}
      </header>

        <Routes>
          <Route
            path='/'
            element={
              <Login
                userName={userName}
                authState={authState}
                onAuthChange={(userName, authState) => {
                  setAuthState(authState);
                  setUserName(userName);
                }}
              />
            }
            exact
          />
          <Route path='/home' element={<Home userName={userName} />} />
          <Route path='/notes' element={<Notes />} />
          <Route path='/connect' element={<Connect />} />
          <Route path='*' element={<NotFound />} />
        </Routes>

        <footer>
          <p>Olivia Walton || cs260 Wed Programming</p>
          <a href="https://github.com/Waltolivia/rippleconnect.git">GitHub Repo</a>
        </footer>

      </div>
    </BrowserRouter>
  );
}

function NotFound(){
  return <main className='container-fluid bg-secondary text-center'>404: Return to sender. Address unknown.</main>;
}

export default App;