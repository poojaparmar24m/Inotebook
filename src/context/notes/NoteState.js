import noteContext from "./NoteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);

  //Get All notes

  const getNotes = async () => {
    // API call
    const response = await fetch(`${host}/api/notes/fetchAllNotes`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = await response.json();
    console.log(json);
    setNotes(json);
  };

  // Add a Notes
  const addNotes = async (title, description, tag) => {
    // API call
    const response = await fetch(`http://localhost:5000/api/notes/addNote`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const json = await response.json();
    console.log(json);
    setNotes(notes.concat(json));
    console.log("adding a new note");
  };

  // Delete a Notes
  const deleteNotes = async (id) => {
    // API call
    const response = await fetch(
      `http://localhost:5000/api/notes//deleteNote/${id}`,
      {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const json = await response.json();
    console.log(json);

    // LOGIC for delete notes
    console.log("deleteIng the note with id", id);
    const newNote = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNote);
  };

  // Edit a Notes
  const editNotes = async (id, title, description, tag) => {
    // API call
    const response = await fetch(`${host}/api/notes//updateNote/${id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const json = await response.json();
    console.log(json);

    let newNotes = JSON.parse(JSON.stringify(notes));
    // Logic to edit  in client
    for (const element of newNotes) {
      // console.log(element);
      if (element._id === id) {
        element.title = title;
        element.description = description;
        element.tag = tag;
        break;
      }
      // console.log("element is", element._id === id);
    }
    setNotes(newNotes);
  };

  return (
    <noteContext.Provider
      value={{ notes, addNotes, deleteNotes, editNotes, getNotes }}
    >
      {props.children}
    </noteContext.Provider>
  );
};

export default NoteState;
