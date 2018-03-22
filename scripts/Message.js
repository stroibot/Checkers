// This class used to show messages instead of using alert
class Message {
    /**
     * @param {object} message Message ot diplay
     * @param {string} [header] Header to display, optional
     */
    constructor(message, header) {
        this.message = message;
        this.header = header;
    };

    /**
     * Shows the message box
    */
    Show() {
        let outerMessageBox = document.createElement('div');
        outerMessageBox.setAttribute('id', 'outerMessageBox');

        let button = document.createElement('button');
        button.classList.add('okbutton');
        button.innerHTML = 'Ok';

        let message = document.createElement('p');
        message.innerHTML = this.message;

        let messageBox = document.createElement('div');
        messageBox.setAttribute('id', 'messagebox');
        messageBox.appendChild(message);
        messageBox.appendChild(button);

        button.addEventListener('click', () => OkButton(outerMessageBox));

        outerMessageBox.appendChild(messageBox);
        document.body.appendChild(outerMessageBox);
    };

    /**
     * Shows the message box with header without blinking
    */
    ShowWithHeader() {
        let outerMessageBox = document.createElement('div');
        outerMessageBox.setAttribute('id', 'outerMessageBox');

        let header = document.createElement('h1');
        header.innerHTML = this.header;

        let button = document.createElement('button');
        button.classList.add('okbutton');
        button.innerHTML = 'Ok';

        let messageBox = document.createElement('div');
        messageBox.setAttribute('id', 'messagebox');
        messageBox.classList.add('messageBoxWithHeader');
        messageBox.appendChild(header);
        messageBox.appendChild(this.message);
        messageBox.appendChild(button);

        button.addEventListener('click', () => OkButton(outerMessageBox));

        outerMessageBox.appendChild(messageBox);
        document.body.appendChild(outerMessageBox);
    };
};