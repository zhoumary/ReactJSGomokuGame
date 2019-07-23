import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// for the class just use render, which we can use function component to replace
function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );    
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }   

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            xIsNext: true,
            position: [
                Array(2).fill(null)
            ]
        }
    }


    handleClick(i) {
        const history = this.state.history;
        const position = this.state.position;
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const currPosition = position.slice();
        if (calculateWinner(squares) || squares[i]) {
            if (calculateWinner(squares)) {
                alert("The game is over!")
            }else{
                alert("This square has been occupied!")
            }
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        let row = null;
        let column = null;
        if (i >= 0 && i <= 2) {
            row = 1;
            column = i + 1;
        } else if (i >= 3 && i <= 5) {
            row = 2;
            column = i - 2;
        } else if (i >= 6 && i <= 8) {
            row = 3;
            column = i - 5;
        }
        const currPos = [];
        currPos.push(row);
        currPos.push(column);
        const test01 = currPosition[0][0];
        const test02 = currPosition[0][1];
        if (currPosition.length === 1 && currPosition[0][0] === null && currPosition[0][1] === null) {
            currPosition[0][0] = row;
            currPosition[0][1] = column;
        }else{
            currPosition.push(currPos);
        }
        const test = currPosition;
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            xIsNext: !this.state.xIsNext,
            position: currPosition
        });
    }   
    
    jumpTo(move) {
        const histInst = this.state.history[move];
        const history = this.state.history;

        this.setState({
            history: history.concat([{
                squares: histInst.squares
            }]),
            xIsNext: move%2 == 0,
        });

    }

    render() {
        const history = this.state.history;
        const position = this.state.position;
        const current = history[history.length - 1];
               
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            const curResult = JSON.stringify(history[move].squares);
            return (
                <div>
                    <li key={move}>
                        <button onClick={() => this.jumpTo(move)}>{desc}</button>
                        <p>{curResult}</p>
                    </li>
                    <br />
                </div>
            );
        }); 
        
        const positions = position.map((step, move) => {
            const desc = move ?
                'Game history #' + move :
                'Game start';
            let currentPosition = [];
            if (move === 0) {
                currentPosition = position[0];
            }else{
                currentPosition = position;
            }
            const currPosition = JSON.stringify(currentPosition);


            return (
                <div>
                    <li key={move}>
                        <p>{desc}</p>
                        <p>{currPosition}</p>
                    </li>
                    <br />
                </div>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }        
        
        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <br />
                    <ol>{moves}</ol>
                </div>
                <div className="history-info">
                    <br />
                    <br />
                    <ol>{positions}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
