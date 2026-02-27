import React, { useState } from "react";
import {NavLink} from "react-router-dom";
import { DndContext, useDraggable } from "@dnd-kit/core";


function DraggableItem({ id, label, src, x, y, onRename }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = {position: "absolute", left: x, top: y, transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined, textAlign: "center"};

  return (
    <div ref={setNodeRef} style={style}>
      <img src={src}  alt={label} width="80" style={{ cursor: "grab" }}{...listeners}{...attributes}/>
      <input value={label} onChange={(e) => onRename(id, e.target.value)} style={{ textAlign: "center" }} />
    </div>
  );
}

export function Connect() {
  const [items, setItems] = useState([
    { id: "1", label: "Starry Night", src: "images/starryexampleimg.png", x: 50, y: 50 },
    { id: "2", label: "Notebook1", src: "images/documenticon.png", x: 200, y: 100 },
    { id: "3", label: "Sticky Note", src: "images/documenticon.png", x: 350, y: 150 }
  ]);


  function addItem() {
    const newItem = {id: Date.now().toString(), label: "New Item", src: "images/documenticon.png", x: 100, y: 100};
    setItems([...items, newItem]);
  }


  function renameItem(id, newLabel) {
    const updated = items.map(item => item.id === id ? { ...item, label: newLabel } : item);
    setItems(updated);
  }


  function handleDragEnd(event) {
    const { active, delta } = event;

    const updated = items.map(item => item.id === active.id ? { ...item, x: item.x + delta.x, y: item.y + delta.y } : item);
    setItems(updated);
  }


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

          <DndContext onDragEnd={handleDragEnd}>
            <div className="content" style={{ position: "relative", height: "500px", border: "2px solid gray" }}>

              {items.map(item => (
                <DraggableItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  src={item.src}
                  x={item.x}
                  y={item.y}
                  onRename={renameItem}
                />
              ))}

            </div>
          </DndContext>

        </div>

      </div>
    </main>
  );
}