const init = (() => {
    let i = 1;
    const add = () => { i++; };
    const get = () => { return i };
    return { add, get };
})();

function addElement(name, text, type, parent = document.body) {
    const elem = document.createElement(type);
    elem.className = name;
    elem.textContent = text;
    parent.appendChild(elem);
    return elem;
}

function addContainer(name, parent, type) {
    type = type || 'div';
    const container = addElement(name, '', type, parent);
    container.setAttribute('data', init.get());
    parent.appendChild(container);
    return container;
}

function addInput(parent, content, placeholder, disabled = false, name) {
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    placeholder ? input.setAttribute('placeholder', placeholder) : placeholder = '';
    input.value = content;
    input.className = name;
    if (disabled) input.disabled = true;
    parent.appendChild(input);
    return input;
}

function addTodoDOM(title, desc) {
    title = title || '';
    desc = desc || '';
    addContainer('todo-container', document.querySelector('.project-container'));
    addInput(document.querySelector(`.todo-container[data="${init.get()}"]`), title, '', true, 'todo-title');
    addInput(document.querySelector(`.todo-container[data="${init.get()}"]`), desc, '', true, 'todo-desc');
    init.add();
}

function addModal() {
    addElement('dialog-container', '', 'div', document.querySelector('.project-container'));
    addElement('todo-dialog', '', 'dialog', document.querySelector('.dialog-container'));
    addElement('dialog-form', '', 'form', document.querySelector('.todo-dialog'));
    addInput(document.querySelector('.dialog-form'), '', '', false, 'todo-input-title');
    addInput(document.querySelector('.dialog-form'), '', '', false, 'todo-input-desc');
    addElement('todo-confirm', '+', 'button', document.querySelector('.dialog-form'));
}

function addProjectDOM(title) {
    title = title || '';
    addElement('project-container', '', 'div', document.querySelector('.page-container'));
    addModal();
    addInput(document.querySelector('.project-container'), title, 'My project', false, '.project-title');
    addElement('add-todo', '+', 'button', document.querySelector('.page-container'));
}

export { addProjectDOM, addTodoDOM };