const getElById = (id) => document.getElementById(id);

const createEl = (tagName) => document.createElement(tagName);

const getRandomInt = (max) => Math.round(Math.random() * max);

export { createEl, getElById, getRandomInt };
