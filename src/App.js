import { useState, useEffect } from "react";
import Note from "./Components/Note";
import React from "react";
import axios from "axios";
import Notification from "./Components/Notification";
import noteService from "./services/notes";

const Footer = () => {
  const footerStyle = {
    color: "green",
    fontStyle: "italic",
    fontSize: 16,
  };
  return (
    <div style={footerStyle}>
      <br />
      <em>
        Note app, Department of Computer Science, University of Helsinki 2022
      </em>
    </div>
  );
};

const App = (props) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    noteService.getAll().then((initialNote) => setNotes(initialNote));
  }, []);

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() > 0.5,
    };

    noteService
      .create(noteObject)
      .then((addedNote) => setNotes(notes.concat(addedNote)));
    setNewNote("");
  };
  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    console.log("note", note);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then((changedNotes) => {
        setNotes(notes.map((n) => (n.id !== id ? n : changedNotes)));
      })
      .catch((error) => {
        setErrorMessage(`This note ${note.content} has already been deleted`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };
  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value);
  };

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  );
};

export default App;
