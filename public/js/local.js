/**
 * Local multiplayer game
 */

const DEFAULT_SIZE = 12
const DEFAULT_PLAYER_COUNT = 2

function localGame (gameSize, playerCount) {
    if (gameSize % 2 || gameSize % 2) {
        console.error('Game dimensions must be even')
        return
    }
    const board = initBoard(gameSize)
    $('#app').append(board)
    board.css({ width: board.height() + 'px' })
    $('#app').append(initScoreboard(playerCount))
    $('#app').append($('<div class="toggle-posts">Toggle posts</div>'))

    $('.gate-container').click(function () {
        const id = $(this).attr('id')
        const coords = id.replace('gate-', '').split('-').map(i => parseInt(i))
        place(...coords, currentPlayer)
    })
    $('.toggle-posts').click(function () {
        $('#app').toggleClass('show-posts')
    })
}