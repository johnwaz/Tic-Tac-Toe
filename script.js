let layout;
const playable = 'X';
const computer = 'O';
const winMatch = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

const cells = document.querySelectorAll('.cell');
gameStart();

function gameStart() {
  document.querySelector(".gameOver").style.display = "none";
  layout = Array.from(Array(9).keys());
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerHTML = '';
    cells[i].style.removeProperty('background-color');
    cells[i].addEventListener('click', takeTurn, false);
  }
}

function takeTurn(cell) {
  if (typeof layout[cell.target.id] == 'number') {
    play(cell.target.id, playable);
    if (!tieCheck()) play(bestPlace(), computer);
  }
}

function play(spaceId, player) {
  layout[spaceId] = player;
  document.getElementById(spaceId).innerHTML = player;
  let wonGame = winCheck(layout, player);
  if (wonGame) gameEnd(wonGame);
}

function winCheck(field, player) {
  let plays = field.reduce((acc, elem, index) => (elem === player) ? acc.concat(index) : acc, []);
  let wonGame = null;
  for (let [index, win] of winMatch.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      wonGame = {index: index, player: player};
      break;
    }
  }
  return wonGame;
}

function gameEnd(wonGame) {
  for (let index of winMatch[wonGame.index]) {
    document.getElementById(index).style.backgroundColor = wonGame.player == playable ? "green" : "red";
  }
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeEventListener('click', takeTurn, false);
  }
  revealWinner(wonGame.player == playable ? "Game Win!" : "Game Loss!");
}

function revealWinner(winner) {
  document.querySelector(".gameOver").style.display = "block";
  document.querySelector(".gameOver .text").innerHTML = winner;
}

function emptyCells() {
  return layout.filter(s => typeof s == 'number');
}

function bestPlace() {
  return minimax(layout, computer).index;
}

function tieCheck() {
  if (emptyCells().length == 0) {
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "cyan";
      cells[i].removeEventListener('click', takeTurn, false);
    }
    revealWinner("Game Tied!")
    return true;
  }
  return false;
}

function minimax(inPlay, player) {
  let vacancy = emptyCells(inPlay);
  if (winCheck(inPlay, playable)) {
    return {score: -10};
  } else if (winCheck(inPlay, computer)) {
    return {score: 10};
  } else if (vacancy.length === 0) {
    return {score: 0};
  }
  let moves = [];
  for (let i = 0; i < vacancy.length; i++) {
    let move = {};
    move.index = inPlay[vacancy[i]];
    inPlay[vacancy[i]] = player;
    if (player == computer) {
      let result = minimax(inPlay, playable);
      move.score = result.score;
    } else {
      let result = minimax(inPlay, computer);
      move.score = result.score;
    }
    inPlay[vacancy[i]] = move.index;
    moves.push(move);
  }
  let bestMove;
  if (player === computer) {
    let bestVal = -1000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestVal) {
        bestVal = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestVal = 1000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestVal) {
        bestVal = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}