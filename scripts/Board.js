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
     * Gets all possible to move tiles to with checkers that can move there
     * @param {Tile[]} tiles Tiles to check
     * @param {Checker[]} checkers Checkers to check
     * @returns {Array} Returns array where 0 index is possible tiles, 1 index is possible checkers
     */
    GetPossibleMoves(tiles, checkers) {
        let possibleTiles = [];
        let possibleCheckers = [];

        for (let tile of tiles) {
            let setOfCheckers = checkers.filter(checker => {
                let inRange = tile.InRange(checker);

                if (inRange) {
                    if (inRange === 1) {
                        if (checker.player === 1 && !checker.king) {
                            if (tile.position[0] < checker.position[0]) {
                                return false;
                            }
                        } else if (checker.player === 2 && !checker.king) {
                            if (tile.position[0] > checker.position[0]) {
                                return false;
                            }
                        }

                        possibleTiles.push(tile);
                        return true;
                    }
                }
            });

            possibleCheckers = possibleCheckers.concat(setOfCheckers);
        }

        possibleTiles = Board.RemoveDuplicates(possibleTiles);
        possibleCheckers = Board.RemoveDuplicates(possibleCheckers);

        return [possibleTiles, possibleCheckers];
    };

    /**
     * Get all empty tiles
     * @param {Tile[]} tiles Array of black tiles
     * @returns {Tile[]} Array of empty tiles
     */
    GetAllEmptyTiles() {
        let tiles = this.GetAllPosibleTiles();

        let emptyTiles = tiles.filter(tile => {
            for (let checker of gameManager.gameBoard.checkers) {
                if (checker.position[0] === tile.position[0] &&
                    checker.position[1] === tile.position[1]) {
                    return false;
                }
            }

            return true;
        });

        return emptyTiles;
    }

    /**
     * Get all possible to move tiles (black one)
     * @returns {Tile[]} Array of tiles that player can move to
    */
    GetAllPosibleTiles() {
        let tiles = []
        let skip = true;
        let counter = 0;

        for (let i = 0; i < gameManager.gameBoard.boardSize; i++) {
            for (let j = 0; j < gameManager.gameBoard.boardSize; j++) {
                if (skip) {
                    skip = !skip;
                } else {
                    tiles.push(gameManager.gameBoard.tiles[counter]);
                    skip = !skip;
                }

                counter++;
            }

            skip = !skip;
        }

        return tiles;
    }

    /**
     * Checks if player needs to attack
     * @param {number} player Player
     * @returns {boolean} true if player don't need to attack, otherwise return checkers that can attack
     */
    MustAttack(player) {
        // Filter out just the checker that belongs to the 'player'
        let checkers = gameManager.gameBoard.checkers.filter(checker => checker.player === player);
        let attackCheckers = checkers.filter(checker => checker.CanMove());

        // If there's at least one checker that can attack return it
        if (attackCheckers.length === 0) {
            // Otherwise return true
            return true;
        } else {
            // If this is a player then help him to see with what checker he can attack
            if (player === gameManager.player) {
                attackCheckers.map((checker) => {
                    gameManager.drawManager.HelpPlayer(checker);
                });
            }

            return attackCheckers;
        }
    };

    /**
    * Removes duplicates from array and returns a new one
    * @param {Array} array Array to remove from
    * @returns {Array} New array without duplicates
    */
    static RemoveDuplicates(array) {
        let uniqueArray = [];

        for (let i = 0; i < array.length; i++) {
            if (uniqueArray.indexOf(array[i]) === -1) {
                uniqueArray.push(array[i])
            }
        }

        return uniqueArray;
    };
};