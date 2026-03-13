import React, { useState, useEffect } from "react";
import {NavLink} from 'react-router-dom';
import { NotesNotifier, NoteEvent } from "./notesNotifier";


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
  const [notebooks, setNotebooks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedNotebookId, setSelectedNotebookId] = useState(null);
  const [editingNotebookId, setEditingNotebookId] = useState(null);


  // Use Effects

  useEffect(() =>{      //load notes when page open
    const saved = localStorage.getItem("notes");
    if (saved) {
      setNotes(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {     //save notes when they change
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {     //fake second user
    const timer = setTimeout(() => {
      const newNotebook = {
        id: Date.now(),
        name: "Notebook 2",
        owner: "Other User"
      };

      setNotebooks((prev) => [...prev, newNotebook]);

      setNotification("Another user added Notebook 2!");
    }, 5000); // appears after 5 seconds

    return () => clearTimeout(timer);
  }, []);

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
  
  useEffect(() => {
    const handleEvent = (event) => {
      if (event.type === NoteEvent.Add) {
        setNotes((prev) => [...prev, event.value]);
      }
      if(event.type === NoteEvent.Update) {
        setNotes((prev) =>
        prev.map((note) =>
      note.id === event.value.id ? event.value : note));
      }
      if (event.type === NoteEvent.StickyUpdate) {
        setIndexes((prev) =>
        prev.map((sticky) =>
        sticky.id === event.value.id ? event.value : sticky));
      }
      if (event.type === NoteEvent.IndexUpdate) {
        setIndexes((prev) =>
        prev.map((index) =>
        index.id === event.value.id ? event.value : index));
      }
    };
    NotesNotifier.addHandler(handleEvent);

    return () => {
      NotesNotifier.removeHandler(handleEvent);
    };
  }, []);

    useEffect(() => {
      const joinTimer = setTimeout(() => {
        addNotification("🟢 Alex joined the workspace");
      }, 8000);

      const notebookTimer = setTimeout(() => {
        const newNotebook = {
          id: Date.now(),
          name: "Alex's Ideas",
          owner: "Alex"
        };

        setNotebooks((prev) => [...prev, newNotebook]);
        addNotification("📒 Alex created 'Alex's Ideas'");
      }, 15000);

      return () => {
        clearTimeout(joinTimer);
        clearTimeout(notebookTimer);
      };
    }, []);


    //functions

    function addNote() {
      if (!selectedNotebookId) {
        addNotification("⚠️ Please select a notebook first");
        return;
      }

      const newNote = {
        id: Date.now(),
        notebookId: selectedNotebookId,
        title: title,
        text: text
      };

  setNotes([...notes, newNote]);
  setSelectedNoteId(newNote.id);

  addNotification(`📝 Note added to Notebook`);
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
    const updatedNote = { ...selectedNote, text: value };
    const updated = notes.filter(note => note.notebookId === selectedNotebookId).map(note => 
      note.id === selectedNoteId ? updatedNote : note);
    setNotes(updated);
    NotesNotifier.broadcastEvent("user", NoteEvent.Update, updatedNote);
  }
    function updateStickyText(value) {
      const updatedSticky = {...selectedSticky, text: value};
      const updated = stickies.map(sticky => sticky.id === selectedStickyId ? {...sticky, text: value } : sticky);
      setStickies(updated)
      NotesNotifier.broadcastEvent("user", NoteEvent.StickyUpdate, updatedSticky);
    }

    function updateIndexText(value){
      const updatedIndex = {...selectedIndex, text: value};
      const updated = indexes.map(index => index.id === selectedIndexId ? {...index, text: value }: index);
      setIndexes(updated)
      NotesNotifier.broadcastEvent("user", NoteEvent.IndexUpdate, updatedIndex);
    }


    function addNotification(message) {
      const newNotification = {
        id: Date.now(),
        message: message
      };

      setNotifications((prev) => [...prev, newNotification]);

      // remove after 5 seconds
      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== newNotification.id)
        );
      }, 5000);
    }

    function addNotebook() {
      const newNotebook = {
        id: Date.now(),
        name: `Notebook ${notebooks.length + 1}`,
        owner: "You"
      };

      setNotebooks([...notebooks, newNotebook]);
      setSelectedNotebookId(newNotebook.id);

      addNotification(`📒 You created ${newNotebook.name}`);
    }

    function updateNotebookName(id, value) {
      const updated = notebooks.map((nb) =>
        nb.id === id ? { ...nb, name: value } : nb
      );

      setNotebooks(updated);
    }


      //page content

  return (
    <main>
        <div className="page-content">
          <div className="notebook_bar">
          {notebooks.map((notebook) => (
            <li key={notebook.id}>
              {editingNotebookId === notebook.id ? (
                <input
                  value={notebook.name}
                  autoFocus
                  onChange={(e) => updateNotebookName(notebook.id, e.target.value)}
                  onBlur={() => setEditingNotebookId(null)}
                />
              ) : (
                <NavLink
                  to="/notes"
                  className="bar-item-button"
                  onClick={() => setSelectedNotebookId(notebook.id)}
                  onDoubleClick={() => setEditingNotebookId(notebook.id)}
                >
                  {notebook.name}
                </NavLink>
              )}
            </li>
          ))}
              <button className="new_notebook" type="button" onClick={addNotebook}>
                New Notebook
              </button>
          </div>

        <div className="notifications">
          {notifications.map((note) => (
            <div key={note.id} className="notification">
              {note.message}
            </div>
          ))}
        </div>

        <div className="content-notes">
          {notes
            .filter(note => note.notebookId === selectedNotebookId)
            .map(note => (
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
                  <img src="/starryexampleimg.png" alt="Blue Links" width="250" />
                    {selectedIndexId === index.id ? (
                      <textarea value={index.text || ""} onChange={(e) => updateIndexText(e.target.value)} onBlur={() => setSelectedIndexId(null)} placeholder="Type your notes here..." rows={5} cols={15} autoFocus />
                    ) : (
                      <p>{index.text || "Click to edit..."}</p>)}
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