// Checker class, holds the logic of checker
class Checker {
    /**
     * @param {Node} element Linked DOM lement
     * @param {number[]} position Position on board
     * @param {Board} board Board where checker is located
     */
    constructor(element, position, board) {
        this.element = element;
        this.position = position;
        // By default checker is not a king
        this.king = false;
        // To whom this checker belongs
        this.player;
        this.board = board;

        // Depending on the 'id' attribute set 'player' property
        if (this.element.getAttribute('id') < 20) {
            this.player = 1;
        } else {
            this.player = 2;
        }
    };

    /**
     * Makes checker a king by changing 'king' property to true and adding specific style
    */
    MakeKing() {
        let kingStyle = document.createElement('i');
        kingStyle.classList.add('em', 'em-crown');

        this.element.appendChild(kingStyle);
        this.king = true;
    };

    /**
     * Used to move our checkers
     * @param {Tile} tile Tile to move
     * @returns {boolean} True if we moved
     */
    Move(tile) {
        if (!this.board.IsValidPlacetoMove(tile.position[0], tile.position[1])) {
            return false;
        }

        this.element.classList.remove('selected');

        // To be sure that checker can't go backwards if it's not a king
        if (this.player === 1 && !this.king) {
            if (tile.position[0] < this.position[0]) {
                return false;
            }
        } else if (this.player === 2 && !this.king) {
            if (tile.position[0] > this.position[0]) {
                return false;
            }
        }

        // Change place of checker on the board
        this.board.board[this.position[0]][this.position[1]] = 0;
        this.board.board[tile.position[0]][tile.position[1]] = this.player;

        gameManager.drawManager.MoveChecker(this, tile);

        this.position = [tile.position[0], tile.position[1]];

        // If the checker reached the end of the board then make it a king
        if (!this.king && (this.position[0] === 0 || this.position[0] === this.board.boardSize - 1)) {
            this.MakeKing();

            Logger.Log((this.player === 1 ? '1st' : '2nd') + ' player: ' + DrawManger.GetTileName(this.position[0], this.position[1]) +
                        ' became king');
        }

        //this.board.Print();
        return true;
    };

    /**
     * To check can we move anywhere at all
     * @returns {boolead} True if we can move anywhere
    */
    CanMove() {
        if (this.position.length === 0) {
            return false;
        }

        if (this.CanAttack([this.position[0] + 2, this.position[1] + 2]) ||
            this.CanAttack([this.position[0] + 2, this.position[1] - 2]) ||
            this.CanAttack([this.position[0] - 2, this.position[1] + 2]) ||
            this.CanAttack([this.position[0] - 2, this.position[1] - 2])) {
            return true;
        } else {
            return false;
        }
    };

    /**
     * To check if we can attack an enemy checker
     * @param {Array} newPosition New position to jump
     * @returns {*} false if we cannot attack, otherwise an enemy cheker
     */
    CanAttack(newPosition) {
        if (newPosition === undefined) {
            return false;
        }

        if (isNaN(newPosition[0] || isNaN(newPosition[1]))) {
            return false;
        }

        // To be sure that we can't go out of boundaries
        if (newPosition[0] > this.board.boardSize || newPosition[1] > this.board.boardSize || newPosition[0] < 0 || newPosition[1] < 0) {
            return false;
        }
    
        let dx = newPosition[1] - this.position[1];
        let dy = newPosition[0] - this.position[0];

        // To be sure that checker can't go backwards if it's not a king
        if (this.player === 1 && !this.king) {
            if (newPosition[0] < this.position[0]) {
                return false;
            }
        } else if (this.player === 2 && !this.king) {
            if (newPosition[0] > this.position[0]) {
                return false;
            }
        }

        // The enemy checker
        let checkTileX = Math.floor(this.position[1] + dx / 2);
        let checkTileY = Math.floor(this.position[0] + dy / 2);

        // If there's an enemy checker and the next tile is empty
        if (!this.board.IsValidPlacetoMove(checkTileY, checkTileX) && this.board.IsValidPlacetoMove(newPosition[0], newPosition[1])) {
            // Get enemy checker
            for (let checkerIndex in this.board.checkers) {
                if (this.board.checkers[checkerIndex].position[0] === checkTileY && this.board.checkers[checkerIndex].position[1] === checkTileX) {
                    if (this.player !== this.board.checkers[checkerIndex].player) {
                        // Return it
                        return this.board.checkers[checkerIndex];
                    }
                }
            }
        }

        return false;
    };

    /**
     * Attack an enemy checker
     * @param {Tile} tile Checker on this tile to remove
     * @returns {boolean} true if we attacked
     */
    Attack(tile) {
        let checkerToRemove = this.CanAttack(tile.position);

        // If there's a checker to remove then remove it
        if (checkerToRemove) {
            this.Remove(this.board.checkers[checkerToRemove.element.getAttribute('id')]);
            return true;
        }

        return false;
    };

    /**
     * To remvoe the checker from board
     * @param {Checker} checker Checker to remove
     */
    Remove(checker) {
        // Remove it from the board and from the game
        checker.element.parentElement.removeChild(checker.element.parentElement.childNodes.item(1));
        this.board.board[checker.position[0]][checker.position[1]] = 0;

        Logger.Log((this.player === 1 ? '1st' : '2nd') + ' player: ' + DrawManger.GetTileName(this.position[0], this.position[1]) + ' attacked ' +
            DrawManger.GetTileName(checker.position[0], checker.position[1]));

        // Reset position of this checker
        checker.position = [];
    };
};