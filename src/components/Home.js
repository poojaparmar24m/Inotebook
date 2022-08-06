import React from "react";
import AddNotes from "./AddNotes";
import Notes from "./Notes";

function Home(props) {
  return (
    <>
      <AddNotes showAlert={props.showAlert} />
      <Notes showAlert={props.showAlert} />
    </>
  );
}

export default Home;
