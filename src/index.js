import * as DOMhandler from './DOMhandler.js';
import * as todoCreation from './todoCreation.js';
import * as projectCreation from './projectCreation.js';

let storedProjectList = JSON.parse(localStorage.getItem('project_list'));
if (storedProjectList) {
    projectCreation.setupExistingProjects(storedProjectList);
    todoCreation.setupExistingTodos();
} else {
    projectCreation.setupNewProject();
    todoCreation.setupNewTodo();
}

document.querySelector('.add-project').addEventListener('click', () => {
    projectCreation.setupNewProject();
    todoCreation.setupNewTodo();
});
document.querySelector('.add-todo').addEventListener('click', () => {
    todoCreation.setupNewTodo();
});