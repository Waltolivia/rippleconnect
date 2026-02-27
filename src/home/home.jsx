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
          <li><NavLink to="/notes" className="bar-item-button">Notebook1</NavLink></li>
          <li><NavLink to="/notes" className="bar-item-button">Notebook2</NavLink></li>
          <li><NavLink to="/notes" className="bar-item-button">Notebook3</NavLink></li>
          <button className="new_notebook" type="button">New Notebook</button>
        </div>

        <div className="content">
          <h1>Home</h1>
          <h3>
            This is a place to make connections, let ideas flow, and let colors help you learn or write what you need to!
          </h3>

          <img src="/download.png" alt="Blue Links" />

          <h2>Start a New Note</h2>
          <button className="button_start">Start Here</button>

          <p>
            Notebooks are the home to your ideas and connections. Start one and use the notes,
            pages, and sticky notes inside to help you write!
          </p>

          {authState !== AuthState.Authenticated ? (
            <div className="Login">
              <label htmlFor="username">Username </label>
              <input
                type="text"
                id="username"
                name="username"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
              />
              <br /><br />
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" />
              <br /><br />
              <button type="button" onClick={handleLogin}>Login</button>
            </div>
          ) : (
            <div>
              <p>Welcome, {userName}!</p>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}