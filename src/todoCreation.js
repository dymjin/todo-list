import * as DOMhandler from './DOMhandler.js';

function addTodo(title, desc, dueDate, priority, notes, checklist = false) {
    priority = priority || 'low';
    notes = notes || '';
    return { title, desc, dueDate, priority, notes, checklist };
}

function addProject(projectTitle, todoTitle, desc) {
    DOMhandler.addProjectDOM(projectTitle);
    addTodo(todoTitle, desc);
}

export { addTodo, addProject };