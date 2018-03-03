const path = require('path')
const express = require('express')

const app = express()
const server = require('http').Server(app)
const PORT = 3000

app.use(express.static(path.resolve(__dirname, 'public')))

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

server.listen(PORT, () => {
    console.log(`Listening on :${PORT}`)
})
