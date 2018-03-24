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
            let tiles = gameManager.gameBoard.GetAllEmptyTiles();

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
            // Gather all kings
            let kings = this.possibleCheckers.filter(checker => checker.king);

            // If there's at least one king let AI prefer it with a 50% chance
            if (kings.length !== 0 && Math.random() >= 0.5) {
                randomChecker = kings[Math.floor(Math.random() * kings.length)];
                randomTile = this.possibleTiles[Math.floor(Math.random() * this.possibleTiles.length)];
            } else {
                // Otherwise go with common ones
                randomChecker = this.possibleCheckers[Math.floor(Math.random() * this.possibleCheckers.length)];
                randomTile = this.possibleTiles[Math.floor(Math.random() * this.possibleTiles.length)];
            }
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
     * AI tries to move his checkers
     * @param {Tile[]} tiles Possible tiles
     * @returns {bollean} true if AI just moved, false if attacked
     */
    GetPossibleMoves(tiles) {
        let checkers = gameManager.gameBoard.checkers.filter(checker => checker.player === this.player);

        // To check if we can attack
        if (gameManager.gameBoard.MustAttack(this.player) === true) {
            // If not then just move

            // Lets check if AI can move at all
            let possible = gameManager.gameBoard.GetPossibleMoves(tiles, checkers);

            this.possibleTiles = possible[0];
            this.possibleCheckers = possible[1];

            if (this.possibleCheckers.length === 0 || this.possibleTiles.length === 0) {
                // If the AI can't move at all then he loses
                gameManager.EndTheGame(2);
                return false;
            }

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
};