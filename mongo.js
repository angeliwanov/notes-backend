const mongoose = require("mongoose");
const config = require("./utils/config");

// if (process.argv.length < 3) {
//   console.log("give password as argument");
//   process.exit(1);
// }

const url = config.MONGODB_URI;

mongoose.set("strictQuery", false);
mongoose.connect(url).then(() => {
  const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
  });

  const Note = mongoose.model("Note", noteSchema);

  const note = new Note({
    content: "CSS is for styling",
    important: true,
  });

  note.save().then(() => {
    console.log("note saved!");
    mongoose.connection.close();
  });
});
//   Note.find({}).then((result) => {
//     result.forEach((note) => {
//       console.log(note);
//     });
//     mongoose.connection.close();
//   });
// });
