import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';

import { Home } from './home/home';
import { Notes } from './notes/notes';
import { Connect } from './connect/connect'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">

        <header>
          <nav>
            <NavLink to="home">Home</NavLink>
            <NavLink to="Notes">Notes</NavLink>
            <NavLink to ="Connect">Connect</NavLink>
          </nav>
        </header>

        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/notes" element={<Notes />}/>
          <Route path="/connect" element={<Connect />}/>
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