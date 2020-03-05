const express = require('express')
const app = express()
const helmet = require('helmet')
const envp = require('./envp')

const mongoose = require('mongoose')

mongoose.connect(envp.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log('connected to db');
})

app.use(express.json());
app.use(helmet())

app.use('/api/user', require('./routes/auth'));

app.listen(3008, () => {
    console.log('server running');
})