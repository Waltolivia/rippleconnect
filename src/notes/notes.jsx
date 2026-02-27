import React, { useState, useEffect } from "react";
import {NavLink} from 'react-router-dom';


export function Notes() {
  const [notes, setNotes] = useState([]);
  const [stickies, setStickies] = useState([]);
  const [indexes, setIndexes] = useState([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [selectedStickyId, setSelectedStickyId] = useState(null);
  const [selectedIndexId, setSelectedIndexId] = useState(null);
  const selectedNote = notes.find(n => n.id === selectedNoteId);
  const selectedSticky = stickies.find(s => s.id === selectedStickyId);
  const selectedIndex = indexes.find(i => i.id === selectedIndexId);

  useEffect(() =>{      //load notes when page open
    const saved = localStorage.getItem("notes");
    if (saved) {
      setNotes(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {     //save notes when they change
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);



  useEffect(() => {
    const saved = localStorage.getItem("stickies");
    if(saved)setStickies(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("stickies", JSON.stringify(stickies)); 
  }, [stickies]);



  useEffect(() => {
    const saved = localStorage.getItem("indexes");
    if (saved) {
      setIndexes(JSON.parse(saved));
    }
  }, []);


  useEffect(() => {
    localStorage.setItem("indexes", JSON.stringify(indexes));
  }, [indexes])
  


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

  function addIndex() {
    const newIndex = {
      id: Date.now(),
      text: ""
    };
    setIndexes([...indexes, newIndex]);
    setSelectedIndexId(newIndex.id);
  }

  function updatedNoteText(value) {
    const updated = notes.map(note => note.id === selectedNoteId ? { 
      ...note, text: value }: note);
    setNotes(updated)
  }


  function updateStickyText(value) {
    const updated = stickies.map(sticky => sticky.id === selectedStickyId ? {
      ...sticky, text: value } : sticky);
    setStickies(updated)
  }

  function updateIndexText(value){
    const updated = indexes.map(index => index.id === selectedIndexId ? {
      ...index, text: value }: index);
      setIndexes(updated)
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

        <div className="content-notes">
          {notes.map(note => (
            <div key={note.id} className="note" onClick={() => setSelectedNoteId(note.id)}>
              <h2>{note.title}</h2>

              {selectedNoteId === note.id ? (
                <textarea value={note.text || ""} onChange={(e) => updatedNoteText(e.target.value)} onBlur={() => setSelectedNoteId(null)} placeholder="Type your text here..." rows={20} cols={60} autoFocus/>
              ) : (
                <p>{note.text || "Click to edit..."}</p>
              )}
            </div>
          ))}


          <div className="stickynotes">
              {stickies.map(sticky => (
                <div key={sticky.id} className="sticky-note" onClick={() => setSelectedStickyId(sticky.id)} >
                  {selectedStickyId === sticky.id ? (
                    <textarea value={sticky.text || ""} onChange={(e) => updateStickyText(e.target.value)} onBlur={() => setSelectedStickyId(null)} placeholder="Type your note here..." rows={5} cols={20} autoFocus/>
                  ) : (
                  <p>{sticky.text || "Click to edit..."}</p>)}
                </div>
              ))}
          </div>

              {indexes.length > 0 && (
              <div className="index-card">
                {indexes.map(index => (
                  <div key={index.id} className="Index-note" onClick={() => setSelectedIndexId(index.id)}>
                  <img src="dist/starryexampleimg.png" alt="Blue Links" width="250" />
                    {selectedIndexId === index.id ? (
                      <textarea value={index.text || ""} onChange={(e) => updateIndexText(e.target.value)} onBlur={() => setSelectedIndexId(null)} placeholder="Type your notes here..." rows={5} cols={15} autoFocus />
                    ) : (
                      <p>{indexes.text || "Click to edit..."}</p>)}
                      </div>
                    ))}
              </div>
              )}


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
                <button type="button" onClick={addSticky}>
                  Add Sticky Note
                </button>
                <br /><br />
              </form>
            </div>

            <div className="New-Index">
              <form>
                <button type="button" onClick={addIndex}>
                  Add Index Card
                </button>
                <br /><br />
              </form>
            </div>



          </div>

      </div>
    </main>
  );
}