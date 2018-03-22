// Class used for logging
class Logger {
    /**
     * Adds message to the log
     * @param {string} message Message to log
     */
    static Log(message) {
        let logMessage = document.createElement('p');
        logMessage.innerHTML = message;

        let log = document.getElementById('log');
        log.appendChild(logMessage);

        log.scrollTop = log.scrollHeight;
    };
};