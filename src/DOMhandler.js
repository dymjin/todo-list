import styles from './style.css';

const init = (() => {
    let i = 1;
    const add = () => { i++; };
    const get = () => { return i };
    return { add, get };
})();

addElement('add-project', 'new project', document.querySelector('.page-container'), 'button');

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

function clearProjectDOM() {
    const pageContainer = document.querySelector('.page-container');
    pageContainer.removeChild(document.querySelector('.project-container'));
}

function clearTodoDOM() {
    const projectContainer = document.querySelector('.project-container');
    projectContainer.removeChild(document.querySelector('.todo-container'));
}

function addSelect(name, disabled = false, parent, priority) {
    priority = priority || '';
    const select = addElement(name, '', parent, 'select', true);
    select.disabled = disabled;
    const defaultOption = addElement('option', 'Set priority', select, 'option', true);
    defaultOption.setAttribute('disabled', true);
    defaultOption.setAttribute('hidden', true);
    defaultOption.setAttribute('value', '');
    addElement('option', 'Low', select, 'option', true);
    addElement('option', 'Medium', select, 'option', true);
    addElement('option', 'High', select, 'option', true);
    if (priority === '') {
    } else {
        //answer by Sébastien: https://stackoverflow.com/questions/19611557/how-to-set-default-value-for-html-select
        for (let options, index = 0; options = select.options[index]; index++) {
            if (options.value === priority) {
                select.selectedIndex = index;
                break;
            }
        }
    }
    return select;
}

function addChecklist(parent, checkboxArr, disabled = false) {
    if (!checkboxArr) {
        const label = addElement('', '', parent, 'label');
        addInput('checklist-item', '', label, '', disabled, 'checkbox');
        addInput('checklist-item-name', '', label, '', disabled);
        return label;
    } else {
        checkboxArr.forEach(item => {
            const label = addElement('checklist-item-container', '', parent, 'label');
            const checkbox = addInput('checklist-item', '', label, '', disabled, 'checkbox');
            checkbox.checked = item.state;
            addInput('checklist-item-title', item.title, label, '', disabled);
        });
    }
}

function addTodoDOM(title, desc, dueDate, priority, notes, checkboxArr) {
    notes = notes || 'lol';
    addElement('todo-container', '', document.querySelector('.project-container'), '', true);
    const todoContainer = document.querySelector(`.todo-container[data="${init.get()}"]`);
    addInput('todo-title', title, todoContainer, 'Title', false);
    addInput('todo-desc', desc, todoContainer, 'Description', false);
    addInput('due-date', dueDate, todoContainer, '', false, 'date');
    const select = addSelect('todo-select', false, todoContainer, priority);
    if (priority) {
        select.value = priority;
    }
    addElement('todo-notes', notes, todoContainer, 'div');
    addElement('add-checklist', 'add checklist', todoContainer, 'button');
    const checklistContainer = addElement('checklist-container', '', todoContainer, '', true);
    addChecklist(checklistContainer, checkboxArr);
    init.add();
}

function addProjectDOM(title) {
    title = title || '';
    const projectContainer = addElement('project-container', '', document.querySelector('.page-container'), '', false);
    addInput('project-title', title, document.querySelector('.project-container'), 'Project Title', false);
    addElement('add-todo', 'add todo', projectContainer, 'button', false);
}
addProjectDOM();

export { addProjectDOM, addTodoDOM, clearProjectDOM, clearTodoDOM, addChecklist, init };