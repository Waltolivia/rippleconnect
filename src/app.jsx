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
      <div className="app bg-dark text-light">

        <header>
          <nav>
            <NavLink to="Home">Home</NavLink>
            <NavLink to="About">About</NavLink>
            <NavLink to="Notes">Notes</NavLink>
            <NavLink to ="Connect">Connect</NavLink>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/notes" element={<Notes />}/>
          <Route path="/connect" element={<Connect />}/>
        </Routes>

        <footer>
          <p>Your Name</p>
          <a href="https://github.com/yourusername/startup">
            GitHub Repo
          </a>
        </footer>

      </div>
    </BrowserRouter>
  );
}