import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
    return (
        <button className="square" onClick={() => props.handleClick()}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return <Square value={this.props.squares[i]} handleClick={() => this.props.handleClick(i)} />;
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
    constructor(props) {
        super(props);
        this.state = {
            history: [{ squares: Array(9).fill(null), position: null }],
            isXNext: true,
            stepNumber: 0,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const squares = history[history.length - 1].squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return null;
        }
        squares[i] = this.state.isXNext ? "X" : "O";

        this.setState({
            isXNext: !this.state.isXNext,
            stepNumber: history.length,
            history: history.concat([{ squares, position: i }]),
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            isXNext: step % 2 === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const status = winner ? `Winner: ${winner}.` : `Next player: ${this.state.isXNext ? "X" : "O"}`;

        const moves = history.map(({ squares, position }, index) => {
            let buttonText = index === 0 ? "go to game start" : `move to step ${index}`;
            buttonText += position === null ? "" : ` --> position : (${position % 3}, ${Math.floor(position / 3)})`;
            return (
                <li key={index}>
                    <button onClick={() => this.jumpTo(index)}>{buttonText}</button>
                </li>
            );
        });
        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} handleClick={(i) => this.handleClick(i)} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

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

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
