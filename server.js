const path = require('path')
const express = require('express')
const shortid = require('shortid')
const _ = require('lodash')

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
        lobbies[key] = new Lobby(key, size, players)
        this.emit('lobby confirm', key)
    })
    socket.on('join lobby', (key) => {
        console.log(socket.id, 'trying to join lobby', key)
        if (!lobbies[key]) {
            this.emit('join lobby response', 'not exists')

        } else if (lobbies[key].join(socket.id)) {
            this.emit('join lobby response', {
                player: lobbies[key].connectedPlayers.length - 1,
                lobby: lobbies[key]
            })
            if (lobbies[key].full()) {
                this.emit('begin game')
            }

        } else {
            this.emit('join lobby response', 'lobby full')
        }
    })
    socket.on('place', function ({ key, x, y, playerID }) {
        // if no paddock was captured, change player
        let changePlayer
        try {
            changePlayer = !lobbies[key].place(x, y, playerID)
        } catch (e) {
            // if already taken, do nothing
            return
        }
        this.emit('place', { key, x, y, playerID })
        this.broadcast.emit('place', { key, x, y, playerID })
        if (changePlayer) {
            let nextPlayer = lobbies[key].nextPlayer(playerID)
            this.emit('set player', nextPlayer)
            this.broadcast.emit('set player', nextPlayer)
        }
    })
    socket.on('lobby list', function () {
        this.emit('lobby list', {
            lobbies: _(lobbies).filter(v => !v.full()).map(v => v.key).value()
        })
    })
})

function Lobby (key, gameSize, playerCount) {
    this.gameSize = gameSize
    this.playerCount = playerCount
    this.connectedPlayers = []
    this.key = key
    this.board = (() => {
        let temp = []
        for (let j = 0; j < gameSize; j++) {
            let line = []
            for (let i = 0; i < gameSize; i++) {
                let type = (i + j) % 2 === 0 ? 'bltr' : 'tlbr'
                line.push({ type, taken: false })
            }
            temp.push(line)
        }
        return temp
    })()
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
    this.nextPlayer = (playerID) => {
        return (playerID + 1) % this.playerCount
    }
    this.getGate = (x, y) => {
        // check bounds
        if (
            y < 0 || y >= this.board.length ||
            x < 0 || x >= this.board[y].length
        ) {
            return { taken: false }
        }
        return this.board[y][x]
    }
    this.place = (x, y, playerID) => {
        if (this.getGate(x, y).taken) throw new Error('already taken')
        this.getGate(x, y).taken = true
        let setTop = []
        let setBottom = []
        // see public/js/game.js @checkPaddock
        // for an explanation
        if (this.getGate(x, y).type === 'tlbr') {
            setTop = [
                this.getGate(x, y),
                this.getGate(x, y - 1),
                this.getGate(x + 1, y - 1),
                this.getGate(x + 1, y)
            ]
            setBottom = [
                this.getGate(x, y),
                this.getGate(x, y + 1),
                this.getGate(x - 1, y + 1),
                this.getGate(x - 1, y)
            ]
        } else {
            setTop = [
                this.getGate(x, y),
                this.getGate(x - 1, y),
                this.getGate(x - 1, y - 1),
                this.getGate(x, y - 1)
            ]
            setBottom = [
                this.getGate(x, y),
                this.getGate(x + 1, y),
                this.getGate(x + 1, y + 1),
                this.getGate(x, y + 1)
            ]
        }
        let topFilled = (setTop.filter(v => v.taken).length === 4)
        let bottomFilled = (setBottom.filter(v => v.taken).length === 4)
        return topFilled || bottomFilled
    }
}