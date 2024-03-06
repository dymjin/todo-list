import styles from './style.css';
import { format } from "date-fns";

function clearDOM(mode) {
    const todoContainer = document.querySelector('.todo-container');
    if (mode === "todo" && todoContainer) {
        todoContainer.parentNode.removeChild(todoContainer);
    }
}

function clearTabDOM(mode) {
    const projectTabsContainer = document.querySelector('.project-tabs-container');
    const inbox = document.querySelector('.inbox');
    if (mode === 'project') {
        while (projectTabsContainer.firstChild) {
            projectTabsContainer.removeChild(projectTabsContainer.firstChild);
        }
    }
    if (mode === 'todo') {
        while (inbox.firstChild) {
            inbox.removeChild(inbox.firstChild);
        }
    }
}

function addElement(name = '', text = '', parent, type = 'div') {
    const elem = document.createElement(type);
    elem.className = name;
    elem.textContent = text;
    parent.appendChild(elem);
    return elem;
}

function addInput(name = '', text = '', parent, type = 'text', placeholder = '') {
    const input = addElement(name, '', parent, 'input');
    input.type = type;
    input.placeholder = placeholder;
    input.value = text;
    return input;
}

function addSelect(name = '', parent, defaultOptionText) {
    const select = addElement(name, '', parent, 'select');
    const defaultOption = addElement('option', defaultOptionText, select, 'option');
    defaultOption.disabled = true;
    defaultOption.hidden = true;
    defaultOption.value = '';
    return select;
}

function addPrioritySelect(parent, priority = '') {
    const select = addSelect('todo-select', parent, 'Set priority');
    addElement('option', 'Low', select, 'option');
    addElement('option', 'Medium', select, 'option');
    addElement('option', 'High', select, 'option');
    if (priority) {
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

function addCheckbox(parent, checkbox) {
    const label = addElement('checkbox-item-container', '', parent, 'label');
    const checkboxTick = addInput('checkbox-tick', '', label, 'checkbox');
    const checkboxTitle = addInput('checkbox-title', '', label, '', 'Item name');
    if (checkbox) {
        checkboxTick.checked = checkbox.state;
        checkboxTitle.value = checkbox.title;
    }
    return label;
}

function addTab(name, text, parent, placeholder) {
    const tabContainer = addElement(`${name}-tab`, '', parent);
    const tabTitleContainer = addElement(`${name}-tab-title-container`, '', tabContainer);
    const tabTitleWrapper = addElement(`${name}-tab-title-wrapper`, '', tabTitleContainer);
    const tabTitle = addInput(`${name}-tab-title`, text, tabTitleContainer, '', placeholder);
    tabTitle.disabled = true;
    const editTab = addElement(`${name}-tab-edit`, 'edit', tabContainer, 'button')
    const removeTab = addElement(`${name}-tab-remove`, 'remove', tabContainer, 'button');
    return tabContainer;
}

function addProjectTab(text = 'My project', projectID = 1) {
    const projectTab = addTab('project', text, document.querySelector('.project-tabs-container'), 'My project');
    projectTab.setAttribute('data', projectID);
    projectTab.id = `todo-dest-${projectID}`;
    return projectTab;
}

function addTodoTab(text = 'My todo', parent = document.querySelector('.inbox'), dueDate = format(new Date(), "dd-MM-yyyy"), priority = '', projectID = 1, todoID = 1) {
    // const todoTabsContainer = addElement('todo-tabs-container', '', parent);
    const todoTab = addTab('todo', text, document.querySelector('.inbox'), 'My todo');
    todoTab.setAttribute('data', `${projectID}-${todoID}`)
    const todoTabDueDate = addElement('todo-tab-duedate', dueDate, todoTab);
    todoTab.draggable = true;
    todoTab.id = 'todo-src';
    const editTab = todoTab.childNodes[1];
    todoTab.insertBefore(todoTabDueDate, editTab)
    switch (priority.toLowerCase()) {
        case 'low':
            todoTab.style.backgroundColor = '#85ffc8';
            break;
        case 'medium':
            todoTab.style.backgroundColor = '#fcbf5d';
            break;
        case 'high':
            todoTab.style.backgroundColor = '#fc5151';
            break;
    }
    return todoTab;
}

function addTodoInputs(title = '', desc = '', dueDate = format(new Date(), 'yyyy-MM-dd'), priority = '', notes = '') {
    clearDOM('todo');
    const todoContainer = addElement('todo-container', '', document.querySelector('.inbox'));
    const todoTitle = addInput('todo-title', title, todoContainer, '', 'Title');
    const todoDesc = addInput('todo-desc', desc, todoContainer, '', 'Description');
    const todoDueDate = addInput('todo-due-date', dueDate, todoContainer, 'date');
    todoDueDate.min = '2024-01-01';
    todoDueDate.max = '2024-12-31';
    const todoSelect = addPrioritySelect(todoContainer, priority);
    const todoNotes = addElement('todo-notes', notes, todoContainer, 'textarea');
    todoNotes.placeholder = 'Add note';
    const addCheckboxBtn = addElement('add-checkbox', 'add checkbox', todoContainer, 'button');
    addElement('checkbox-container', '', todoContainer);
    return todoContainer;
}

export { addTodoInputs, addCheckbox, addTodoTab, addProjectTab, clearTabDOM };
