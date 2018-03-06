/**
 * Online multiplayer game
 */

let me = 0

const joinOnline = (key) => {
    gameType = 'online'
    socket.emit('join lobby', key)
    socket.once('join lobby response', res => {
        if (res === 'lobby full') {
            console.error('lobby full')
        } else if (res === 'not exists') {
            console.error('lobby doesn\'t exist')
        } else {
            console.log('joined lobby')
            initOnlineGame(key, res.player, res.lobby.gameSize, res.lobby.playerCount)
        }
    })
}

const initOnlineGame = (key, playerID, gameSize, playerCount) => {
    socket.once('begin game', () => {
        console.log('begin game')
        runOnlineGame(key, playerID, gameSize, playerCount)
    })
    if (gameSize % 2 || gameSize % 2) {
        console.error('Game dimensions must be even')
        return
    }
    const board = initBoard(gameSize)
    $('#app').append(board)
    board.css({ width: board.height() + 'px' })
    $('#app').append(initScoreboard(playerCount))
    $('#app').append($('<div class="toggle-posts">You are player ' + playerID + '<br>Toggle posts<br><span class="player-indicator">Waiting for game to start</span></div>'))

    $('.toggle-posts').click(function () {
        $('#app').toggleClass('show-posts')
    })
}

const runOnlineGame = (gameKey, playerID, gameSize, playerCount) => {
    let currentPlayer = 0
    me = playerID

    if (currentPlayer === me) {
        $('#app').addClass('current-player')
    }
    $('.player-indicator').text('Player 0\'s turn')

    socket.on('set player', (id) => {
        currentPlayer = id

        if (currentPlayer === me) {
            $('#app').addClass('current-player')
            $('.player-indicator').text('Your turn')
        } else {
            $('#app').removeClass('current-player')
            $('.player-indicator').text('Player ' + id + '\'s turn')
        }
    })
    socket.on('place', ({ key, x, y, playerID }) => {
        if (key === gameKey) {
            place(x, y, playerID)
        }
    })

    $('.gate-container').click(function () {
        if (currentPlayer === me) {
            const id = $(this).attr('id')
            const coords = id.replace('gate-', '').split('-').map(i => parseInt(i))
            socket.emit('place', { key: gameKey, x: coords[0], y: coords[1], playerID: me })
        }
    })

}