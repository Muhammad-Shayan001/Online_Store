const mongoose = require('mongoose');
const uri = "mongodb+srv://OnlineStore:!OnlineStore123%40@cluster0.3jhql1n.mongodb.net/onlinestore";

mongoose.connect(uri)
  .then(() => {
    console.log("Connected successfully!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection failed:", err);
    process.exit(1);
  });
