import styles from './style.css';
import { format } from "date-fns";

function clearProjectDOM() {
    const pageContainer = document.querySelector('.page-container');
    pageContainer.removeChild(document.querySelector('.project-container'));
}

function clearProjectTabDOM() {
    const projectListContainer = document.querySelector('.projectlist-container');
    while (projectListContainer.firstChild) {
        projectListContainer.removeChild(projectListContainer.firstChild)
    }
}

function clearTodoDOM() {
    const projectContainer = document.querySelector('.project-container');
    projectContainer.removeChild(document.querySelector('.todo-container'));
}

function addElement(name, text, parent, type) {
    type = type || 'div';
    const elem = document.createElement(type);
    name ? elem.className = name : name = '';
    text ? elem.textContent = text : text = '';
    parent.appendChild(elem);
    return elem;
}

function addInput(name, text, parent, placeholder, type) {
    type = type || 'text';
    const input = document.createElement('input');
    input.setAttribute('type', type);
    placeholder ? input.setAttribute('placeholder', placeholder) : placeholder = '';
    text ? input.value = text : text = '';
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
    if (priority !== '') {
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

function addChecklist(parent, checkbox) {
    if (!checkbox) {
        const label = addElement('', '', parent, 'label');
        addInput('checklist-item', '', label, '', 'checkbox');
        addInput('checklist-item-name', '', label, 'item name');
        return label;
    } else {
        const label = addElement('checklist-item-container', '', parent, 'label');
        const checkboxInput = addInput('checklist-item', '', label, '', 'checkbox');
        checkboxInput.checked = checkbox.state;
        addInput('checklist-item-title', checkbox.title, label, 'item name');
        return label;
    }
}

function addProjectTabs(text, id) {
    const projectTab = addElement('project', '', document.querySelector('.projectlist-container'));
    const projectTabTitle = addInput('project-tab-title', text, projectTab, 'My project')
    const removeProjectTab = addElement('remove-project-tab', 'remove', projectTab, 'button');
    const elements = [projectTab, projectTabTitle, removeProjectTab];
    elements.forEach(elem => {
        elem.setAttribute('data', id);
    })
    return elements;
}

function addTodoCards(text, dueDate, todoID, priority = 'Low', projectID) {
    text = text || 'My todo';
    priority ? 0 : priority = 'Low';
    dueDate = dueDate || format(new Date(), "dd-MM-yyyy")
    let currentProject = JSON.parse(localStorage.getItem('current_project'));
    const todoCard = addElement('todo', '', document.querySelector(`.project[data="${currentProject.id}"]`));
    switch (priority) {
        case 'Low':
            todoCard.style.backgroundColor = '#85ffc8';
            break;
        case 'Medium':
            todoCard.style.backgroundColor = '#fcbf5d';
            break;
        case 'High':
            todoCard.style.backgroundColor = '#fc5151';
            break;
    }
    const todoTabTitle = addElement('todo-card-title', text, todoCard);
    const todoDueDate = addElement('todo-card-duedate', dueDate, todoCard);
    const removeTodoTab = addElement('remove-todo-card', 'remove', todoCard, 'button');
    const elements = [todoCard, todoTabTitle, removeTodoTab, todoDueDate];

    elements.forEach(elem => {
        elem.setAttribute('data', `${projectID}-${todoID}`);
    })
    return elements;
}

function addTodoDOM(title, desc, dueDate, priority, notes, checkboxArr) {
    notes = notes || '';
    const todoContainer = addElement('todo-container', '', document.querySelector('.project-container'));
    const todoTitle = addInput('todo-title', title, todoContainer, 'Title');
    const todoDesc = addInput('todo-desc', desc, todoContainer, 'Description');
    const todoDueDate = addInput('due-date', dueDate, todoContainer, '', 'date');
    const todoSelect = addSelect('todo-select', todoContainer, priority);
    const todoNotes = addElement('todo-notes', notes, todoContainer, 'textarea');
    todoNotes.setAttribute('placeholder', 'Add note')
    const addChecklistBtn = addElement('add-checklist', 'add checklist', todoContainer, 'button');
    addElement('checklist-container', '', todoContainer);
    return [todoTitle, todoDesc, todoDueDate, todoSelect, todoNotes, addChecklistBtn]
}

function addProjectDOM() {
    addElement('project-container', '', document.querySelector('.page-container'));
}

export { addProjectDOM, addTodoDOM, clearProjectDOM, clearTodoDOM, addChecklist, clearProjectTabDOM, addProjectTabs, addTodoCards };