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

// This one is used to show Message Box instead of 'alert'
window.addEventListener('click', function (e) {
    // Get message box so we could remove it on button click
    let messagebox = document.getElementById('outerMessageBox');

    if (messagebox) {
        if (messagebox.firstChild.classList.contains('messageBoxWithHeader')) {
            return;
        }

        if (!messagebox.contains(e.target)) {
            // Make it blink if we click outside the message box
            messagebox.firstChild.classList.add('blink');

            this.setTimeout(() => {
                messagebox.firstChild.classList.remove('blink');
            }, 500);
        }
    }
});