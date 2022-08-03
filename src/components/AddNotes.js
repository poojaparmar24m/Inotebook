import React, { useContext, useState } from "react";
import noteContext from "../context/notes/NoteContext";

const AddNotes = () => {
  const context = useContext(noteContext);
  const { addNotes } = context;

  const [note, setNote] = useState({
    title: "",
    description: "",
    tag: "",
  });

  const handleClick = (e) => {
    e.preventDefault();
    addNotes(note.title, note.description, note.tag);
    setNote({ title: "", description: "", tag: "" });
  };

  const handleChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  return (
    <div className="container my-3">
      <h3>Add a Notes</h3>
      <form>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            aria-describedby="emailHelp"
            name="title"
            value={note.title}
            onChange={handleChange}
            minLength={5}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="desc" className="form-label">
            Description
          </label>
          <input
            type="text"
            className="form-control"
            id="desc"
            name="description"
            value={note.description}
            onChange={handleChange}
            minLength={5}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="tag" className="form-label">
            Tag
          </label>
          <input
            type="text"
            className="form-control"
            id="tag"
            value={note.tag}
            name="tag"
            onChange={handleChange}
            minLength={5}
            required
          />
        </div>
        <button
          disabled={
            note.title.length < 5 ||
            note.description.length < 5 ||
            note.tag.length < 5
          }
          type="submit"
          className="btn btn-primary"
          onClick={handleClick}
        >
          Add Note
        </button>
      </form>
    </div>
  );
};

export default AddNotes;
