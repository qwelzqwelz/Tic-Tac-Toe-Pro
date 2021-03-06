import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
    return (
        <button className={`square ${props.highlight ? "highlight" : ""}`} onClick={() => props.handleClick()}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                key={i}
                highlight={this.props.line.includes(i)}
                value={this.props.squares[i]}
                handleClick={() => this.props.handleClick(i)}
            />
        );
    }

    renderRow(rowIndex, length) {
        return (
            <div key={rowIndex} className="board-row">
                {Array(length)
                    .fill()
                    .map((elem, index) => {
                        return this.renderSquare(rowIndex * length + index);
                    })}
            </div>
        );
    }

    render() {
        const LENGTH = 3;
        return (
            <div>
                {Array(LENGTH)
                    .fill()
                    .map((elem, index) => {
                        return this.renderRow(index, LENGTH);
                    })}
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
            selectedIndex: null,
            toASC: false,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const squares = history[history.length - 1].squares.slice();
        if (calculateWinner(squares)[0] || squares[i]) {
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
            selectedIndex: step,
        });
    }

    reverseOrder() {
        this.setState({
            toASC: !this.state.toASC,
        });
    }

    render() {
        let history = this.state.history.slice();
        const current = history[this.state.stepNumber];
        const [winner, line] = calculateWinner(current.squares);
        const status = winner
            ? `Winner: ${winner}.`
            : calculateGameDraw(current.squares)
            ? "平局"
            : `Next player: ${this.state.isXNext ? "X" : "O"}`;

        const moves = history.map(({ squares, position }, index) => {
            let buttonText = index === 0 ? "go to game start" : `move to step ${index}`;
            buttonText += position === null ? "" : ` --> position : (${position % 3}, ${Math.floor(position / 3)})`;
            return (
                <li key={index}>
                    <button className={index === this.state.selectedIndex ? "selected" : ""} onClick={() => this.jumpTo(index)}>
                        {buttonText}
                    </button>
                </li>
            );
        });
        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} line={line} handleClick={(i) => this.handleClick(i)} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button className="reverse-button" onClick={() => this.reverseOrder()}>
                        {this.state.toASC ? "正序" : "逆序"}
                    </button>
                    <ol>{this.state.toASC ? moves.reverse() : moves}</ol>
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
            return [squares[a], lines[i]];
        }
    }
    return [null, []];
}

function calculateGameDraw(squares) {
    let result = true;
    for (let i = squares.length - 1; i >= 0; i--) {
        if (squares[i] !== "X" && squares[i] !== "O") {
            result = false;
            break;
        }
    }

    return result;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
