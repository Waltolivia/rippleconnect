import React, { useState } from "react";
import { AuthState } from "../authState"; // make sure this file exists

export function Home({ userName, authState, onAuthChange }) {
  const [inputName, setInputName] = useState('');

  const handleLogin = () => {
    if (!inputName) return; // simple validation
    localStorage.setItem('userName', inputName); // save for future visits
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
          <li><a href="notes.html" className="bar-item-button">Notebook1</a></li>
          <li><a href="#" className="bar-item-button">Notebook2</a></li>
          <li><a href="#" className="bar-item-button">Notebook3</a></li>
          <button className="new_notebook" type="button">New Notebook</button>
        </div>

        <div className="content">
          <h1>Home</h1>
          <h3>
            This is a place to make connections, let ideas flow, and let colors help you learn or write what you need to!
          </h3>

          <img src="/images/download.png" alt="Blue Links" />

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