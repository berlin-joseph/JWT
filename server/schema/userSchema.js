const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    default: "",
  },
  refresh: {
    type: String,
    default: "",
  },
});

exports.userModel = mongoose.model("User", userSchema);
