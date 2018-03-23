// AI class that you play against
class AI {
    /**
     * @param {number} player Which one (black or white) checkers the AI will be playing
     */
    constructor(player) {
        this.player = player;
        // Is AI active?
        this.active = true;
        // Used for storing possible tiles to move to
        this.possibleTiles;
        // Used to store possible checkers to move
        this.possibleCheckers;
    };

    /**
     * Stops the AI
    */
    Stop() {
        this.active = !this.active;
    }

    /**
     * Called by GameManager to let AI try to move
    */
    TryToMove() {
        // Only move if the AI is active
        if (this.active) {
            gameManager.drawManager.RemoveMovedTilesHighlight();

            // Get possible tiles
            let tiles = this.GetPossibleTiles();

            // Chec if we attacked or just moved
            if (this.GetPossibleMoves(tiles)) {
                // If so then move
                this.Move();
            } else {
                // Otherwise change the turn
                setTimeout(() => gameManager.ChangePlayerTurn(), 1000); 
            }
        }
    };

    /**
     * AI moves checker
    */
    Move() {
        let randomChecker;
        let randomTile;

        do {
            randomChecker = this.possibleCheckers[Math.floor(Math.random() * this.possibleCheckers.length)];
            randomTile = this.possibleTiles[Math.floor(Math.random() * this.possibleTiles.length)];
        } while (randomTile.InRange(randomChecker) !== 1); // Do until we don't find tile to move to

        if (randomChecker.Move(randomTile)) {
            // If we moved then change the turn
            gameManager.ChangePlayerTurn();
        } else {
            // Otherwise try again
            this.Move();
        }
    };

    /**
     * Get all possible tile to move to
     * @returns {Tile[]} Array of possible tiles
    */
    GetPossibleTiles() {
        let tiles = [];
        let skip = true;
        let counter = 0;

        // Get all black tiles
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

        // Filter out that's are empty
        tiles = tiles.filter(tile => {
            for (let checker of gameManager.gameBoard.checkers) {
                if (checker.position[0] === tile.position[0] &&
                    checker.position[1] === tile.position[1]) {
                    return false;
                }
            }

            return true;
        });

        return tiles;
    };

    /**
     * AI tries to move hi's checkers
     * @param {Tile[]} tiles Possible tiles
     * @returns {bollean} true if AI just moved, false if attacked
     */
    GetPossibleMoves(tiles) {
        let possibleCheckers = [];
        let possibleTiles = [];
        let checkers = gameManager.gameBoard.checkers.filter(checker => checker.player === this.player);

        // To check if we can attack
        if (!gameManager.gameBoard.MustAttack(this.player)) {
            // If not then just move
            for (let tile of tiles) {
                let setOfCheckers = checkers.filter(checker => {
                    let inRange = tile.InRange(checker);

                    if (inRange) {
                        if (inRange === 1) {
                            possibleTiles.push(tile);
                            return true;
                        }
                    }
                });

                possibleCheckers = possibleCheckers.concat(setOfCheckers);
            }

            possibleTiles = AI.RemoveDuplicates(possibleTiles);
            possibleCheckers = AI.RemoveDuplicates(possibleCheckers);

            this.possibleTiles = possibleTiles;
            this.possibleCheckers = possibleCheckers;

            return true;
        } else {
            // Otherwise attack
            if (this.DoJump(tiles, checkers)) {
                return true;
            } else {
                return false;
            }
        }
    };

    /**
     * Attacks enemy
     * @param {Tile[]} tiles 
     * @param {Checker[]} checkers 
     */
    DoJump(tiles, checkers) {
        let found = false;

        for (let tile of tiles) {
            checkers.filter(checker => {
                if (!found) {
                    let inRange = tile.InRange(checker);

                    if (inRange) {
                        if (inRange === 2) {
                            if (checker.Attack(tile)) {
                                checker.Move(tile);

                                if (checker.CanMove()) {
                                    this.DoJump(tiles, [checker]);
                                }

                                found = !found;
                            }
                        }
                    }
                }
            });
        }

        return false;
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