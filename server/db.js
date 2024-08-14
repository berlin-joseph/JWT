const { default: mongoose } = require("mongoose");

exports.db = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);

    if (db) {
      console.log(db.connection.host);
    }
  } catch (error) {
    console.log(error);
  }
};
