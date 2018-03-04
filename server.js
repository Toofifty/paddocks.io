const path = require('path')
const express = require('express')
const shortid = require('shortid')

const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const PORT = 3000

const lobbies = {}

app.use(express.static(path.resolve(__dirname, 'public')))
console.log(__dirname)

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

http.listen(PORT, () => {
    console.log(`Listening on :${PORT}`)
})

io.on('connection', function (socket) {
    console.log(socket.id + ' connected')
    socket.on('new lobby', ({ size, players }) => {
        const key = shortid.generate()
        lobbies[key] = new Lobby(size, players)
        this.emit('lobby confirm', key)
    })
    socket.on('join lobby', (key) => {
        console.log(socket, 'trying to join lobby', key)
        if (!lobbies[key]) {
            this.emit('join lobby response', 'not exists')

        } else if (lobbies[key].join(socket.id)) {
            this.emit('join lobby response', {
                player: lobbies[key].connectedPlayers - 1,
                lobby: lobbies[key]
            })
            if (lobbies[key].full()) {
                this.emit('begin game')
            }

        } else {
            this.emit('join lobby response', 'lobby full')
        }
    })
    socket.on('place', ({ key, x, y, playerID }) => {
        lobbies[key].place(x, y, playerID)
    })
})

function Lobby (gameSize, playerCount) {
    this.gameSize = gameSize
    this.playerCount = playerCount
    this.connectedPlayers = []
    this.join = (socketID) => {
        if (!this.full()) {
            this.connectedPlayers.push(socketID)
            return true
        }
        return false
    }
    this.full = () => {
        return this.connectedPlayers.length === this.playerCount
    }
    this.place = () => {
        
    }
}