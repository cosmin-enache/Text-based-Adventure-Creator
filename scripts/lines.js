/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
class Line {
    // Parent card
    #startCard;
    // Child card
    #endCard;

    #domElement;

    static createLine(startCard, endCard) {
        return new Line(startCard, endCard);
    }

    constructor(startCard, endCard) {
        this.#startCard = startCard;
        this.#endCard = endCard;

        this.#domElement = this.#createLine();
    }

    #createLine() {
        const startElement = this.#startCard.getDOMElement();
        const endElement = this.#endCard.getDOMElement();

        let { x: a, y: b, width, height } = startElement.getBoundingClientRect();
        let { x, y } = endElement.getBoundingClientRect();

        // Calculate distance and angle between points
        var length = Math.sqrt((x - a) ** 2 + (y - b) ** 2);
        var angle = Math.atan2(y - b, x - a);

        // Create or get the line element
        const line = createElementAndAppendTo("div", STORY_BOARD, { classes: [CLASS_LINE_CONNECTOR] });

        // Set position and dimensions
        line.style.left = a + width / 2 + 'px';
        line.style.top = b + height / 2 + 'px';
        line.style.width = length + 'px';
        line.style.transform = 'rotate(' + angle + 'rad)';

        return line;
    }

    updateLine() {
        this.#domElement.remove();
        this.#domElement = this.#createLine();
    }

    /* Getters */
    getStartCardId() {
        return this.#startCard.getId();
    }
    getEndCardId() {
        return this.#endCard.getId();
    }
    getDOMElement() {
        return this.#domElement;
    }
}

// eslint-disable-next-line no-unused-vars
class CardLines {
    static #parentLineMap = new Map();
    static #childLineMap = new Map();

    static trackLine(line) {
        if (getClassName(line) !== "Line") {
            throw new Error("'line' must always be a Line object!");
        }

        const startCardId = line.getStartCardId();
        const endCardId = line.getEndCardId();

        if (!this.#parentLineMap.has(startCardId)) {
            const endCardIdMap = new Map();

            endCardIdMap.set(endCardId, line);

            this.#parentLineMap.set(startCardId, endCardIdMap);
        } else {
            const endCardIdMap = this.#parentLineMap.get(startCardId);

            if (!endCardIdMap.has(endCardId)) {
                endCardIdMap.set(endCardId, line);
            } else {
                throw new Error("Parent line map with startId: " + startCardId + " already has an endId: " + endCardId + " registered!");
            }
        }

        this.#childLineMap.set(endCardId, line);
    }

    static updateChildLines(parentCard, childCard) {
        const parentId = parentCard.getId();
        const childId = childCard.getId();

        if (!this.#parentLineMap.has(parentId)) {
            throw new Error("No line in parentLineMap with id: " + parentId + " found!");
        }

        const endCardIdMap = this.#parentLineMap.get(parentId);

        if (!endCardIdMap.has(childId)) {
            throw new Error("Parent line map with parentId: " + parentId + " has NO childId: " + childId + " registered!");
        }

        const lineToUpdate = endCardIdMap.get(childId);
        lineToUpdate.updateLine();
    }

    static updateParentLines(childCard) {
        const childId = childCard.getId();

        if (!this.#childLineMap.has(childId)) {
            throw new Error("No line in childLineMap with id: " + childId + " found!");
        }

        const lineToUpdate = this.#childLineMap.get(childId);
        lineToUpdate.updateLine();
    }
}