// Class that controls the game itself, it's responsible for whole game process
class GameManager {
    /**
     * @param {number} player Player's checkers, default value is 2
     * @param {number} AIplayer Which one (black or white) checkers the AI will be playing, default value is 1
     */
    constructor(player = 2, AIplayer = 1) {
        // Game board
        this.gameBoard = new Board();
        // Draw manager
        this.drawManager = new DrawManger(this.gameBoard);
        this.playerTurn = 2;
        this.player = player;
        // AI
        this.AI = new AI(AIplayer);
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
            // Lets check if the player can move at all
            let possible = gameManager.gameBoard.GetPossibleMoves(gameManager.gameBoard.GetAllEmptyTiles(),
                gameManager.gameBoard.checkers.filter(checker => checker.player === gameManager.player));

            if (possible[1].length === 0 || possible[0].length === 0) {
                // If not then he loses
                gameManager.EndTheGame(1);
                return;
            }

            let tileId = this.getAttribute('id').replace('tile', '');
            let tile = gameManager.gameBoard.tiles[tileId];
            let checker = gameManager.gameBoard.checkers[checkers.item(0).getAttribute('id')];

            // Is this in range?
            let inRange = tile.InRange(checker);

            if (inRange) {
                gameManager.drawManager.RemoveMovedTilesHighlight();

                // To check if we can do more than one jump
                if (inRange === 2) {
                    if (checker.Attack(tile)) {
                        checker.Move(tile);

                        if (checker.CanMove()) {
                            checker.element.classList.add('selected');
                        } else {
                            setTimeout(() => {
                                gameManager.AI.TryToMove();
                            }, 1000);

                            gameManager.ChangePlayerTurn();
                        }
                    }
                    // Otherwise just move
                } else if (inRange === 1) {
                    if (!checker.CanMove()) {
                        if (checker.Move(tile)) {
                            setTimeout(() => {
                                gameManager.AI.TryToMove();
                            }, 1000);

                            gameManager.ChangePlayerTurn();
                        }
                    }
                }
            }
        }
    };

    /**
     * Ends the game, logs and displays the winner
     * @param {number} player Player who won 
     */
    EndTheGame(player) {
        let messageText = 'Player ' + player + ' wins!';

        Logger.Log(messageText);

        let message = document.createElement('p');

        if (player === 1) {
            message.innerHTML = messageText;
        } else {
            message.innerHTML = 'Congratulations';
        }

        new Message(message, player === 1 ? 'You lose!' : 'You win!').ShowWithHeader();

        // Stop the game
        this.Stop();
    }

    /**
     * Checks victory for both players and displays it if someone won
     */
    CheckVictory() {
        if (this.CheckIfAnyLeft(1)) {
            this.EndTheGame(2);
        } else if (this.CheckIfAnyLeft(2)) {
            this.EndTheGame(1);
        }
    };

    /**
     * Checks if the player has any checkers left
     * @param {number} player Player to check
     * @returns {boolean} ture if the player lost
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