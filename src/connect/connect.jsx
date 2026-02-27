import React from 'react';
import {NavLink} from 'react-router-dom';

export function Connect() {
  return (
    <main>
        <div class="page-content">
            <div className="notebook_bar">
                <li><NavLink to="/notes" className="bar-item-button">Notebook1</NavLink></li>
                <li><NavLink to="/notes" className="bar-item-button">Notebook2</NavLink></li>
                <li><NavLink to="/notes" className="bar-item-button">Notebook3</NavLink></li>
                <button className="new_notebook" type="button">New Notebook</button>
            </div>
        
        
            <div class="connect-page-content">
                <div class="content">
                    <img src="images/download.png" alt="Blue Links"/>
                    <div class="icon-item">
                        <img src="images/starryexampleimg.png" alt="Blue Links"/>
                        <h4>Starry Night</h4>
                    </div>
                    <div class="icon-item">
                        <img src="images/documenticon.png" alt="Document Icon"/>
                        <h4>Notebook1</h4>
                    </div>
                    <div class="icon-item">
                        <img src="images/documenticon.png" alt="Document Icon"/>
                        <h4>Sticky Note</h4>
                    </div>
                </div>
            </div>
        </div>
    </main>
  );
}