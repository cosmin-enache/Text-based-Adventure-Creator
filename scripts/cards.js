/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
class Card {
    #storyText = "";
    #parentNode = null;
    #domElement = null;
    #choice = "";
    #id;

    static #ID = 0;

    static serialize(card) {
        let JSON = "{";

        JSON += card.toJSON();

        return JSON + "}";
    }

    static deserialize(JSONString) {
        return JSON.parse(JSONString);
    }

    constructor(storyText) {
        if (typeof storyText !== "string") {
            throw new Error("'storyText' must always be a string value!");
        }

        this.#storyText = storyText;
        this.#id = ++Card.#ID;
    }

    toJSON() {
        return `"storyText":"${this.#storyText.replaceAll(/\n/g, "\\n")}",`;
    }

    /* Getters */
    getStoryText() { return this.#storyText; }
    getSuperClassName() { return getSuperClassName(this); }
    getClassName() { return this.constructor.name; }
    getParentNode() { return this.#parentNode; }
    getDOMElement() { return this.#domElement; }
    getId() { return this.#id; }
    getChoice() { return this.#choice; }

    /* Setters */
    setStoryText(storyText) {
        if (typeof storyText !== "string") {
            throw new Error("'storyText' must always be a string value!");
        }

        this.#storyText = storyText;
    }
    setDOMElement(element) {
        if (getSuperClassName(element) !== "HTMLElement") {
            throw new Error("'element' must always be a HTMLElement!");
        }

        this.#domElement = element;
    }
    setParentNode(parentNode) {
        this.#parentNode = parentNode;
    }
    setChoice(choice) {
        if (typeof choice !== "string") {
            throw new Error("'choice' must always be a string value!");
        }

        this.#choice = choice;
    }
}

class StoryCard extends Card {
    #choiceToCardMap = new Map();

    constructor(storyText) {
        super(storyText);
    }

    toJSON() {
        let choiceContent = [];

        for (const [choice, card] of this.#choiceToCardMap) {
            choiceContent.push(`"${choice}":{${card.toJSON()}}`);
        }

        return super.toJSON() + `"choices":{${choiceContent.join(",")}}`
    }

    addToChoiceCardMap(choice, card) {
        if (typeof choice !== "string") {
            throw new Error("'choice' must always be a string value!");
        }

        if (this.getSuperClassName(card) !== this.getSuperClassName(this)) {
            throw new Error("'card' must always be a " + this.constructor.name + " value!");
        }

        if (this.#choiceToCardMap.has(choice)) {
            throw new Error("Choice '" + choice + "' already exists for story:\n" + this.getStoryText());
        }

        this.#choiceToCardMap.set(choice, card);

        card.setChoice(choice);
        card.setParentNode(this);
    }

    getChoiceCardMap() { return this.#choiceToCardMap; }
    getChildNodes() {
        const nodes = [];
        const values = this.#choiceToCardMap.values();

        for (const value of values) {
            nodes.push(value);
        }

        return nodes;
    }
}