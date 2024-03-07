// import * as DOMhandler from './DOMhandler.js';
import * as todoCreation from './todoCreation.js';
import * as projectCreation from './projectCreation.js';

if (!localStorage.getItem('inbox_todos')) {
    projectCreation.setupInboxProject();
}
const storedProjectList = JSON.parse(localStorage.getItem('project_list'));
const inboxTodos = JSON.parse(localStorage.getItem('inbox_todos'));
if (storedProjectList) {
    projectCreation.setupExistingProjects(storedProjectList);
}
todoCreation.setupExistingTodos();

document.querySelector('.add-project').addEventListener('click', () => {
    projectCreation.setupNewProject();
});
document.querySelector('.add-todo').addEventListener('click', () => {
    if (localStorage.getItem('project_list')) {
        todoCreation.setupNewTodo(JSON.parse(localStorage.getItem('project_list')));
    } else {
        todoCreation.setupNewTodo(JSON.parse(localStorage.getItem('inbox_todos')));
    }
});