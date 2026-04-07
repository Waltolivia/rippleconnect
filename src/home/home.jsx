import React, { useState } from "react";
import { AuthState } from "../authState"; 
import {NavLink} from 'react-router-dom';

export function Home({ userName, authState, onAuthChange }) {
  const [inputName, setInputName] = useState('');
  const[quote, setQuote] = useState("Loading...");
  const [quoteAuthor, setQuoteAuthor] = useState("Unknown");

  const handleLogin = () => {
    if (!inputName) return; 
    localStorage.setItem('userName', inputName);
    onAuthChange(inputName, AuthState.Authenticated);
  };

  const handleLogout = () => {
    localStorage.removeItem('userName');
    onAuthChange('', AuthState.Unauthenticated);
  };


  React.useEffect(() => {
    fetch("https://quote.cs260.click")
      .then((response) => response.json())
      .then((data) => {
        setQuote(data.quote);
        setQuoteAuthor(data.author);
      })
      .catch(() => {
        setQuote("Failed to load quote.");
        setQuoteAuthor("");
      });
  }, []);

  return (
    <main>
      <div className="page-content">

      <div className="notebook_bar">
        <NavLink to="/notes" className="bar-item-button">
          Go to Notes
        </NavLink>
      </div>

        <div className="content">
          <h1>Welcome to the Home Page</h1>
          <h3>
            This is a place to make connections, let ideas flow, and let colors help you learn or write what you need to!
          </h3>

          <img className="home-image" src="/download.png" alt="Blue Links" />

          <p>To start making connections you can login, or create a sign in, and start studying. You can also make notebooks that you can use to write, make sticky notes for definitions and details, and index cards for other information. </p>

          <h2>Start a New Note</h2>
          <NavLink to={authState === AuthState.Authenticated ? "/notes" : "/"}>
            <button className="button_start">Start Here</button>
          </NavLink>

          <p>
            Notebooks are the home to your ideas and connections. Start one and use the notes,
            pages, and sticky notes inside to help you write!
          </p>

          <div className="quote-box">
            <p className="quote">"{quote}"</p>
            <p className="author">— {quoteAuthor}</p>
          </div>

        </div>
      </div>
    </main>
  );
}