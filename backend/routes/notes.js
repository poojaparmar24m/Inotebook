const express = require("express");
const router = express.Router();
const Note = require("../modals/Notes");
const { body, validationResult } = require("express-validator");
const fetchUser = require("../middleware/fetchUser");

// Route 1: get all the notes using :GET "/api/notes/fetchAllNotes".
router.get("/fetchAllNotes", fetchUser, async (req, res) => {
  try {
    const note = await Note.find({ user: req.user.id });
    res.json(note);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route 2: Add a new notes using :POST "/api/notes/addNote".
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

module.exports = router;
