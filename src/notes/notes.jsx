import React, { useState, useEffect } from "react";



export function Notes() {
  const [notes, setNotes] = useState([]);
  const [stickies, setStickies] = useState([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [selectedStickyId, setSelectedStickyId] = useState(null);
  const selectedNote = notes.find(n => n.id === selectedNoteId);
  const[sticky, setSticky] = useState("");

  useEffect(() =>{      //load notes when page open
    const saved = localStorage.getItem("notes");
    if (saved) {
      setNotes(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {     //save notes when they change
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  function addNote() {
    const newNote = {
      id: Date.now(),
      title: title,
      text: text
    };

    setNotes([...notes, newNote]);
    setSelectedNoteId(newNote.id);
    setTitle("");
    setText("");
  }

  function addSticky() {
    const newSticky = {
      id: Date.now(),
      text: ""
    };

    setStickies([...stickies, newSticky]);
    setSelectedStickyId(newSticky.id);
  }

  function updatedNoteText(value) {
    const updated = notes.map(note => note.id === selectedNoteId ? { 
      ...note, text: value }: note);
    setNotes(updated)
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
            <div key={note.id} className="note" onClick={() => setSelectedNoteId(note.id)}>
              <h2>{note.title}</h2>

            {selectedNote && (
              <div className="note-editor">
              <textarea value = {selectedNote?.text || ""} onChange={(e) => updatedNoteText(e.target.value)} placeholder = "Type your text here..." rows={20} cols={60} />
              </div>)}

                </div>
          ))}


          <div className="stickynotes">
            {notes.map(note =>(
              <div key={note.id} className="sticky-note" onClick={() => setSelectedNoteId(note.id)}>
                {selectedNote && (
                  <div className="Sticky-edioter">
                    <textarea value = {selectedNote?.text || ""} onChange={(e) => updatedNoteText(e.target.value)} placeholder = "Type your note here..." rows = {10} col={20} />
                  </div> )}
              </div>
            ))}

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

              <button type="button" onClick={addNote}>
                Add Note
              </button>
              <br /><br />
            </form>
          </div>

          <div className="New-Sticky">
            <form>
              <button type="button" onClick={addStickyNote}>
                Add StickyNote
              </button>
              <br /><br />
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}