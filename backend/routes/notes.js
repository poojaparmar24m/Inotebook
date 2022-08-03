const express = require("express");
const router = express.Router();
const Note = require("../modals/Notes");
const { body, validationResult } = require("express-validator");
const fetchUser = require("../middleware/fetchUser");

// Route 1: get all the notes using :GET "/api/notes/fetchAllNotes".login required.
router.get("/fetchAllNotes", fetchUser, async (req, res) => {
  try {
    const note = await Note.find({ user: req.user.id });
    res.json(note);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route 2: Add a new notes using :POST "/api/notes/addNote".login required.
router.post(
  "/addNote",
  fetchUser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "description must be atLeast  5 ").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      // if there are errors ,return bed request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route 3: update an existing notes using :PUT "/api/notes//updateNote/:id".login required.
router.put("/updateNote/:id", fetchUser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    // create a newNote object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // Find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not found");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error);
  }
});

// Route 4: DeleteNote notes using :Delete "/api/notes//deleteNote/:id". login required.
router.delete("/deleteNote/:id", fetchUser, async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    const trimmedID = id.trim();
    //find the note to be deleted and delete it .
    let note = await Note.findById(trimmedID);
    if (!note) {
      return res.status(404).send("Not Found");
    }
    // allow deletion only if user owns this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    note = await Note.findByIdAndDelete(trimmedID);
    res.json({ Success: "Note has been deleted", note: note });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
