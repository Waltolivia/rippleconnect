import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';

import { AuthState } from './authState';
import { Home } from './home/home';
import { Notes } from './notes/notes';
import { Connect } from './connect/connect';

export default function App() {
  const [authState, setAuthState] = React.useState(currentAuthState);
  const [userName, setUserName] = React.useState(localStorage.getItem('username)' || ''));
  const currentAuthState = userName ? AuthState.Authenticated : AuthState.Unauthenticated;


  return (
    <BrowserRouter>
      <div className="app">
        <header>
          <NavLink className="bar-item-button" to="/home">Home</NavLink>
          
          {authState === AuthState.Authenticaed && (
            <NavLink className="bar-item-button" to="/notes">
              Notes
              </NavLink>
          )};
          {authState === AuthState.Authenticated && (
            <NavLink className="bar-item-button" to="/connect">
              Connect
              </NavLink>
          )};


        </header>

        <Routes>
          <Route path="/home" element={<Home userName={userName} authState={authState} onAuthChange={(name, state) => { setUserName(name); setAuthState(state);}} />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/connect" element={<Connect />} />
        </Routes>

        <footer>
          <p>Olivia Walton || cs260 Wed Programming</p>
          <a href="https://github.com/Waltolivia/rippleconnect.git">GitHub Repo</a>
        </footer>

      </div>
    </BrowserRouter>
  );
}