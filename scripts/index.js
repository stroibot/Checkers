// This is a main file that enables new instance of Game Manager and starts the game

// The only one global variable that we NEED
let gameManager;

// When window is loaded
window.onload = () => {
    // Create new GameManager
    gameManager = new GameManager();
    // Initialize the game
    gameManager.Initialize();
};