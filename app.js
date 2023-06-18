'use strict'
// This element is typically an input field used to enter the number of queens.
const numberbox = document.getElementById("numberbox");
// This element is typically a slider input used to adjust the speed 
// or any other relevant value.
const slider = document.getElementById("slider");
// This element represents the progress bar on the page.
const progressBar = document.getElementById("progress-bar")
//This element represents the play button.
const playButton = document.getElementById('play-button');
const pauseButton = document.getElementById("pause-button");

const queen = '<i class="fas fa-chess-queen" style="color:#000"></i>';

let n, speed, tempSpeed, q, Board = 0;
// Board = 0;

// Creating array for all the possible arrangements of the N-Queen
let array = [0, 2, 1, 1, 3, 11, 5, 41, 93];

// Used to store the state of the boards;
let pos = {};
// let position = {};


// Setting the slider value onSlide
//  where a higher value corresponds to a slower speed.
speed = (100 - slider.value) * 10;
tempSpeed = speed;
slider.oninput = function () {
    progressBar.style.width = this.value + "%";
    speed = slider.value;
    speed = (100 - speed) * 10;
}

class Queen {
    constructor() {
        this.position = Object.assign({}, pos);
        // this.Board = 0;
        this.uuid = [];
    }
// solving of the N-Queens problem, updates the board state, 
// and handles user interface interactions.
    nQueen = async () => {
        Board = 0;
        this.position[`${Board}`] = {};
        numberbox.disabled = true;
        await q.solveQueen(Board, 0, n);
        await q.clearColor(Board);
        numberbox.disabled = false;
    }

    isValid = async (board, r, col, n) => {
        //Setting the current box color to orange
        const table = document.getElementById(`table-${this.uuid[board]}`);
        const currentRow = table.firstChild.childNodes[r];
        const currentColumn = currentRow.getElementsByTagName("td")[col];
        currentColumn.innerHTML = queen;
        // currentColumn.style.backgroundColor = "#FF9F1C";
        await q.delay();

        // Checking the queen in the same column
        for (let i = r - 1; i >= 0; --i) {
            const row = table.firstChild.childNodes[i];
            // This line retrieves the current column (specified by the col parameter) 
            // within the current row.
            const column = row.getElementsByTagName("td")[col];

            const value = column.innerHTML;

            if (value == queen) {
                column.style.backgroundColor = "#FB5607";
                // This line sets the HTML content of the current column to a hyphen, 
                // indicating that the current position is not valid.
                currentColumn.innerHTML = "-"
                return false;
            }
            column.style.backgroundColor = "#ffca3a";
            await q.delay();
        }
0
        //Checking the upper left diagonal
        for (let i = r - 1, j = col - 1; i >= 0 && j >= 0; --i, --j) {
            const row = table.firstChild.childNodes[i];
            // retrieves the corresponding column element in the diagonal position
            const column = row.getElementsByTagName("td")[j];
            const value = column.innerHTML;

            if (value == queen) {
                column.style.backgroundColor = "#fb5607";
                currentColumn.innerHTML = "-"
                return false;
            }
            column.style.backgroundColor = "#ffca3a";
            await q.delay();
        }

        // Checking the upper right diagonal
        for (let i = r - 1, j = col + 1; i >= 0 && j < n; --i, ++j) {
            const row = table.firstChild.childNodes[i];
            const column = row.getElementsByTagName("td")[j];

            const value = column.innerHTML;

            if (value == queen) {
                column.style.backgroundColor = "#FB5607";
                currentColumn.innerHTML = "-"
                return false;
            }
            column.style.backgroundColor = "#ffca3a";
            await q.delay();
        }
        return true;
    }
     
    // responsible for clearing the background colors of the cells in the 
    // chessboard after a solution has been found or when resetting the board.
    clearColor = async (board) => {
        for (let j = 0; j < n; ++j) {
            const table = document.getElementById(`table-${this.uuid[board]}`);
            const row = table.firstChild.childNodes[j];
            for (let k = 0; k < n; ++k)
                (j + k) & 1
                    ? (row.getElementsByTagName("td")[k].style.backgroundColor = "#FF9F1C")
                    : (row.getElementsByTagName("td")[k].style.backgroundColor = "#FCCD90");
        }
    }

    delay = async () => {
        await new Promise((done) => setTimeout(() => done(), speed));
    }
    
    // recursively explores different configurations of queens 
    // on the board until a valid solution is found.
    solveQueen = async (board, r, n) => {
        // if r==n this means all queens successfully places 
        if (r == n) {
            //increment board to keep track of valid boards
            ++Board;
            let table = document.getElementById(`table-${this.uuid[Board]}`);
            for (let k = 0; k < n; ++k) {
                let row = table.firstChild.childNodes[k];
                row.getElementsByTagName("td")[this.position[board][k]].innerHTML = queen;
            }

          //  After placing all the queens on the current board, 
          //the position object for the new board (this.position[Board]) 
          //is updated to match the position of the queens on the previous board 
          //(this.position[board]).
            this.position[Board] = this.position[board];
            return;
        }
         
        // explores all possible positions for the queen in a row, 
        //checks their validity, and recursively explores the subsequent rows.
        // If a solution is not found, it backtracks by undoing the changes and 
        //trying the next position in the loop.
        for (let i = 0; i < n; ++i) {
            await q.delay();
            // console.log("outside:" + board);
            await q.clearColor(board);
            if (await q.isValid(board, r, i, n)) {
                await q.delay();
                // console.log("inside:" + board)
                await q.clearColor(board);
                let table = document.getElementById(`table-${this.uuid[board]}`);
                let row = table.firstChild.childNodes[r];
                row.getElementsByTagName("td")[i].innerHTML = queen;

                this.position[board][r] = i;

                if (await q.solveQueen(board, r + 1, n))
                    await q.clearColor(board);

                await q.delay();
                board = Board;
                // console.log(this.Board)
                table = document.getElementById(`table-${this.uuid[board]}`);
                // console.log(JSON.parse(JSON.stringify(table)));
                row = table.firstChild.childNodes[r];
                row.getElementsByTagName("td")[i].innerHTML = "-";

                delete this.position[`${board}`][`${r}`];
            }
        }
    }
}


// handles error conditions if the input is invalid.

playButton.onclick = async function visualise() {
    const chessBoard = document.getElementById("n-queen-board");
    const arrangement = document.getElementById("queen-arrangement");

    n = numberbox.value;
    q = new Queen();
    
    if (n > 8) {
        numberbox.value = "";
        alert("Queen value is too large");
        return;
    } else if (n < 1) {
        numberbox.value = "";
        alert("Queen value is too small");
        return;
    }

    // Removing all the of previous execution context
    while (chessBoard.hasChildNodes()) {
        chessBoard.removeChild(chessBoard.firstChild);
    }
    if (arrangement.hasChildNodes()) {
        arrangement.removeChild(arrangement.lastChild)
    }

    const para = document.createElement("p");
    para.setAttribute("class", "queen-info");
    para.innerHTML = `For ${n}x${n} board, ${array[n] - 1} arrangements are possible.`;
    arrangement.appendChild(para);

    //Adding boards to the Div
    // generates and adds chessboard tables to the chessBoard element, 
    // initializes their cells with appropriate styling and content.
    if (chessBoard.childElementCount === 0) {
        for (let i = 0; i < array[n]; ++i) {
            q.uuid.push(Math.random());
            let div = document.createElement('div');
            let table = document.createElement('table');
            let header = document.createElement('h4');
            // div.setAttribute("id", `div-${100 + uuid[i]}`)
            header.innerHTML = `Board ${i + 1} `
            table.setAttribute("id", `table-${q.uuid[i]}`);
            header.setAttribute("id", `paragraph-${i}`);
            chessBoard.appendChild(div);
            div.appendChild(header);
            div.appendChild(table);
        }
    }

    for (let k = 0; k < array[n]; ++k) {
        let table = document.getElementById(`table-${q.uuid[k]}`);
        for (let i = 0; i < n; ++i) {
            const row = table.insertRow(i); // inserting ith row
            row.setAttribute("id", `Row${i} `);
            for (let j = 0; j < n; ++j) {
                const col = row.insertCell(j); // inserting jth column
                (i + j) & 1
                    ? (col.style.backgroundColor = "#FF9F1C")
                    : (col.style.backgroundColor = "#FCCD90");
                col.innerHTML = "-";
                col.style.border = "0.3px solid #373f51";
            }
        }
        await q.clearColor(k);
    }
    await q.nQueen();
};
