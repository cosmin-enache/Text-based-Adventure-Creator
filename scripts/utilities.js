/* eslint-disable no-unused-vars */
"use strict";

function querySelectorOrThrow(tag) {
    const element = document.querySelector(tag);

    if (!element) throw new Error("Element " + tag + " not rendering!");

    return element;
}

function getSuperClassName(obj) {
    return Object.getPrototypeOf(obj.constructor).name;
}

function getClassName(obj) {
    return obj.constructor.name;
}
