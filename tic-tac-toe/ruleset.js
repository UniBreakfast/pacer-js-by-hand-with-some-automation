const phases = {
  pregame: [
    'start game',
    'choose player',
  ],
  ingame: [
    'get board state',
    'get current player',
    'get my player',
    'make move',
  ],
  postgame: [
    'get board state',
    'get winner',
    'advance the phase',
  ],
}

const actions = {
  'start game': startGame,
  'choose player': choosePlayer,
  'get board state': getBoardState,
  'get current player': getCurrentPlayer,
  'get my player': getMyPlayer,
  'make move': makeMove,
  'get winner': getWinner,
  'advance the phase': advanceThePhase,
  'list available actions': ({gm}) => gm.listAvailableActions(),
  'get current phase': ({gm}) => gm.getCurrentPhase(),
}

const omnipresentActions = [
  'list available actions',
  'get current phase',
]



const initialState = {
  phase: 'pregame',
  board: [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ],
  currentPlayer: 'cross',
  players: ['cross', 'circle'],
  winner: null,
}

const functions = {
  endGameOrPassTurn,
}

const rules = {
  phases, actions, omnipresentActions,
  functions, initialState, 
}

export default rules

function startGame() {
  return ({state}) => {
    state.phase = 'ingame'
  }
}

function choosePlayer(playerChoice) {
  return ({state}) => {
    state.player = playerChoice
  }
}

function getBoardState() {
  return ({state}) => {
    return state.board
  }
}

function getCurrentPlayer() {
  return ({state}) => {
    return state.currentPlayer
  }
}

function getMyPlayer() {
  return ({state}) => {
    return state.player
  }
}

function makeMove(move) {
  return ({gm, state, functions: {endGameOrPassTurn}}) => {
    const { row, col } = move
    const { currentPlayer, board } = state
    
    if (board[row][col] !== null) {
      gm.signal('invalid move')
    } else {
      board[row][col] = currentPlayer
      checkForWinner()
    }
  }
}

function endGameOrPassTurn({gm, state}) {
  const { board, currentPlayer } = state
  const winningLines = [
    // horizontal
    [[0,0], [0,1], [0,2]],
    [[1,0], [1,1], [1,2]],
    [[2,0], [2,1], [2,2]],
    // vertical
    [[0,0], [1,0], [2,0]],
    [[0,1], [1,1], [2,1]],
    [[0,2], [1,2], [2,2]],
    // diagonal
    [[0,0], [1,1], [2,2]],
    [[0,2], [1,1], [2,0]],
  ]
  
  for (const line of winningLines) {
    const [a, b, c] = line
    const [rowA, colA] = a
    const [rowB, colB] = b
    const [rowC, colC] = c
    const valueA = board[rowA][colA]
    const valueB = board[rowB][colB]
    const valueC = board[rowC][colC]

    if (!valueA || !valueB || !valueC) continue
    
    if (valueA === valueB && valueB === valueC) {
      state.winner = currentPlayer
      state.phase = 'postgame'
      gm.signal('winner found')
      return
    }
  }

  passTurn()
}

function passTurn() {
  return ({state}) => {
    const { currentPlayer, players } = state
    const nextPlayerIndex = (players.indexOf(currentPlayer) + 1) % players.length
    state.currentPlayer = players[nextPlayerIndex]
  }
}
