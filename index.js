const express = require('express')
const  post  = require('./routes/post')
const auth = require('./routes/auth')
const dotenv = require('dotenv');
const mongoose = require('mongoose')
const app = express()

app.use(express.json())


dotenv.config();
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
   })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use('/auth', auth)
app.use('/posts', post)

app.get("/", (req, res) => {
    res.send("express working well")
})
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log("express working")
})