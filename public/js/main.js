/** CONFIG */

// dimensions must be even
let GAME_SIZE = 12
let gameType = 'none'
const PLAYER_COUNT = 2

/** END CONFIG */

const MAX_SCORE = (GAME_SIZE / 2) * (GAME_SIZE / 2) + ((GAME_SIZE / 2) - 1) * ((GAME_SIZE / 2) - 1)

let currentPlayer = 0
let scores = Array(PLAYER_COUNT).fill(0)

let socket = io()

const menu = () => {
    const container = $('<div class="menu-container">')
    const sizeInput = $('<label for="size">Game size</label><input type="number" name="size" value="' + GAME_SIZE + '">')
    const playersInput = $('<label for="players">Players</label><input type="number" name="players" value="' + PLAYER_COUNT + '">')
    const localBtn = $('<button class="btn local-game">Local game</button>')
    const onlineBtn = $('<button class="btn online-game">Online game</button>')
    container.append(sizeInput)
    container.append(playersInput)
    container.append(localBtn)
    container.append(onlineBtn)
    $('#app').append(container)
    localBtn.click(() => {
        GAME_SIZE = parseInt($('input[name=size]').val())
        localGame(GAME_SIZE, parseInt($('input[name=players]').val()))
        window.history.pushState('', 'Paddock local game', '/local')
        container.remove()
    })
    onlineBtn.click(() => {
        socket.emit('new lobby', {
            size: parseInt($('input[name=size]').val()),
            players: parseInt($('input[name=players]').val())
        })
        socket.on('lobby confirm', (key) => {
            window.location.pathname = '/' + key
        })
    })
}

$(() => {
    let path = window.location.pathname
    // ask for lobby list
    socket.emit('lobby list')
    // receive
    socket.once('lobby list', ({ lobbies }) => {
        let ul = $('<ul>')
        for (l in lobbies) {
            ul.append('<li><a href="/' + lobbies[l] + '">Join <strong>' + lobbies[l] + '</strong></a></li>')
        }
        $('.menu-container').append(ul)
    })
    if (path === '/') {
        menu()
    } else if (path === '/local') {
        window.location.pathname = '/'
    } else {
        const gameID = path.replace(/\//g, '')
        joinOnline(gameID)
    }
})