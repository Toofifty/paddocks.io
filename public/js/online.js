/**
 * Online multiplayer game
 */

const joinOnline = (key) => {
    const socket = io()
    socket.emit('join lobby', key)
    socket.once('join lobby response', res => {
        if (res === 'lobby full') {
            console.error('lobby full')
        } else if (res === 'not exists') {
            console.error('lobby doesn\'t exist')
        } else {
            console.log('joined lobby')
            initOnlineGame(key, socket, res.player, res.lobby.gameSize, res.lobby.playerCount)
        }
    })
}

const initOnlineGame = (key, socket, playerID, gameSize, playerCount) => {
    socket.once('begin game', () => {
        console.log('begin game')
        runOnlineGame(key, socket, playerID, gameSize, playerCount)
    })
    if (gameSize % 2 || gameSize % 2) {
        console.error('Game dimensions must be even')
        return
    }
    const board = initBoard(gameSize)
    $('#app').append(board)
    board.css({ width: board.height() + 'px' })
    $('#app').append(initScoreboard(playerCount))
    $('#app').append($('<div class="toggle-posts">You are player ' + playerID + '<br>Toggle posts</div>'))

    $('.toggle-posts').click(function () {
        $('#app').toggleClass('show-posts')
    })
}

const runOnlineGame = (gameKey, socket, playerID, gameSize, playerCount) => {
    let currentPlayer = 0

    socket.on('set player', (id) => {
        currentPlayer = id
    })
    socket.on('place', ({ key, x, y, playerID }) => {
        if (key === gameKey) place(x, y, playerID)
    })

    $('.gate-container').click(function () {
        if (currentPlayer === playerID) {
            const id = $(this).attr('id')
            const coords = id.replace('gate-', '').split('-').map(i => parseInt(i))
            socket.emit('place', { key: gameKey, x: coords[0], y: coords[1], playerID })
        }
    })

}