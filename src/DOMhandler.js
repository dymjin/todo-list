import styles from './style.css';

const init = (() => {
    let i = 1;
    const add = () => { i++; };
    const get = () => { return i };
    const addBtn = () => { addElement('add-project', 'new project', document.querySelector('.page-container'), 'button'); };
    return { add, get, addBtn };
})();

init.addBtn();

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

function clearProject() {
    const pageContainer = document.querySelector('.page-container');
    pageContainer.removeChild(document.querySelector('.project-container'));
    pageContainer.removeChild(document.querySelector('.add-todo'));
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
}

function addChecklist(parent, checklist, disabled = false) {
    if (!checklist) {
        const label = addElement('', '', parent, 'label', true);
        addInput('checklist-item', '', label, '', disabled, 'checkbox');
        addInput('checklist-item-name', '', label, '', disabled);
        return label;
    } else {
        const label = addElement('checklist-item-container', '', parent, 'label', true);
        const checkbox = addInput('checklist-item', '', label, '', disabled, 'checkbox');
        checkbox.checked = checklist.state;
        addInput('checklist-item-title', checklist.title, label, '', disabled);
        return label;
    }
}

function addTodoDOM(title, desc, dueDate, priority, notes, lists) {
    title = title || 'title';
    desc = desc || 'desc';
    notes = notes || 'notes';
    lists = lists || [];
    addElement('todo-container', '', document.querySelector('.project-container'), '', true);
    const todoContainer = document.querySelector(`.todo-container[data="${init.get()}"]`);
    addElement('todo-title', title, todoContainer, '', true);
    addElement('todo-desc', desc, todoContainer, '', true);
    addInput('due-date', dueDate, todoContainer, '', true, 'date');
    addSelect('todo-select', true, todoContainer, priority);
    addElement('todo-notes', notes, todoContainer, 'div', true);
    const todoChecklistContainer = addElement('todo-checklist-container', '', todoContainer, '', true);
    if (lists) {
        lists.forEach(item => {
            const label = addElement('checklist-item-container', '', todoChecklistContainer, 'label', true);
            const checkbox = addInput('checklist-item', '', label, '', true, 'checkbox');
            checkbox.checked = item.state;
            addInput('checklist-item-title', item.title, label, '', true);
        });
    }
    init.add();
}

function addModal() {
    const dialogContainer = addElement('dialog-container', '', document.querySelector('.project-container'), '', false);
    const todoDialog = addElement('todo-dialog', '', dialogContainer, 'dialog', false);
    const dialogForm = addElement('dialog-form', '', todoDialog, 'form', false);
    addInput('todo-input-title', '', dialogForm, '', false);
    addInput('todo-input-desc', '', dialogForm, '', false);
    addInput('due-date', '', dialogForm, '', false, 'date');
    addSelect('priority-select', false, dialogForm, '');
    addInput('notes-input', '', dialogForm, 'Add note', false, 'textarea');
    addElement('add-checkbox', 'add-checkbox', dialogForm, 'button');
    const checklistContainer = addElement('checklist-container', '', dialogForm, 'ul');
    checklistContainer.hidden = true;
    addElement('todo-confirm', '+', dialogForm, 'button', true);
}

function addProjectDOM(title) {
    title = title || '';
    const projectContainer = addElement('project-container', '', document.querySelector('.page-container'), '', false);
    addModal();
    addInput('project-title', title, document.querySelector('.project-container'), 'Project Title', false);
    addElement('add-todo', '+', projectContainer, 'button', false);
}
addProjectDOM();

export { addProjectDOM, addTodoDOM, clearProject, addChecklist };