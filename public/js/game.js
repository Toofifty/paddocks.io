/**
 * Common game functions
 */

/**
 * Get the HTML ID for a gate at x, y
 *
 * @param {Number} x
 * @param {Number} y
 * @returns {String} id
 */
const gateID = (x, y) => 'gate-' + x + '-' + y

/**
 * Get the jQuery gate node at x, y
 *
 * @param {Number} x
 * @param {Number} y
 * @returns {Node} gate
 */
const getGate = (x, y) => $('#' + gateID(x, y))

/**
 * After adding a gate to x, y, check if
 * it completes any surrounding paddocks.
 * Returns true if at least one paddock was
 * completed (max 2)
 *
 * @param {Number} x
 * @param {Number} y
 * @param {Number} player id
 * @returns {Boolean} paddock created
 */
const checkPaddock = (x, y, player) => {
    const currentGate = getGate(x, y)

    // collection of adjacent gates that connect
    // to the top of the current gate
    let setTop = []
    // same, but for the bottom of the current gate
    let setBottom = []

    // gate combinations are different for the two
    // orientations of gates (tl-br and bl-tr)
    if (currentGate.hasClass('tlbr')) {
        // populate each possible set of paddock
        // boundary gates, going clockwise beginning
        // at the current gate
        // the fill value is used to know which part
        // actually contains the paddock
        setTop = [
            //    ---->
            // ^ (1) (2) |
            // | (0) (3) v
            { gate: currentGate, fill: 'tr' },
            { gate: getGate(x, y - 1), fill: 'br' },
            { gate: getGate(x + 1, y - 1), fill: 'bl' },
            { gate: getGate(x + 1, y), fill: 'tl' }
        ]
        setBottom = [
            // ^ (3) (0) |
            // | (2) (1) v
            //    <----
            { gate: currentGate, fill: 'bl' },
            { gate: getGate(x, y + 1), fill: 'tl' },
            { gate: getGate(x - 1, y + 1), fill: 'tr' },
            { gate: getGate(x - 1, y), fill: 'br' }
        ]
    } else {
        setTop = [
            { gate: currentGate, fill: 'tl' },
            { gate: getGate(x - 1, y), fill: 'tr' },
            { gate: getGate(x - 1, y - 1), fill: 'br' },
            { gate: getGate(x, y - 1), fill: 'bl' }
        ]
        setBottom = [
            { gate: currentGate, fill: 'br' },
            { gate: getGate(x + 1, y), fill: 'bl' },
            { gate: getGate(x + 1, y + 1), fill: 'tl' },
            { gate: getGate(x, y + 1), fill: 'tr' }
        ]
    }
    // for each set of adjacent gates, check if they are all taken
    let topFilled = (setTop.filter(({ gate }) => gate.hasClass('taken')).length === 4)
    let bottomFilled = (setBottom.filter(({ gate }) => gate.hasClass('taken')).length === 4)
    // if they are all taken, fill the paddock and increment the
    // current player's score
    if (topFilled) {
        for (let i in setTop) {
            setTop[i].gate.append($('<div class="fill ' + setTop[i].fill + ' fill-' + player + '">'))
        }
        incrementScore(player)
    }
    // do the same for the bottom set
    if (bottomFilled) {
        for (let i in setBottom) {
            setBottom[i].gate.append($('<div class="fill ' + setBottom[i].fill + ' fill-' + player + '">'))
        }
        incrementScore(player)
    }
    // return true if either were filled
    return topFilled || bottomFilled
}

/**
 * Place a gate at (x, y) for the player
 * given. If the move is not valid, return
 * false. If the move does not capture a
 * paddock, return true and move to next player.
 * If the move does capture at least one
 * paddock, return true and do not change players.
 *
 * @param {Number} x
 * @param {Number} y
 * @param {Number} player id
 * @returns {Boolean} place successful
 */
const place = (x, y, player) => {
    const gate = getGate(x, y)
    if (!gate.hasClass('taken')) {
        gate.addClass('taken')
        gate.addClass('player-' + player)
        if (!checkPaddock(x, y, player)) {
            nextPlayer(player)
        }
        return true
    }
    return false
}

/**
 * Increment the score for a player
 * by 1. If all paddocks are taken,
 * end the game
 *
 * @param {Number} player
 */
const incrementScore = (player) => {
    $('#score-' + player).text(++scores[player])
    let sum = 0
    for (let i = 0; i < PLAYER_COUNT; i++) {
        sum += scores[i]
    }
    if (sum >= (GAME_SIZE / 2) * (GAME_SIZE / 2) + ((GAME_SIZE / 2) - 1) * ((GAME_SIZE / 2) - 1)) {
        gameOver()
    }
}

/**
 * End the game, and calculate
 * the winner.
 */
const gameOver = () => {
    let max_score = 0
    let winner = 0
    for (let i = 0; i < PLAYER_COUNT; i++) {
        if (scores[i] > max_score) {
            winner = i
            max_score = scores[i]
        }
    }
    $('.scoreboard .score:last-child').remove()
    $('.scoreboard').append($('<div class="score">Player ' + winner + ' wins!</div>'))
}

/**
 * Move to the next player
 *
 * @param {Number} player
 * @returns {Number} next player
 */
const nextPlayer = (player) => {
    $('#app').removeClass('turn-' + player)
    currentPlayer = player + 1
    currentPlayer %= PLAYER_COUNT
    $('#app').addClass('turn-' + currentPlayer)
    return currentPlayer
}

/**
 * Initialize an HTML game board
 * with x and y === size
 *
 * @param {Number} size
 * @returns {Node} board
 */
const initBoard = (size) => {
    // initialise game board
    let board = $('<div class="board">')
    for (let j = 0; j < size; j++) {
        for (let i = 0; i < size; i++) {
            let cls = (i + j) % 2 === 0 ? 'bltr' : 'tlbr'
            let container = $('<div class="gate-container ' + cls + '" id="' + gateID(i, j) + '">')
            container.append($('<div class="gate">'))
            board.append(container)
        }
    }
    board.css({
        'grid-template-rows': 'repeat(' + size + ', 1fr)',
        'grid-template-columns': 'repeat(' + size + ', 1fr)'
    })
    return board
}

const initScoreboard = (playerCount) => {
    scoreboard = $('<div class="scoreboard">')
    for (i = 0; i < playerCount; i++) {
        scoreboard.append($('<div class="score">Player ' + i + ': <span id="score-' + i + '">0</span></div>'))
    }
    scoreboard.append($('<hr/>'))
    scoreboard.append($('<div class="score">Maximum: <span id="score-max">' + ((GAME_SIZE / 2) * (GAME_SIZE / 2) + ((GAME_SIZE / 2) - 1) * ((GAME_SIZE / 2) - 1)) + '</span></div>'))
    return scoreboard
}