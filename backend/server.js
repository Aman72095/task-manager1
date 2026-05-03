const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

console.log("STARTING SERVER...");

// connect DB
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("DB Connected"))
.catch(err=>console.log("DB ERROR:", err));

// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/task"));
app.use("/api/projects", require("./routes/project"));

// test
app.get("/", (req,res)=>{
  res.send("API running");
});

app.listen(5000, ()=>console.log("Server running on 5000"));