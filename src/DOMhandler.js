import styles from './style.css';
import { format } from "date-fns";

function clearDOM(mode) {
    const projectContainer = document.querySelector('.project-container');
    const todoContainer = document.querySelector('.todo-container');
    if (projectContainer && todoContainer) {
        if (mode === "project") {
            document.querySelector('.page-container')
                .removeChild(projectContainer);
        }
        if (mode === "todo") {
            projectContainer.removeChild(todoContainer);
        }
    }
}

function clearTabDOM(tab) {
    const projectListContainer = document.querySelector('.projectlist-container');
    let currentProject = JSON.parse(localStorage.getItem('current_project'));
    if (tab === 'project') {
        while (projectListContainer.firstChild) {
            projectListContainer.removeChild(projectListContainer.firstChild);
        }
    }
    if (tab === 'todo') {
        let currentTodo = JSON.parse(localStorage.getItem('current_todo'));
        const todos = document.querySelectorAll('.todo');
        todos.forEach(todo => {
            if (document.querySelector('.todo').parentNode) {
                document.querySelector('.todo').parentNode.removeChild(document.querySelector('.todo'))
            }
        })
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

function addSelect(name = '', parent, priority = '') {
    const select = addElement(name, '', parent, 'select');
    const defaultOption = addElement('option', 'Set priority', select, 'option');
    defaultOption.disabled = true;
    defaultOption.hidden = true;
    defaultOption.value = '';
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

function addTab(name, text, parent, projectID, todoID, placeholder) {
    const tabContainer = addElement(name, '', parent);
    const tabtTitleWrapper = addElement(`${name}-tab-title-wrapper`, '', tabContainer);
    const tabtTitle = addInput(`${name}-tab-title`, text, tabtTitleWrapper, '', placeholder);
    tabtTitle.disabled = true;
    const wrapper = addElement(`${name}-input-wrapper`, '', tabtTitleWrapper);
    const editTab = addElement(`${name}-edit-tab`, 'edit', tabContainer, 'button')
    const removeTab = addElement(`${name}-remove-tab`, 'remove', tabContainer, 'button');
    const elements = [tabContainer, tabtTitle, editTab, removeTab, wrapper];
    elements.forEach(elem => {
        if (todoID) { elem.setAttribute('data', `${projectID}-${todoID}`); }
        else { elem.setAttribute('data', projectID); }
    });
    return elements;
}

function addProjectTab(text = 'My project', parent, projectID) {
    const projectTab = addTab('project', text, parent, projectID, '', 'My project');
    const tabContainer = projectTab[0];
    const todoContainer = addElement('todo-tab-wrapper', '', tabContainer);
    todoContainer.setAttribute('data', projectID);
    return projectTab;
}

function addTodoTab(text = 'My todo', dueDate = format(new Date(), "dd-MM-yyyy"), priority = 'Low', projectID, todoID) {
    const todoTab = addTab('todo', text, document.querySelector(`.todo-tab-wrapper[data="${projectID}"]`), projectID, todoID, 'My todo');
    const todoTabDueDate = addElement('todo-tab-duedate', dueDate, todoTab[0]);
    todoTabDueDate.setAttribute('data', `${projectID}-${todoID}`)
    todoTab[0].insertBefore(todoTabDueDate, todoTab[2])
    switch (priority) {
        case 'Low':
            todoTab[0].style.backgroundColor = '#85ffc8';
            break;
        case 'Medium':
            todoTab[0].style.backgroundColor = '#fcbf5d';
            break;
        case 'High':
            todoTab[0].style.backgroundColor = '#fc5151';
            break;
    }
    return todoTab;
}

function addTodoDOM(title = '', desc = '', dueDate = format(new Date(), 'yyyy-MM-dd'), priority = '', notes = '') {
    clearDOM('todo');
    const todoContainer = addElement('todo-container', '', document.querySelector('.project-container'));
    const todoTitle = addInput('todo-title', title, todoContainer, '', 'Title');
    const todoDesc = addInput('todo-desc', desc, todoContainer, '', 'Description');
    const todoDueDate = addInput('due-date', dueDate, todoContainer, 'date');
    todoDueDate.min = `${new Date().getFullYear()}-01-01`;
    todoDueDate.max = `${new Date().getFullYear()}-12-31`;
    const todoSelect = addSelect('todo-select', todoContainer, priority);
    const todoNotes = addElement('todo-notes', notes, todoContainer, 'textarea');
    todoNotes.placeholder = 'Add note';
    const addCheckboxBtn = addElement('add-checkbox', 'add checkbox', todoContainer, 'button');
    addElement('checkbox-container', '', todoContainer);
    return [todoTitle, todoDesc, todoDueDate, todoSelect, todoNotes, addCheckboxBtn];
}

function addProjectDOM(text, id = 1) {
    clearDOM('project');
    if (document.querySelector('.project-container')) {
        document.querySelector('.page-container')
            .removeChild(document.querySelector('.project-container'))
    };
    addElement('project-container', '', document.querySelector('.page-container'));
    // console.log(id)
    const projectTab = addProjectTab('project', document.querySelector('.projectlist-container'), id);
    return projectTab;
}

export { addProjectDOM, addTodoDOM, clearDOM, clearTabDOM, addCheckbox, addTab, addTodoTab };
