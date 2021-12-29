import React from 'react';
import './css/index.css';

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      board: null,
      prevBoard: null,
      score: 0,
      canMove: true,
      win: false
    };
  }

  // Initialize a new game board with two random tiles and reset scores and game states
  startGame() {
    let newBoard = [[0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]];

    newBoard = this.newTile(this.newTile(newBoard));
    this.setState({board: newBoard, prevBoard: null, score: 0, canMove: true, win: false});
  }

  // Generate new tile (upon every move or called twice when starting new game)
  newTile(board) {
    let x = randomInt(0, 4);
    let y = randomInt(0, 4);

    if(board[x][y] === 0) {
      board[x][y] = (randomInt(0, 2) ? 2 : 4);
      return board;
    }
    else { return this.newTile(board); }
  }

  // Compare if two boards are the same
  // Used to check game state and store previous game board for undo
  compareBoard(currBoard, nextBoard) {
    var sameBoard = (JSON.stringify(nextBoard) === JSON.stringify(currBoard)) ? true : false;
    return sameBoard;
  }

  // Check if there are any available moves based off the current board
  // Returns true if there is still a move (game continues)
  // Returns false if there is no move (game over)
  checkGameState(board) {
    let l = this.compareBoard(board, this.moveLeft(board).tempBoard);
    let r = this.compareBoard(board, this.moveRight(board).tempBoard);
    let u = this.compareBoard(board, this.moveUp(board).tempBoard);
    let d = this.compareBoard(board, this.moveDown(board).tempBoard);
    return !(l && r && u && d);
  }

  moveLeft(board) {
    // Set intiial score for this move to 0
    // Make copy of game board to modify
    let moveScore = 0;
    let tempBoard = this.state.board.map(inner => inner.slice());

    // Iterate through each row
    for(var i = 0; i < tempBoard.length; i++) {
      // Index for comparing the current tile with (position we can potentially move to)
      // Start comparing at the first tile from the left
      let moveToIndex = 0;
      // Iterate through each index of the row
      for(var j = 1; j < tempBoard[i].length; j++) {
        // Only perform action if the current tile is non-zero and the tile we are comparing it to is to the left
        if((tempBoard[i][j] !== 0) && (moveToIndex < j)) {
          // Move the current tile to fill the empty position
          if(tempBoard[i][moveToIndex] === 0) {
            tempBoard[i][moveToIndex] = tempBoard[i][j];
            tempBoard[i][j] = 0;
          }
          // If the values are equal, then combine them and increase the value of the tile accordingly
          // Increase the move score as well
          else if(tempBoard[i][moveToIndex] === tempBoard[i][j]) {
            tempBoard[i][moveToIndex] = (tempBoard[i][j] * 2);
            tempBoard[i][j] = 0;
            moveScore += tempBoard[i][moveToIndex];
            moveToIndex++;
          }
          // If the index we are comparing to is neither empty nor the same as the current index, then we have to move the tile to the left of that tile we are comparing to
          // Make sure the tiles aren't already next to each other. If they are, then don't do anything
          else {
            moveToIndex++;
            if(moveToIndex < j) {
              tempBoard[i][moveToIndex] = tempBoard[i][j];
              tempBoard[i][j] = 0;
            }
          }
        }
      }
    }
    return { tempBoard, moveScore };
  }

  moveRight(board) {
    let moveScore = 0;
    let tempBoard = this.state.board.map(inner => inner.slice());

    for(var i = 0; i < tempBoard.length; i++) {
      let moveToIndex = tempBoard[i].length - 1;
      for(var j = tempBoard[i].length - 2; j >= 0; j--) {
        if((tempBoard[i][j] !== 0) && (moveToIndex > j)) {
          if(tempBoard[i][moveToIndex] === 0) {
            tempBoard[i][moveToIndex] = tempBoard[i][j];
            tempBoard[i][j] = 0;
          }
          else if(tempBoard[i][moveToIndex] === tempBoard[i][j]) {
            tempBoard[i][moveToIndex] = (tempBoard[i][j] * 2);
            tempBoard[i][j] = 0;
            moveScore += tempBoard[i][moveToIndex];
            moveToIndex--;
          }
          else {
            moveToIndex--;
            if(moveToIndex > j) {
              tempBoard[i][moveToIndex] = tempBoard[i][j];
              tempBoard[i][j] = 0;
            }
          }
        }
      }
    }
    return { tempBoard, moveScore };
  }

  moveUp(board) {
    let moveScore = 0;
    let tempBoard = this.state.board.map(inner => inner.slice());

    for(var i = 0; i < tempBoard[0].length; i++) {
      let moveToIndex = 0;
      for(var j = 1; j < tempBoard.length; j++) {
        if((tempBoard[j][i]) !== 0 && (moveToIndex < j)) {
          if(tempBoard[moveToIndex][i] === 0) {
            tempBoard[moveToIndex][i] = tempBoard[j][i];
            tempBoard[j][i] = 0;
          }
          else if(tempBoard[moveToIndex][i] === tempBoard[j][i]) {
            tempBoard[moveToIndex][i] = (tempBoard[j][i] * 2);
            tempBoard[j][i] = 0;
            moveScore += tempBoard[moveToIndex][i];
            moveToIndex++;
          }
          else {
            moveToIndex++;
            if(moveToIndex < j) {
              tempBoard[moveToIndex][i] = tempBoard[j][i];
              tempBoard[j][i] = 0;
            }
          }
        }
      }
    }
    return { tempBoard, moveScore };
  }

  moveDown(board) {
    let moveScore = 0;
    let tempBoard = this.state.board.map(inner => inner.slice());

    for(var i = 0; i < tempBoard[0].length; i++) {
      let moveToIndex = tempBoard.length - 1;
      for(var j = tempBoard.length - 2; j >= 0; j--) {
        if((tempBoard[j][i]) !== 0 && (moveToIndex > j)) {
          if(tempBoard[moveToIndex][i] === 0) {
            tempBoard[moveToIndex][i] = tempBoard[j][i];
            tempBoard[j][i] = 0;
          }
          else if(tempBoard[moveToIndex][i] === tempBoard[j][i]) {
            tempBoard[moveToIndex][i] = (tempBoard[j][i] * 2);
            tempBoard[j][i] = 0;
            moveScore += tempBoard[moveToIndex][i];
            moveToIndex--;
          }
          else {
            moveToIndex--;
            if(moveToIndex > j) {
              tempBoard[moveToIndex][i] = tempBoard[j][i];
              tempBoard[j][i] = 0;
            }
          }
        }
      }
    }
    return { tempBoard, moveScore };
  }

  keyInput(key) {
    if(key.keyCode === 27) {
      this.startGame();
      return;
    }
    else if(this.state.canMove && key.keyCode >= 37 && key.keyCode <= 40) {
      let newState;
      if(key.keyCode === 37) { newState = this.moveLeft(this.state.board); }
      else if(key.keyCode === 38) { newState = this.moveUp(this.state.board); }
      else if(key.keyCode === 39) { newState = this.moveRight(this.state.board); }
      else if(key.keyCode === 40) { newState = this.moveDown(this.state.board); }
      let tempBoard = newState.tempBoard;
      let moveScore = newState.moveScore;

      // See if anything actually changed from the move
      if(this.compareBoard(tempBoard, this.state.board)) {
        // If the two boards are the same, see if there are actually any more available
        // If no moves are available, end the game
        if(!this.checkGameState(this.state.board)) { this.setState({canMove: false}); }
      } else {
        // If moves are still available
        // Make a copy of the old board
        // Spawn a new random tile on the current board
        // Update the states with the new board, the previous board, and the score
        let oldBoard = this.state.board.map(inner => inner.slice());
        tempBoard = this.newTile(tempBoard);
        this.setState({board: tempBoard, prevBoard: oldBoard, score: this.state.score + moveScore});
      }
    }
  }

  componentWillMount() {
    this.startGame();
    const body = document.querySelector('body');
    body.addEventListener('keydown', this.keyInput.bind(this));
  }

  render () {
    return (
      <div>
        {!this.state.canMove && <GameOver score={this.state.score}/>}
        <div className="header">
          <div className="score">
            <h2>Score</h2>
            <p>{this.state.score}</p>
          </div>
          <div className="button-container">
            <div className="button button-top" onClick={() => {this.startGame()}}>New Game</div>
            <div className="button" onClick={() => {this.startGame()}}>Undo (WiP)</div>
          </div>
        </div>

        <table>
          {this.state.board.map((row, i) => (<Row key={i} row={row} />))}
        </table>
      </div>
    );
  }
}

const Row = ({row}) => {
  return(
    <tr>
      {row.map((tile, i) => (<Tile key={i} tileValue={tile} />))}
    </tr>
  );
}

const Tile = ({tileValue}) => {
  let tileClass = `tile color-${tileValue}`;

  return (
    <td>
      <div className={tileClass}>{tileValue}</div>
    </td>
  );
}

const GameOver = ({score}) => {
  return (
    <div className="gameover-background">
      <div className="gameover-message">
        <h2>Game Over</h2>
        <h3>Score: {score}</h3>
        <p>Hit ESC to play again!</p>
      </div>
    </div>
  );
}

var randomInt = (lower, higher) => {
  let min = Math.ceil(lower);
  let max = Math.floor(higher);

  return Math.floor(Math.random() * (max - min)) + min;
}

export default Game;
