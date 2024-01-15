const init = (() => {
    let i = 1;
    const add = () => { i++; };
    const get = () => { return i };
    return { add, get };
})();

const addProject = document.createElement('button');
addProject.className = 'add-project';

function addElement(name, type, parent = document.body) {
    const container = document.createElement(type);
    container.className = name;
    container.setAttribute('data', init.get());
    let r = Math.round(Math.random() * 255);
    container.style.backgroundColor = `rgb(${r}, ${r}, ${r})`;
    parent.appendChild(container);
}

function addInput(parent, placeholder) {
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', placeholder);
    parent.appendChild(input);
}

function addTodoDOM() {
    addElement('todo-container', 'div', document.querySelector(`.project-container`));
    addInput(document.querySelector(`.todo-container[data="${init.get()}"]`), 'title');
    addInput(document.querySelector(`.todo-container[data="${init.get()}"]`), 'desc');
    init.add();
}

function addProjectDOM() {
    addElement('project-container', 'div', document.querySelector('.page-container'));
    addTodoDOM();
}

export { addProjectDOM, addTodoDOM };