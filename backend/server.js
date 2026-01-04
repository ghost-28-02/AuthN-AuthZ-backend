const express = require('express');
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

require("dotenv").config();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

const user = require("./routes/user");
app.use("/api/v1",user);

app.listen(PORT,()=>{
    console.log(`Server start successfully at port no. ${PORT}`);
});

require("./config/database").connect();

app.get("/", (req, res) => {
    res.send(`<h1>This is HomePage Baby </h1>`);
});