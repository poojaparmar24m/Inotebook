import React, { useContext } from "react";
import noteContext from "../context/notes/NoteContext";

const NoteItem = (props) => {
  const context = useContext(noteContext);
  const { deleteNotes } = context;
  const { iNote, updateNote } = props;

  return (
    <div className="col-md-3">
      <div className="card my-3">
        <div className="card-body">
          <h5 className="card-title"> {props.iNote.title}</h5>
          <p className="card-text">{props.iNote.description}</p>

          <hr></hr>
          <div>
            <i
              className="fa-solid fa-trash-can mx-2"
              onClick={() => {
                deleteNotes(iNote._id);
                props.showAlert("Deleted successfully", "success");
              }}
            ></i>
            <i
              className="fa-solid fa-pen-to-square mx-2"
              onClick={() => {
                updateNote(iNote);
              }}
            ></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
