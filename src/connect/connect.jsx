import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Draggable from "react-draggable";

export function Connect() {

      const [items, setItems] = useState([
    {id: 1, x: 50, y: 50, label: "Starry Night", src: "images/starryexampleimg.png",},
    {id: 2, x: 200, y: 100, label: "Notebook1", src: "images/documenticon.png", },
    {id: 3, x: 350, y: 150, label: "Sticky Note",src: "images/documenticon.png",},
  ]);

  const addItem = () => {
    const newItem = {id: Date.now(), x: 100, y: 100, label: "New Item", src: "images/documenticon.png",};
    setItems([...items, newItem]);
  };

  const renameItem = (id, newLabel) => {
    setItems(items.map((item) => item.id === id ? { ...item, label: newLabel } : item));
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
        
        
            <div className="connect-page-content">
                <div className="content">
                    <img src="images/download.png" alt="Blue Links"/>
                    <div className="icon-item">
                        <img src="images/starryexampleimg.png" alt="Blue Links"/>
                        <h4>Starry Night</h4>
                    </div>
                    <div className="icon-item">
                        <img src="images/documenticon.png" alt="Document Icon"/>
                        <h4>Notebook1</h4>
                    </div>
                    <div className="icon-item">
                        <img src="images/documenticon.png" alt="Document Icon"/>
                        <h4>Sticky Note</h4>
                    </div>
                </div>
            </div>
        </div>
    </main>
  );
}