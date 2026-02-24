import React, { useState, useEffect } from "react";



export function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  function addNote() {
    const newNote = {
      id: Date.now(),
      title: title,
      text: text
    };

    setNotes([...notes, newNote]);
    setTitle("");
    setText("");
  }

  return (
    <main>
        <div className="page-content">
            <div className = "notebook_bar">
                <li><a href="notes.html" className = "bar-item-button">Notebook1</a></li>
                <li><a href="#" className = "bar-item-button">Notebook2</a></li>
                <li><a href="#" className = "bar-item-button">Notebook3</a></li>
                <button className="new_notebook" type="button">New Notebook</button>
            </div>  

        <div className="content-notes">
          {notes.map(note => (
            <div key={note.id} className="note">
              <h2>{note.title}</h2>
              <p>{note.text}</p>
              </div>
          ))}

          <div className="stickynotes">
            <div className="sticky-note">
              This is a small sticky note to the side.
            </div>

            <div className="index-card">
              <img
                src="/images/starryexampleimg.png"
                alt="Blue Links"
                width="250"
              />
              <p>This is the starry night painting</p>

              <ul>
                <li>It is a beautiful painting</li>
                <li>I love the colors</li>
                <li>This is a note for ideas</li>
              </ul>
            </div>
          </div>

          <div className="New-Note">
            <form>
              <label htmlFor="title">Title: </label>
              <input 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                />
              <br /><br />

              <label htmlFor="note">Text:</label>
              <input 
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                />
              <button type="button" onClick={addNote}>
                Add Note
              </button>
              <br /><br />
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}