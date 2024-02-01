import styles from './style.css';

const init = (() => {
    let i = 0;
    const add = () => { i++; };
    const get = () => { return i };
    const set = (newVal) => { i = newVal }
    return { add, get, set };
})();

addElement('add-project', 'new project',
    document.querySelector('.projectlist-container'),
    'button');

function clearProjectDOM() {
    const pageContainer = document.querySelector('.page-container');
    pageContainer.removeChild(document.querySelector('.project-container'));
}

function clearTodoDOM() {
    const projectContainer = document.querySelector('.project-container');
    projectContainer.removeChild(document.querySelector('.todo-container'));
}

function addElement(name, text, parent, type) {
    type = type || 'div';
    const elem = document.createElement(type);
    if (name) { elem.className = name }
    else { name = '' };
    if (text) { elem.textContent = text }
    else { text = '' };
    parent.appendChild(elem);
    return elem;
}

function addInput(name, text, parent, placeholder, type) {
    type = type || 'text';
    const input = document.createElement('input');
    input.setAttribute('type', type);
    if (placeholder) { input.setAttribute('placeholder', placeholder) }
    else { placeholder = '' };
    if (text) { input.value = text }
    else { text = '' };
    input.className = name;
    parent.appendChild(input);
    return input;
}

function addSelect(name, parent, priority) {
    priority = priority || '';
    const select = addElement(name, '', parent, 'select');
    const defaultOption = addElement('option', 'Set priority', select, 'option');
    defaultOption.setAttribute('disabled', true);
    defaultOption.setAttribute('hidden', true);
    defaultOption.setAttribute('value', '');
    addElement('option', 'Low', select, 'option');
    addElement('option', 'Medium', select, 'option');
    addElement('option', 'High', select, 'option');
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

function addChecklist(parent, checkboxArr) {
    if (!checkboxArr) {
        const label = addElement('', '', parent, 'label');
        addInput('checklist-item', '', label, '', 'checkbox');
        addInput('checklist-item-name', '', label, 'item name');
        return label;
    } else {
        checkboxArr.forEach(item => {
            const label = addElement('checklist-item-container', '', parent, 'label');
            const checkbox = addInput('checklist-item', '', label, '', 'checkbox');
            checkbox.checked = item.state;
            addInput('checklist-item-title', item.title, label, '');
        });
    }
}

function addTodoDOM(title, desc, dueDate, priority, notes, checkboxArr) {
    notes = notes || 'lol';
    const todoContainer = addElement('todo-container', '', document.querySelector('.project-container'));
    addInput('todo-title', title, todoContainer, 'Title');
    addInput('todo-desc', desc, todoContainer, 'Description');
    addInput('due-date', dueDate, todoContainer, '', 'date');
    const select = addSelect('todo-select', todoContainer, priority);
    if (priority) {
        select.value = priority;
    }
    addElement('todo-notes', notes, todoContainer);
    addElement('add-checklist', 'add checklist', todoContainer, 'button');
    const checklistContainer = addElement('checklist-container', '', todoContainer);
    if (checkboxArr) {
        addChecklist(checklistContainer, checkboxArr);
    }
}

function addProjectDOM(title) {
    title = title || '';
    const projectContainer = addElement('project-container', '', document.querySelector('.page-container'));
    const projectTitle = addInput('project-title', title, projectContainer, 'Project Title');
    addElement('add-todo', 'add todo', projectContainer, 'button', false);
    // const project = addElement('project', 'test', document.querySelector('.projectlist-container'));
    // return project;

}
// addProjectDOM();

export { addProjectDOM, addTodoDOM, clearProjectDOM, clearTodoDOM, addChecklist, addElement };