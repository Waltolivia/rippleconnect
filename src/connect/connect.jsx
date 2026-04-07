import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { DndContext, useDraggable } from "@dnd-kit/core";

function DraggableItem({ id, label, src, x, y, onRename, onSelect, onDelete, isSelected }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = { position: "absolute", left: x, top: y, transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined, textAlign: "center", border: isSelected ? "2px solid yellow" : "none", padding: "5px" };

  return (
    <div ref={setNodeRef} style={style} onClick={() => onSelect(id)}>
      <img src={src} alt={label} width="80" style={{ cursor: "grab" }} {...listeners} {...attributes} />
      <input value={label} onChange={(e) => onRename(id, e.target.value)} style={{ textAlign: "center" }} />
      <button onClick={(e) => { e.stopPropagation(); onDelete(id); }}>❌</button>
    </div>
  );
}

export function Connect() {
  const [items, setItems] = useState([
    { id: "1", label: "Starry Night", src: "/starryexampleimg.png", x: 50, y: 50 },
    { id: "2", label: "Notebook1", src: "/documenticon.png", x: 200, y: 100 },
    { id: "3", label: "Sticky Note", src: "/documenticon.png", x: 350, y: 150 }
  ]);
  const [connections, setConnections] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  function addItem() {
    const newItem = { id: Date.now().toString(), label: "New Item", src: "images/documenticon.png", x: 100, y: 100 };
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

  function deleteItem(id) {
    setItems(items.filter(item => item.id !== id));
    setConnections(connections.filter(c => c.from !== id && c.to !== id));
  }

  function handleSelect(id) {
    if (!selectedItem) setSelectedItem(id);
    else if (selectedItem !== id) {
      setConnections(prev => [...prev, { from: selectedItem, to: id }]);
      setSelectedItem(null);
    }
  }

  function removeConnection(index) {
    setConnections(prev => prev.filter((_, i) => i !== index));
  }

  return (
    <main>
      <div className="page-content">
        <div className="notebook_bar">
          <NavLink to="/notes" className="bar-item-button">Go to Notes</NavLink>
        </div>
        <div className="connect-page-content">
          <div className="connect-instruct">
            <h1>Welcome to Connections!</h1>
            <p className="connect-p"> This page is used for studying by drawing connections between different topics you have studied. Add topics, drag and move them, then draw connections. To reset the connections, just leave the page or reload and you are free to start again.</p>
            <p>Click the Add Button to add a new icon for a topic. Click and drag it wherever you'd like in the box. Click the Title to edit, and click right above the title box to highlight it. Once highlighted you can click antoher to draw a connection. They will stay connected even if you mvoe them! Click the connection to delete it. </p>
          </div>

          <button onClick={addItem}>Add Item</button>
          <DndContext onDragEnd={handleDragEnd}>
            <div className="content" style={{ position: "relative", height: "500px", border: "2px solid gray" }}>
              <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
                {connections.map((conn, index) => {
                  const fromItem = items.find(i => i.id === conn.from);
                  const toItem = items.find(i => i.id === conn.to);
                  if (!fromItem || !toItem) return null;
                  return (
                    <line key={index} x1={fromItem.x + 40} y1={fromItem.y + 40} x2={toItem.x + 40} y2={toItem.y + 40} stroke="white" strokeWidth="2" onClick={() => removeConnection(index)} style={{ cursor: "pointer", pointerEvents: "auto" }} />
                  );
                })}
              </svg>
              {items.map(item => <DraggableItem key={item.id} id={item.id} label={item.label} src={item.src} x={item.x} y={item.y} onRename={renameItem} onSelect={handleSelect} onDelete={deleteItem} isSelected={selectedItem === item.id} />)}
            </div>
          </DndContext>
        </div>
      </div>
    </main>
  );
}