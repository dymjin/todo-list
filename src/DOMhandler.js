const init = (() => {
    let i = 1;
    const add = () => { i++; };
    const get = () => { return i };
    return { add, get };
})();

function addElement(name, text, parent, type, data = false) {
    type = type || 'div';
    const elem = document.createElement(type);
    name ? elem.className = name : name = '';
    text ? elem.textContent = text : text = '';
    data ? elem.setAttribute('data', init.get()) : data = '';
    parent.appendChild(elem);
    return elem;
}

function addInput(name, text, parent, placeholder, disabled, type) {
    const input = document.createElement('input');
    type = type || 'text';
    input.setAttribute('type', type);
    placeholder ? input.setAttribute('placeholder', placeholder) : placeholder = '';
    text ? input.value = text : text = '';
    input.className = name;
    disabled ? input.disabled = true : disabled = false;
    parent.appendChild(input);
    return input;
}

function addTodoDOM(title, desc) {
    title = title || '';
    desc = desc || '';
    addElement('todo-container', '', document.querySelector('.project-container'), '', true);
    addInput('todo-title', title, document.querySelector(`.todo-container[data="${init.get()}"]`), '', true);
    addInput('todo-desc', desc, document.querySelector(`.todo-container[data="${init.get()}"]`), '', true);
    init.add();
}

function addModal() {
    const dialogContainer = addElement('dialog-container', '', document.querySelector('.project-container'), '', false);
    const todoDialog = addElement('todo-dialog', '', dialogContainer, 'dialog', false);
    const dialogForm = addElement('dialog-form', '', todoDialog, 'form', false);
    addInput('todo-input-title', '', dialogForm, '', false);
    addInput('todo-input-desc', '', dialogForm, '', false);
    addInput('due-date', '', dialogForm, '', false, 'date');
    const select = addElement('priority-select', '', dialogForm, 'select', false);
    addElement('', 'Low', select, 'option', false);
    addElement('', 'Medium', select, 'option', false);
    addElement('', 'High', select, 'option', false);
    addElement('todo-confirm', '+', dialogForm, 'button', false);
}

function addProjectDOM(title) {
    title = title || '';
    addElement('project-container', '', document.querySelector('.page-container'), '', false);
    addModal();
    addInput('project-title', title, document.querySelector('.project-container'), 'Title', false);
    addElement('add-todo', '+', document.querySelector('.page-container'), 'button', false);
}

export { addProjectDOM, addTodoDOM };