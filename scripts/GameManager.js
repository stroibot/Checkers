// Class that controls the game itself, it's responsible for whole game process
class GameManager {
    constructor() {
        // Game board
        this.gameBoard = new Board();
        // Draw manager
        this.drawManager = new DrawManger(this.gameBoard);
        this.playerTurn = 2;
        // AI
        this.AI = new AI();
    };

    /**
     * Initializes by drawing the board and checkers
    */
    Initialize() {
        // Draw board
        this.drawManager.DrawBoard();
    };

    /**
     * Stops the game
    */
    Stop() {
        this.AI.Stop();
    }

    /**
     * Called by 'click' event on tile, performs move action and moves selected checker
    */
    Select() {
        // Get all checkers with 'selected' class
        let checkers = document.querySelectorAll('div.tile div.selected');

        // If there's none then return
        if (checkers.length === 0) {
            return;
        } else {
            let tileId = this.getAttribute('id').replace('tile', '');
            let tile = gameManager.gameBoard.tiles[tileId];
            let checker = gameManager.gameBoard.checkers[checkers.item(0).getAttribute('id')];

            // Is this in range?
            let inRange = tile.InRange(checker);

            if (inRange) {
                // To check if we can do more than one jump
                if (inRange === 2) {
                    if (checker.Attack(tile)) {
                        checker.Move(tile);

                        if (checker.CanMove()) {
                            checker.element.classList.add('selected');
                        } else {
                            gameManager.ChangePlayerTurn();
                            setTimeout(() => gameManager.AI.TryToMove(), 1000);      
                        }
                    }
                    // Otherwise just move
                } else if (inRange === 1) {
                    if (!checker.CanMove()) {
                        if (checker.Move(tile)) {
                            gameManager.ChangePlayerTurn();
                            setTimeout(() => gameManager.AI.TryToMove(), 1000);
                        }
                    } else {
                        new Message('You must attack when it possible!').Show();
                    }
                }
            }
        }
    };

    /**
     * Checks victory for both players and displays it
     */
    CheckVictory() {
        let winner;

        if (this.CheckIfAnyLeft(1)) {
            winner = 1;
        } else if (this.CheckIfAnyLeft(2)) {
            winner = 2;
        } else {
            return;
        }

        let messageText = 'Player ' + winner + ' wins!';

        Logger.Log(messageText);

        let message = document.createElement('p');
        message.innerHTML = messageText;
        new Message(message, 'Congratulations').ShowWithHeader();
        // Stop the game
        this.Stop();
    };

    /**
     * Checks victory for the specific player
     * @param {number} player Player to check
     * @returns {boolean} ture if player won
     */
    CheckIfAnyLeft(player) {
        let counter = 0;

        for (let i = 0; i < this.gameBoard.boardSize; i++) {
            if (!this.gameBoard.board[i].includes(player)) {
                counter++;
            }
        }

        if (counter === this.gameBoard.boardSize) {
            return true;
        } else {
            return false;
        }
    };

    /**
     * Changes turn between players
    */
    ChangePlayerTurn() {
        if (this.playerTurn === 1) {
            this.playerTurn = 2;
        } else {
            this.playerTurn = 1;
        }

        gameManager.CheckVictory();
    };
};