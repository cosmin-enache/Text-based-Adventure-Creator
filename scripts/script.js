/* eslint-disable no-undef */
const mainStoryCard = new StoryCard(STORY_1_TEXT);
mainStoryCard.setChoice("MAIN CARD");

/* Render BFS */
function renderStoryBoard() {
    /* Render main story card */
    postStoryCard(mainStoryCard);
}

function postStoryCard(storyCard) {
    if (mainStoryCard.getSuperClassName() !== "Card") throw new Error("Must pass a 'Card' object!");

    const cardWrapper = createElementAndAppendTo("div", STORY_BOARD, { classes: [CLASS_CARD_WRAPPER] });

    /* 2 way binding */
    storyCard.setDOMElement(cardWrapper);
    cardWrapper.$data = storyCard;

    buildCardHeader(cardWrapper);

    buildCardStory(cardWrapper);

    buildCardInteractable(cardWrapper);

    return cardWrapper;
}

function buildCardHeader(cardWrapper) {
    const cardHeader = createElementAndAppendTo("div", cardWrapper, { classes: ["card-header"] });

    buildCardPin(cardWrapper, cardHeader);
    buildChoiceTag(cardWrapper, cardHeader);
}

function buildChoiceTag(cardWrapper, cardHeader) {
    const cardData = cardWrapper.$data;

    createElementAndAppendTo("span", cardHeader, { classes: ["card-choice-tag"], textContent: cardData.getChoice() });
}

function buildCardPin(cardWrapper, cardHeader) {
    const pinElement = createElementAndAppendTo("div", cardHeader, { classes: [CLASS_CARD_PIN] });

    let isDragging = false;

    pinElement.addEventListener("mousedown", () => isDragging = true);
    pinElement.addEventListener("mouseup", () => isDragging = false);

    document.addEventListener("mousemove", event => {
        if (!isDragging) return;

        cardWrapper.style.left = event.pageX - (pinElement.getBoundingClientRect().width / 2) + "px";
        cardWrapper.style.top = event.pageY - (pinElement.getBoundingClientRect().height / 2) + "px";

        const currentCardNode = cardWrapper.$data;
        const parentNode = currentCardNode.getParentNode();
        const childNodes = currentCardNode.getChildNodes();

        childNodes.forEach(childNode => {
            CardLines.updateChildLines(currentCardNode, childNode);
        });

        if (parentNode) CardLines.updateParentLines(currentCardNode);
    });
}

function buildCardStory(cardWrapper) {
    const cardData = cardWrapper.$data;
    const cardStory = createElementAndAppendTo("textarea", cardWrapper, { classes: [CLASS_CARD_STORY], value: cardData.getStoryText() });

    cardStory.addEventListener("change", e => cardData.setStoryText(e.target.value));
}

function buildCardInteractable(cardWrapper) {
    const cardData = cardWrapper.$data;

    const cardInteractable = createElementAndAppendTo("div", cardWrapper, { classes: [CLASS_CARD_INTERACTABLE] });
    const newStoryCardButton = createElementAndAppendTo("button", cardInteractable, { classes: [CLASS_NEW_CARD_BUTTON] });

    newStoryCardButton.addEventListener("click", () => {
        const newStoryCard = new StoryCard("New story");
        const choiceName = prompt("What is the choice you want to include for this story?");

        if (choiceName.length === 0) return;

        cardData.addToChoiceCardMap(choiceName, newStoryCard);

        const newStoryCardWrapper = postStoryCard(newStoryCard);
        const newLine = Line.createLine(cardWrapper.$data, newStoryCardWrapper.$data);

        CardLines.trackLine(newLine);
    });
}

function createElementAndAppendTo(tag, parent, options = {}) {
    const element = document.createElement(tag);

    const { classes, ...otherAttributes } = options;

    if (classes) {
        if (classes.constructor.name !== "Array") throw new Error("Option 'class' must be an array!");

        for (const classStr of classes) {
            element.classList.add(classStr);
        }
    }

    for (const key in otherAttributes) {
        const value = otherAttributes[key];
        element[key] = value;
    }

    parent.appendChild(element);

    return element;
}

EXPORT_BUTTON.addEventListener("click", function () {
    EXPORT_OUTPUT.value = Card.serialize(mainStoryCard);
});

function renderStoryPlay(storyData) {
    STORY_TEXT.textContent = storyData.storyText;

    CHOICES_LIST.innerHTML = "";

    for (const choice in storyData.choices) {
        createElementAndAppendTo("li", CHOICES_LIST, { textContent: choice });
    }
}

IMPORT_AREA.addEventListener("change", function (e) {
    // Begin story *Move to separate function later*

    STORY_BOARD.style.display = "none";

    const { value: stringStoryData } = e.target;

    const storyData = Card.deserialize(stringStoryData);
    let current = storyData;

    renderStoryPlay(current);

    document.addEventListener("keyup", e => {
        const key = e.key;

        if (key < '1' || key > '9') return;

        if (parseInt(key) > Object.values(current.choices).length) {
            alert("Number is out of bounds!");
            return;
        }

        const userChoice = Object.keys(current.choices)[parseInt(key) - 1];

        current = current.choices[userChoice];

        renderStoryPlay(current);
    });
});

renderStoryBoard();