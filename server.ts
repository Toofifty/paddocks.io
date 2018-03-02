import path from 'path'
const express = require('express')

const app = express()
const server = require('http').Server(app)
const PORT = 3000

app.get('*', (req, res) => {
    res.send('hello!')
})

server.listen(PORT, () => {
    console.log(`Listening on :${PORT}`)
})
