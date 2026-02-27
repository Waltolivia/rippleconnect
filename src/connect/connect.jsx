import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { DndContext, useDraggable } from "@dnd-kit/core";

function DraggableItem({ id, label, src, onRename }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = {
    position: "absolute",
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    textAlign: "center",
    cursor: "grab"
  };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
        <img src={src} alt={label} width="80" />
        <input
            value={label}
            onChange={(e) => onRename(id, e.target.value)}
            style={{ textAlign: "center" }}
        />
        </div>
    );
    }

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
            <button onClick={addItem}>Add Item</button>

            <div className="content" style={{ position: "relative", height: "500px", border: "2px solid gray", }}>
                {items.map((item) => (
                <Draggable key={item.id} defaultPosition={{ x: item.x, y: item.y }}>
                    <div style={{ position: "absolute", textAlign: "center", cursor: "move",}}>
                    <img src={item.src} alt={item.label} width="80"/>
                    <input value={item.label} onChange={(e) => renameItem(item.id, e.target.value)} style={{ textAlign: "center" }}/>
                    </div>
                </Draggable>
                ))}
            </div>
            </div>
        </div>
    </main>
    );
    }   