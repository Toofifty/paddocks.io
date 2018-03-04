/** CONFIG */

// dimensions must be even
const GAME_SIZE = 12
const PLAYER_COUNT = 2

/** END CONFIG */

const MAX_SCORE = (GAME_SIZE / 2) * (GAME_SIZE / 2) + ((GAME_SIZE / 2) - 1) * ((GAME_SIZE / 2) - 1)

let currentPlayer = 0
let scores = Array(PLAYER_COUNT).fill(0)

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
        localGame(parseInt($('input[name=size]').val()), parseInt($('input[name=players]').val()))
        window.history.pushState('', 'Paddock local game', '/local')
        container.remove()
    })
    onlineBtn.click(() => {
        let socket = io()
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
    if (path === '/') {
        menu()
    } else if (path === '/local') {
        window.location.pathname = '/'
    } else {
        const gameID = path.replace(/\//g, '')
        joinOnline(gameID)
    }
})