import React, { useState, useEffect } from "react";
import {NavLink} from 'react-router-dom';
import { NotesNotifier, NoteEvent } from "./notesNotifier";
import { AuthState } from "../authState";

/* sign in testing:
user 1: helo@hello.com  hello
user 2 stargirl@stargirl.com  stargirl
*/



export function Notes({ authState, userName}) {
    const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("notes");
    return saved ? JSON.parse(saved) : [];
  });

  const [stickies, setStickies] = useState(() => {
    const saved = localStorage.getItem("stickies");
    return saved ? JSON.parse(saved) : [];
  });

  const [indexes, setIndexes] = useState(() => {
    const saved = localStorage.getItem("indexes");
    return saved ? JSON.parse(saved) : [];
  });
  const [notebooks, setNotebooks] = useState(() => {
    const saved = localStorage.getItem("notebooks");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedNotebookId, setSelectedNotebookId] = useState(() => {
    const saved = localStorage.getItem("selectedNotebookId");
    return saved ? Number(saved) : null;
  });
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [selectedStickyId, setSelectedStickyId] = useState(null);
  const [selectedIndexId, setSelectedIndexId] = useState(null);
  const selectedNote = notes.find(n => n.id === selectedNoteId);
  const selectedSticky = stickies.find(s => s.id === selectedStickyId);
  const selectedIndex = indexes.find(i => i.id === selectedIndexId);
  const [notifications, setNotifications] = useState([]);
  const [editingNotebookId, setEditingNotebookId] = useState(null);
  const [socket, setSocket] = useState(null);

  // Use Effects

  useEffect(() => {
    if (authState === AuthState.Authenticated) {
      loadNotes();
    }
  }, [authState]);

  useEffect(() => {     //save notes when they change
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);


  useEffect(() => {
    localStorage.setItem("stickies", JSON.stringify(stickies)); 
  }, [stickies]);


  useEffect(() => {
    localStorage.setItem("indexes", JSON.stringify(indexes));
  }, [indexes])
  
  useEffect(() => {
    const handleEvent = (event) => {
      switch(event.type) {
        case NoteEvent.Add:
        case NoteEvent.Update:
          setNotes(prev => {
            const exists = prev.find(n => n.id === event.value.id);
            if (exists) {
              return prev.map(n => n.id === event.value.id ? event.value : n);
            } else {
              return [...prev, event.value];
            }
          });
          break;
        case NoteEvent.StickyUpdate:
          setStickies(prev => {
            const exists = prev.find(s => s.id === event.value.id);
            if (exists) {
              return prev.map(s => s.id === event.value.id ? event.value : s);
            } else {
              return [...prev, event.value];
            }
          });
          break;
        case NoteEvent.IndexUpdate:
          setIndexes(prev => {
            const exists = prev.find(i => i.id === event.value.id);
            if (exists) {
              return prev.map(i => i.id === event.value.id ? event.value : i);
            } else {
              return [...prev, event.value];
            }
          });
          break;
        default:
          break;
      }
    };

    NotesNotifier.addHandler(handleEvent);
    return () => NotesNotifier.removeHandler(handleEvent);
  }, []);

    useEffect(() => {
      const joinTimer = setTimeout(() => {
        addNotification("🟢 Alex joined the workspace");
      }, 8000);

      return () => {
        clearTimeout(joinTimer);
      };
    }, []);

    useEffect(() => {
      if (selectedNotebookId !== null) {
        localStorage.setItem("selectedNotebookId", selectedNotebookId);
      }
    }, [selectedNotebookId]);

    useEffect(() => {
      localStorage.setItem("notebooks", JSON.stringify(notebooks));
    }, [notebooks]);

    useEffect(() => {   //save when the pages change
      const saveBeforeLeave = () => {
        localStorage.setItem("notes", JSON.stringify(notes));
        localStorage.setItem("stickies", JSON.stringify(stickies));
        localStorage.setItem("indexes", JSON.stringify(indexes));
        localStorage.setItem("notebooks", JSON.stringify(notebooks));
        localStorage.setItem("selectedNotebookId", selectedNotebookId);
      };

      window.addEventListener("beforeunload", saveBeforeLeave);

      return () => {
        window.removeEventListener("beforeunload", saveBeforeLeave);
      };
    }, [notes, stickies, indexes, notebooks, selectedNotebookId]);

    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const notebookFromUrl = params.get("notebook");
      const nbId = notebookFromUrl ? Number(notebookFromUrl) : null;

      if (nbId) {
        setSelectedNotebookId(nbId);
        loadNotes(nbId);
        loadStickies(nbId);
        loadIndexes(nbId);
      } else if (notebooks.length > 0) {
        setSelectedNotebookId(notebooks[0].id);
        loadNotes(notebooks[0].id);
        loadStickies(notebooks[0].id);
        loadIndexes(notebooks[0].id);
      }
    }, [notebooks]);

    useEffect(() => {
      if (authState === AuthState.Authenticated && selectedNotebookId) {
        loadNotes();
      }
    }, [selectedNotebookId, authState]);

    useEffect(() => {
      if (!selectedNotebookId) return;

      const ws = new WebSocket(`ws://${window.location.host}/ws`);

      ws.onopen = () => {
        ws.send(JSON.stringify({
          type: "join",
          notebookId: selectedNotebookId
        }));
      };

      ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data);

        if (data.type === "update") {
          NotesNotifier.broadcastEvent(
            "remote",
            data.event,
            data.value
          );
        }
      };

      setSocket(ws);

      return () => {
        ws.close();
      };
    }, [selectedNotebookId]);

    useEffect(() => {
      if (notebooks.length > 0 && !selectedNotebookId) {
        setSelectedNotebookId(notebooks[0].id);
      }
    }, [notebooks]);

    //functions

    function addNote() {
      if (!selectedNotebookId) {
        addNotification("⚠️ Please select a notebook first");
        return;
      }

    const newNote = {
      id: Date.now(),
      title: title,
      text: text || "New note...",
      notebookId: selectedNotebookId
    };

      saveNoteBackend(newNote);

      setSelectedNoteId(newNote.id);
      setTitle("");
      setText("");
      addNotification(`📝 Note added to Notebook`);

      if (socket) {
        socket.send(JSON.stringify({
          type: "update",
          notebookId: selectedNotebookId,
          event: NoteEvent.Add,
          value: newNote
        }));
      }

      NotesNotifier.broadcastEvent("user", NoteEvent.Add, newNote);
    }

    function addSticky() {
      if (!selectedNotebookId) {
        addNotification("⚠️ Please select a notebook first");
        return;
      }

      const newSticky = {
        id: Date.now(),
        notebookId: selectedNotebookId,
        text: ""
      };

      setStickies([...stickies, newSticky]);

      if (socket) {
        socket.send(JSON.stringify({
          type: "update",
          notebookId: selectedNotebookId,
          event: NoteEvent.StickyUpdate,
          value: newSticky
        }));
      }

      NotesNotifier.broadcastEvent("user", NoteEvent.StickyUpdate, newSticky);
      setSelectedStickyId(newSticky.id);
    }

    function addIndex() {
      if (!selectedNotebookId) {
        addNotification("⚠️ Please select a notebook first");
        return;
      }

      const newIndex = {
        id: Date.now(),
        notebookId: selectedNotebookId,
        text: ""
      };

      if (socket) {
        socket.send(JSON.stringify({
          type: "update",
          notebookId: selectedNotebookId,
          event: NoteEvent.IndexUpdate,
          value: newIndex
        }));
      }

      NotesNotifier.broadcastEvent("user", NoteEvent.IndexUpdate, newIndex);
      setSelectedIndexId(newIndex.id);
    }

    function updatedNoteText(value) {
      if (!selectedNote) return;
      const updatedNote = { ...selectedNote, text: value };

      const updated = notes.map(note =>
        note.id === selectedNoteId ? updatedNote : note
      );

      if (socket) {
        socket.send(JSON.stringify({type: "update", notebookId: selectedNotebookId, event: NoteEvent.Update, value: updatedNote}));
      }

      setNotes(updated);
      NotesNotifier.broadcastEvent("user", NoteEvent.Update, updatedNote);
    }

    function updateStickyText(value) {
      if (!selectedSticky) return;
      const updatedSticky = { ...selectedSticky, text: value };

      const updated = stickies.map(sticky =>
        sticky.id === selectedStickyId ? updatedSticky : sticky
      );

      if (socket) {
        socket.send(JSON.stringify({ type: "update", notebookId: selectedNotebookId, event: NoteEvent.StickyUpdate, value: updatedSticky}));
      }

      setStickies(updated);

      NotesNotifier.broadcastEvent("user", NoteEvent.StickyUpdate, updatedSticky);
    }

  function updateIndexText(value){
    if (!selectedIndex) return;
    const updatedIndex = { ... selectedIndex, text: value };
    const updated = indexes.map(index =>
      index.id === selectedIndexId ? updatedIndex : index
    );

    if (socket) {
      socket.send(JSON.stringify({type: "update", notebookId: selectedNotebookId, event: NoteEvent.IndexUpdate, value: updatedIndex}));
    }
    setIndexes(updated);
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

    function deleteNotebook(id) {
      const updated = notebooks.filter(nb => nb.id !== id);
      setNotebooks(updated);

      if (selectedNotebookId === id) {
        setSelectedNotebookId(null);
      }

      addNotification("🗑️ Notebook deleted");
    }

    function shareNotebook() {
      if (!selectedNotebookId) {
        alert("Select a notebook first");
        return;
      }

      const url = `${window.location.origin}/notes?notebook=${selectedNotebookId}`;

      navigator.clipboard.writeText(url);
      addNotification("🔗 Share link copied!");
    }

    async function loadNotes(notebookId) {
      if (!notebookId) return;
      try {
        const res = await fetch(`/api/notes?notebookId=${notebookId}`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setNotes(data);
        }
      } catch(err) { console.error(err); }
    }

    async function saveNoteBackend(note) {
      try {
        const res = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(note),
        });
        if (res.ok) {
          const data = await res.json();
          setNotes(data);
        } else {
          const err = await res.json();
          alert(`Error saving note: ${err.msg}`);
        }
      } catch (err) {
        console.error(err);
      }
    }

    async function loadStickies(notebookId) {
      try {
        const res = await fetch(`/api/stickies?notebookId=${notebookId}`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setStickies(data);
        }
      } catch(err) { console.error(err); }
    }

    async function loadIndexes(notebookId) {
      try {
        const res = await fetch(`/api/indexes?notebookId=${notebookId}`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setIndexes(data);
        }
      } catch(err) { console.error(err); }
    }

    const filteredIndexes = indexes.filter(
      index => index.notebookId === selectedNotebookId
    );

    const filteredStickies = stickies.filter(
      sticky => sticky.notebookId === selectedNotebookId
    );


      //page content

  return (
    <main>
        <div className="page-content">
          <div className="notebook_bar">
          {notebooks.map((notebook) => (
            <li key={notebook.id} className="notebook-item">
              {editingNotebookId === notebook.id ? (
                <input
                  value={notebook.name}
                  autoFocus
                  onChange={(e) => updateNotebookName(notebook.id, e.target.value)}
                  onBlur={() => setEditingNotebookId(null)}
                />
              ) : (
                <>
                  <NavLink
                    to="/notes"
                    className={`bar-item-button ${selectedNotebookId === notebook.id ? "selected-notebook" : ""}`}
                    onClick={() => setSelectedNotebookId(notebook.id)}
                    onDoubleClick={() => setEditingNotebookId(notebook.id)}
                  >
                    {notebook.name}
                  </NavLink>

                  <button
                    className="delete-notebook"
                    onClick={() => deleteNotebook(notebook.id)}
                  >
                    ❌
                  </button>
                </>
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

        <div className="main-content">
          <div className="notes-instructions">
            <h1>Welcome to the Notebooks!</h1>
            <p>Use the buttons to add Notes, Sticky Notes, and Index Cards to help you take notes. Everything is saved to its notebook so feel free to come back anytime. Notebooks can be shared with friends so you can work as a team!</p>
          </div>
          
          <div className="content-notes">
            {notes
              .filter(note => note.notebookId === selectedNotebookId)
              .map(note => (
              <div key={note.id} className="note" onClick={() => setSelectedNoteId(note.id)}>
                <h2>{note.title}</h2>

                {selectedNoteId === note.id ? (
                  <textarea value={note.text || ""} onChange={(e) => updatedNoteText(e.target.value)} placeholder="Type your text here..." rows={20} cols={60}/>
                ) : (
                  <p>{note.text || "Click to edit..."}</p>
                )}
              </div>
            ))}
          </div>


          {filteredStickies.length > 0 && (
            <div className="stickynotes">
              {filteredStickies.map(sticky => (
                <div key={sticky.id} className="sticky-note" onClick={() => setSelectedStickyId(sticky.id)}>
                  {selectedStickyId === sticky.id ? (
                    <textarea
                      value={sticky.text || ""}
                      onChange={(e) => updateStickyText(e.target.value)}
                      onBlur={() => setSelectedStickyId(null)}
                      placeholder="Type your note here..."
                      rows={5}
                      cols={20}
                      autoFocus
                    />
                  ) : (
                    <p>{sticky.text || "Click to edit..."}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {filteredIndexes.length > 0 && (
            <div className="index-card">
              {filteredIndexes.map(index => (
                <div key={index.id} className="Index-note" onClick={() => setSelectedIndexId(index.id)}>
                  <img src="/starryexampleimg.png" alt="Blue Links" width="250" />
                  {selectedIndexId === index.id ? (
                    <textarea
                      value={index.text || ""}
                      onChange={(e) => updateIndexText(e.target.value)}
                      onBlur={() => setSelectedIndexId(null)}
                      placeholder="Type your notes here..."
                      rows={5}
                      cols={15}
                      autoFocus
                    />
                  ) : (
                    <p>{index.text || "Click to edit..."}</p>
                  )}
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

            <button onClick={shareNotebook}>
              Share Notebook
            </button>

          </div>

      </div>
    </main>
  );
}