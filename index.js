const express = require("express");
const app = express();
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const PORT = process.env.PORT || 3000; // Use 3000 as default if PORT is not defined

app.use(express.json()); // Call express.json() middleware

require("./config/database").connect();

// Routes import and mount
const user = require("./routes/user");
app.use("/api/v1", user);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
