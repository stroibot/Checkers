// Board class, holds the board, tiles and checkers
class Board {
    constructor() {
        // Set board size
        this.boardSize = 10;
        // Initialize new matrix
        this.board = this.Initialize();
        // Place checkers for 1st player
        this.PlaceCheckers(1, 0, Math.floor(this.boardSize / 2) - 1);
        // Place checkers for 2nd player
        this.PlaceCheckers(2, this.boardSize - (Math.floor(this.boardSize / 2) - 1), this.boardSize);
        this.tiles = [];
        this.checkers = [];
    };

    /**
     * Initializes new board
     * @returns {number[]} Initialized board
    */
    Initialize() {
        let board = [];

        for (let i = 0; i < this.boardSize; i++) {
            board[i] = [];

            for (let j = 0; j < this.boardSize; j++) {
                board[i][j] = 0;
            }
        }

        return board;
    };

    /**
      * Places checkers on board
      * @param {number} player Player
      * @param {number} startPoint Start point from which to place chekers
      * @param {number} endPoint End point to where to place chekers
     */
    PlaceCheckers(player, startPoint, endPoint) {
        let skip = true;

        for (let i = startPoint; i < endPoint; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (skip) {
                    skip = !skip;
                } else {
                    this.board[i][j] = player;
                    skip = !skip;
                }
            }

            skip = !skip;
        }
    };

    /**
     * Counts the distance between two points
     * @param {number} x1 x coordinate of first point
     * @param {number} y1 y coordinate of first point
     * @param {number} x2 x coordinate of second point
     * @param {number} y2 y coordinate of second point
     * @returns {number} Distance between two points
     */
    static Distance(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    };

    /**
     * To check if there's no other checkers on tile
     * @param {number} row x coordinate of tile
     * @param {number} col y coordinate of tile
     * @returns {boolean} true if there's no other checkers
     */
    IsValidPlacetoMove(row, col) {
        if (row >= 10 || col >= 10) {
            return false;
        }

        if (this.board[row][col] === 0) {
            return true;
        } else {
            return false;
        }
    };

    /**
     * DEBUG: To trace board in console
    */
    Print() {
        let toPrint = '';

        for (let i = 0; i < this.boardSize; i++) {
            toPrint += '| ';

            for (let j = 0; j < this.boardSize; j++) {
                toPrint += (this.board[i][j] ? this.board[i][j] : ' ') + ' | ';
            }

            toPrint += '\r\n-----------------------------------------';
            toPrint += '\r\n';
        }

        console.log(toPrint);
    };

    /**
     * Checks if play needs to attack
     * @param {number} player Player
     * @returns {boolean} true if player must attack, otherwise false
     */
    MustAttack(player) {
        // Filter out just the checker that belongs to the 'player'
        let checkers = gameManager.gameBoard.checkers.filter(checker => checker.player === player);
        let attackCheckers = checkers.filter(checker => checker.CanMove());

        // If there's at least one checker that can attack return false
        if (attackCheckers.length === 0) {
            return false;
        } else {
            return true;
        }
    };
};