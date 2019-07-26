import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// for the class just use render, which we can use function component to replace
function Square(props) {
    return (
        <button id={"square" + props.identiy} className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );    
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                identiy={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }
    
    // create board
    createBoard(count, index) {
        let div = [];
        if (count) {
            let divCount = 0;
            for (let i = 0; i < count; i++) {
                let children = [];
                //Inner loop to create children
                const newIndex = index[i] - count;
                for (let j = newIndex; j < index[i]; j++) {
                    children.push(this.renderSquare(j));
                }
                
                //Create the parent and add the children
                div.push(<div className="board-row">{children}</div>);
                divCount = divCount + 1;
            }           
        }
        return div;
    }

    render() {
        return (  
            <div>
                {this.createBoard(3,[3,6,9])}
                {/* <div className="board-row">
                    {
                        [0,1,2].map ( (n) => {
                            return this.renderSquare(n)
                        })
                    }
                </div>
                <div className="board-row">
                    {
                        [3,4,5].map ( (n) => {
                            return this.renderSquare(n)
                        })
                    }
                </div>
                <div className="board-row">
                    {
                        [6, 7, 8].map((n) => {
                            return this.renderSquare(n)
                        })
                    }
                </div> */}
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
            ],
            histSelected: null
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
        currPosition.push(currPos);
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


        var btn = document.getElementById(move);
        btn.style.fontWeight = 'bold';
        if (move) {
            var oldBtn = document.getElementById(this.state.histSelected);
            oldBtn.style.fontWeight = 'normal';
        }

        this.setState({
            history: history.concat([{
                squares: histInst.squares
            }]),
            xIsNext: move % 2 == 0,
            histSelected: move
        });

    }

    highlightSquares(squares) {
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
                return lines[i];
            }
        }
        return null;
    }

    sortHistory(sortWay) {
        // sort the history list - asc and desc
        this.sortStep(sortWay);
        const movesList = document.getElementById("moves");
        [].map.call(movesList.children, Object).sort(function (a, b) {
            if (sortWay === "desc") {
                return +b.id.match(/\d+/) - +a.id.match(/\d+/);
            } else if (sortWay === "asc") {
                return +a.id.match(/\d+/) - +b.id.match(/\d+/);
            }            
        }).forEach(function (elem) {
            movesList.appendChild(elem);
        });
    }

    sortStep(sortWay) {
        // sort the history list - asc and desc
        const posList = document.getElementById("positions");
        [].map.call(posList.children, Object).sort(function (a, b) {
            if (sortWay === "desc") {
                return +b.id.match(/\d+/) - +a.id.match(/\d+/);
            } else if (sortWay === "asc") {
                return +a.id.match(/\d+/) - +b.id.match(/\d+/);
            }
        }).forEach(function (elem) {
            posList.appendChild(elem);
        });
    }   

    render() {
        const history = this.state.history;
        const position = this.state.position;
        const current = history[history.length - 1];
               
        const winner = calculateWinner(current.squares);
        const winSquares = this.highlightSquares(current.squares);
        if (winSquares) {
            // highlight the squares
            for (let index = 0; index < winSquares.length; index++) {
                const element = "square" + winSquares[index];
                var square = document.getElementById(element);
                square.style.backgroundColor = 'yellow';
            }
        }

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            const curResult = JSON.stringify(history[move].squares);
            return (
                <div id={move}>
                    <li key={move}>
                        <button id={move} onClick={() => this.jumpTo(move)}>{desc}</button>
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
            } else {
                currentPosition = position.slice(0, move);
                currentPosition.push(position[move]);
            }
            const currPosition = JSON.stringify(currentPosition);


            return (
                <div id={move}>
                    <li key={move}>
                        <p>{desc}</p>
                        <p>{currPosition}</p>
                    </li>
                    <br />
                </div>
            );
        });


        let status;
        let allAssigned = false;
        let assignedLen = 0;
        for (let index = 0; index < current.squares.length; index++) {
            if (current.squares[index] !== null) {
                assignedLen = assignedLen + 1;
            }            
        }
        if (current.squares.length === assignedLen) {
            allAssigned = true;
        }
        
        if (winner) {
            status = 'Winner: ' + winner + '  ';
        } else if (allAssigned) {
            status = 'Game is a draw.  ';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O') + '  ';
        }        
        
        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}/>
                </div>
                <div className="game-info">
                    <div>
                        <p class="statusDiv">{status}</p>
                        <button id="descSorting" onClick={() => this.sortHistory("desc")}>Descending Sort History</button>
                        <button id="ascSorting" onClick={() => this.sortHistory("asc")}>Ascending Sort History</button>
                    </div>
                    <br />
                    <p>Steps History</p>
                    <ol id="moves">{moves}</ol>
                </div>
                <div className="history-info">
                    <br />
                    <br />
                    <p>Every Step</p>
                    <ol id="positions">{positions}</ol>
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
