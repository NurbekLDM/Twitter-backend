const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require ('dotenv').config();

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/auth', require('./routes/authRoutes'));
app.use('/posts', require('./routes/postRoutes'));

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});