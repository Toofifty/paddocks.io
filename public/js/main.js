/** CONFIG */

// dimensions must be even
const GAME_SIZE = 12
const PLAYER_COUNT = 2

/** END CONFIG */

const MAX_SCORE = (GAME_SIZE / 2) * (GAME_SIZE / 2) + ((GAME_SIZE / 2) - 1) * ((GAME_SIZE / 2) - 1)
let currentPlayer = 0
let scores = Array(PLAYER_COUNT).fill(0)

const gateID = (x, y) => 'gate-' + x + '-' + y
const getGate = (x, y) => $('#' + gateID(x, y))

const checkPaddock = (x, y) => {
    const currentGate = getGate(x, y)
    let surroundingTop = []
    let surroundingBottom = []
    if (currentGate.hasClass('tlbr')) {
        surroundingTop = [
            { gate: currentGate, fill: 'tr' },
            { gate: getGate(x, y - 1), fill: 'br' },
            { gate: getGate(x + 1, y - 1), fill: 'bl' },
            { gate: getGate(x + 1, y), fill: 'tl' }
        ]
        surroundingBottom = [
            { gate: currentGate, fill: 'bl' },
            { gate: getGate(x, y + 1), fill: 'tl' },
            { gate: getGate(x - 1, y + 1), fill: 'tr' },
            { gate: getGate(x - 1, y), fill: 'br' }
        ]
    } else {
        surroundingTop = [
            { gate: currentGate, fill: 'tl' },
            { gate: getGate(x - 1, y), fill: 'tr' },
            { gate: getGate(x - 1, y - 1), fill: 'br' },
            { gate: getGate(x, y - 1), fill: 'bl' }
        ]
        surroundingBottom = [
            { gate: currentGate, fill: 'br' },
            { gate: getGate(x + 1, y), fill: 'bl' },
            { gate: getGate(x + 1, y + 1), fill: 'tl' },
            { gate: getGate(x, y + 1), fill: 'tr' }
        ]
    }
    let topFilled = surroundingTop.filter(({ gate }) => gate.hasClass('taken')).length === 4
    let bottomFilled = surroundingBottom.filter(({ gate }) => gate.hasClass('taken')).length === 4
    if (topFilled) {
        for (let i in surroundingTop) {
            surroundingTop[i].gate.append($('<div class="fill ' + surroundingTop[i].fill + ' fill-' + currentPlayer + '">'))
        }
        addToScore()
    }
    if (bottomFilled) {
        for (let i in surroundingBottom) {
            surroundingBottom[i].gate.addClass('fill-' + currentPlayer)
            surroundingBottom[i].gate.append($('<div class="fill ' + surroundingBottom[i].fill + ' fill-' + currentPlayer + '">'))
        }
        addToScore()
    }
    return topFilled || bottomFilled
}

const place = (x, y) => {
    const gate = getGate(x, y)
    if (!gate.hasClass('taken')) {
        gate.addClass('taken')
        gate.addClass('player-' + currentPlayer)
        if (!checkPaddock(x, y)) {
            nextPlayer()
        }
        return true
    }
    return false
}

const addToScore = () => {
    $('#score-' + currentPlayer).text(++scores[currentPlayer])
    let sum = 0
    for (let i = 0; i < PLAYER_COUNT; i++) {
        sum += scores[i]
    }
    if (sum >= MAX_SCORE) {
        gameOver()
    }
}

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

const nextPlayer = () => {
    $('#app').removeClass('turn-' + currentPlayer)
    currentPlayer++
    currentPlayer %= PLAYER_COUNT
    $('#app').addClass('turn-' + currentPlayer)
}

$(() => {
    // check dimensions
    if (GAME_SIZE % 2 || GAME_SIZE % 2) {
        console.error('Game dimensions must be even')
        return
    }
    // initialise game board
    let board = $('<div class="board">')
    for (let j = 0; j < GAME_SIZE; j++) {
        for (let i = 0; i < GAME_SIZE; i++) {
            let cls = (i + j) % 2 === 0 ? 'bltr' : 'tlbr'
            let container = $('<div class="gate-container ' + cls + '" id="' + gateID(i, j) + '">')
            container.append($('<div class="gate">'))
            board.append(container)
        }
    }
    $('#app').append(board)
    board.css({
        'grid-template-rows': 'repeat(' + GAME_SIZE + ', 1fr)',
        'grid-template-columns': 'repeat(' + GAME_SIZE + ', 1fr)',
        width: board.height() + 'px',
    })
    scoreboard = $('<div class="scoreboard">')
    for (i = 0; i < PLAYER_COUNT; i++) {
        scoreboard.append($('<div class="score">Player ' + i + ': <span id="score-' + i + '">0</span></div>'))
    }
    scoreboard.append($('<hr/>'))
    scoreboard.append($('<div class="score">Maximum: <span id="score-max">' + MAX_SCORE + '</span></div>'))
    $('#app').append(scoreboard)
    $('#app').append($('<div class="toggle-posts">Toggle posts</div>'))

    $('.gate-container').click(function () {
        const id = $(this).attr('id')
        const coords = id.replace('gate-', '').split('-').map(i => parseInt(i))
        place(...coords)
    })
    $('.toggle-posts').click(function () {
        $('#app').toggleClass('show-posts')
    })
})