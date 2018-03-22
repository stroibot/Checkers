// Tile class
class Tile {
    /**
     * @param {object} element Linked DOM lement
     * @param {array} position Position on board
     */
    constructor(element, position) {
        this.element = element;
        this.position = position;
    };

    /**
     * To check if the tile is in the range of checker
     * @param {Checker} checker Checker to check
     * @returns {number} 1 if we can do jump, 2 if just regular move, otherwise 0
     */
    InRange(checker) {
        if (checker.position.length === 0) {
            return 0;
        }

        let distance = Board.Distance(this.position[0], this.position[1], checker.position[0], checker.position[1]);

        if (distance === Math.sqrt(2)) {
            return 1;
        } else if (distance === Math.sqrt(2) * 2) {
            return 2;
        }
        
        return 0;
    };
};