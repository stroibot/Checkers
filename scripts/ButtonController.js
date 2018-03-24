/**
 * Removes message box
 * @param {Node} messageBox DOM Node object of Message
 */
function OkButton(messageBox) {
    document.body.removeChild(messageBox);
};

/**
 * Reloads the window to play again
*/
function Play() {
    window.location.reload();
};

/**
 * To show message with rules
*/
function Rules() {
    let rules = ['Unlimeted time',
        'You must attack if it\'s possible',
        'All checkers are played on black tiles',
        'Men can only go forward',
        'After reaching the end of the board man becomes a king',
        'King can go any direction',
        'Player wins when there\'s no enemy checkers left or if the enemy can\'t move'];
    let message = document.createElement('ul');

    rules.map((rule) => {
        let ruleElement = document.createElement('li');
        ruleElement.innerHTML = rule;
        message.appendChild(ruleElement);
    });

    new Message(message, 'Rules').ShowWithHeader();
};