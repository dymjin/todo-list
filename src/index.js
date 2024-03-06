// import * as DOMhandler from './DOMhandler.js';
import * as todoCreation from './todoCreation.js';
import * as projectCreation from './projectCreation.js';


const storedProjectList = JSON.parse(localStorage.getItem('project_list'));
const inboxTodos = JSON.parse(localStorage.getItem('inbox_todos'));
if (storedProjectList || inboxTodos) {
    if (storedProjectList && inboxTodos) {
        projectCreation.setupExistingProjects(storedProjectList);
        todoCreation.setupExistingTodos(inboxTodos);
    } else if (storedProjectList) {
        projectCreation.setupExistingProjects(storedProjectList);
    } else {
        todoCreation.setupExistingTodos(inboxTodos);
    }
} else {
    projectCreation.setupInboxProject();
}

document.querySelector('.add-project').addEventListener('click', () => {
    projectCreation.setupNewProject();
});
document.querySelector('.add-todo').addEventListener('click', () => {
    if (localStorage.getItem('project_list')) {

    } else {
        todoCreation.setupNewTodo(JSON.parse(localStorage.getItem('inbox_todos')));
    }
});