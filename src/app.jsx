import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';

import { Login } from './Login';
import { AuthState } from './authState';
import { Home } from './home/home';
import { Notes } from './notes/notes';
import { Connect } from './connect/connect';



export default function App() {
  const [authState, setAuthState] = useState(AuthState.Unknown);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('userName');
    if (storedUser) {
      setUserName(storedUser);
      setAuthState(AuthState.Authenticated);
    } else {
      setAuthState(AuthState.Unauthenticated);
    }
  }, []);


  
  return (
    <BrowserRouter>
      <div className="app">

        <header>
          <nav>
            <NavLink to="/">Login</NavLink>

            {authState === AuthState.Authenticated && (
              <>
                <NavLink to="/home">Home</NavLink>
                <NavLink to="/notes">Notes</NavLink>
                <NavLink to="/connect">Connect</NavLink>
              </>
            )}
          </nav>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <Login
                userName={userName}
                authState={authState}
                onAuthChange={(user, state) => {
                  setUserName(user);
                  setAuthState(state);
                }}
              />
            }
          />

          <Route path="/home" element={<Home />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/connect" element={<Connect />} />
        </Routes>

        <footer>
          <p>Your Name</p>
          <a href="https://github.com/Waltolivia/rippleconnect.git">
            GitHub Repo
          </a>
        </footer>

      </div>
    </BrowserRouter>
  );
}