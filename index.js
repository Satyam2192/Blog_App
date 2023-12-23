const express = require("express");
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');

const cookieParser = require("cookie-parser")

dotenv.config();

const PORT = process.env.PORT || 3000; 

app.use(cors({
  origin: 'http://localhost:5173',
}));

app.use(express.json()); // Call express.json() middleware

app.use(cookieParser());

require("./config/database").connect();

// Routes import and mount
const user = require("./routes/user");
//Routes for Blog
const blog = require("./routes/blog");
app.use("/api/v1", user, blog);



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
