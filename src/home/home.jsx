import React, { useState } from "react";
import { AuthState } from "../authState"; 
import {NavLink} from 'react-router-dom';

export function Home({ userName, authState, onAuthChange }) {
  const [inputName, setInputName] = useState('');

  const handleLogin = () => {
    if (!inputName) return; 
    localStorage.setItem('userName', inputName);
    onAuthChange(inputName, AuthState.Authenticated);
  };

  const handleLogout = () => {
    localStorage.removeItem('userName');
    onAuthChange('', AuthState.Unauthenticated);
  };

  return (
    <main>
      <div className="page-content">

      <div className="notebook_bar">
        <NavLink to="/notes" className="bar-item-button">
          Go to Notes
        </NavLink>
      </div>

        <div className="content">
          <h1>Home</h1>
          <h3>
            This is a place to make connections, let ideas flow, and let colors help you learn or write what you need to!
          </h3>

          <img src="/download.png" alt="Blue Links" />

          <h2>Start a New Note</h2>
          <NavLink to={authState === AuthState.Authenticated ? "/notes" : "/"}>
            <button className="button_start">Start Here</button>
          </NavLink>

          <p>
            Notebooks are the home to your ideas and connections. Start one and use the notes,
            pages, and sticky notes inside to help you write!
          </p>


        </div>
      </div>
    </main>
  );
}