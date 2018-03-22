// Class used t odraw the board and checkers
class DrawManger {
    /**
     * @param {Board} board Board to draw
     */
    constructor(board) {
        this.board = board;
    };

    /**
     * Draws checker on the other tile
     * @param {Checker} checker Checker to move
     * @param {Tile} tile Tile to move to
     */
    MoveChecker(checker, tile) {
        let beenHereAllAlong = document.querySelectorAll('div.beenhereallalong');

        if (beenHereAllAlong.length !== 0) {
            for (let element of beenHereAllAlong) {
                element.classList.remove('beenhereallalong');
            }
        }

        Logger.Log((checker.player === 1 ? '1st' : '2nd') + ' player: ' + DrawManger.GetTileName(checker.position[0], checker.position[1]) + ' > ' +
            DrawManger.GetTileName(tile.position[0], tile.position[1]));

        let tiles = document.querySelector('div.tiles');
        checker.element.parentElement.classList.add('beenhereallalong');
        tiles.childNodes[tile.position[0]].childNodes[tile.position[1]].classList.add('beenhereallalong');
        tiles.childNodes[tile.position[0]].childNodes[tile.position[1]].appendChild(checker.element);
    };

    /**
     * Used by 'click' event on checker to select/deselect
    */
    Select() {
        if (gameManager.gameBoard.checkers[this.getAttribute('id')].player !== 2) {
            return;
        }

        let isPlayersTurn = gameManager.gameBoard.checkers[this.getAttribute('id')].player === gameManager.playerTurn;

        if (isPlayersTurn) {
            // If this element already selected
            if (this.classList.contains('selected')) {
                // Then deselect it
                this.classList.remove('selected');
            } else {
                // Otherwise deselect all
                let checkers = document.getElementsByClassName('checker');

                for (let checker of checkers) {
                    checker.classList.remove('selected');
                }

                // And select this checker
                this.classList.add('selected');
            }
        }
    };

    /**
     * To get name of the tile
     * @param {number} row x of tile
     * @param {number} col y of tile
     * @returns {sring} String of type 'A2', 'G7' and so on
     */
    static GetTileName(row, col) {
        return String.fromCharCode('A'.charCodeAt(0) + parseInt(col)) + (parseInt(row) + 1);
    };

    /**
     * Draws the board and checkers
    */
    DrawBoard() {
        let tiles = document.querySelector('div.tiles');
        let tilesCount = 0;
        let chekersCount = 0;

        for (let row in this.board.board) {
            let horizontal = document.createElement('div');
            horizontal.classList.add('tileRow');

            for (let col in this.board.board[row]) {
                // New tile
                let tile = document.createElement('div');
                tile.classList.add('tile');
                tile.setAttribute('id', 'tile' + tilesCount);
                // Add event to select tile
                tile.addEventListener('click', gameManager.Select);

                // Tooltip to show tile name
                let tooltip = document.createElement('span');
                tooltip.classList.add('tooltiptext');
                tooltip.innerHTML = DrawManger.GetTileName(row, col);
                tile.appendChild(tooltip);

                horizontal.appendChild(tile);
                this.board.tiles[tilesCount] = new Tile(tile, [+row, +col]);
                tilesCount++;

                // New cheker
                let checker = document.createElement('div');
                checker.classList.add('checker');
                checker.setAttribute('id', chekersCount);
                // Add event to select checker
                checker.addEventListener('click', this.Select);

                if (this.board.board[row][col] === 1) {
                    checker.classList.add('black');
                    tile.appendChild(checker);
                    this.board.checkers[chekersCount] = new Checker(checker, [+row, +col], this.board);
                    chekersCount++;
                } else if (this.board.board[row][col] === 2) {
                    checker.classList.add('white');
                    tile.appendChild(checker);
                    this.board.checkers[chekersCount] = new Checker(checker, [+row, +col], this.board);
                    chekersCount++;
                }
            }

            tiles.appendChild(horizontal);
        }
    };
};