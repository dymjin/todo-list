// import * as DOMhandler from './DOMhandler.js';
import * as todoCreation from './todoCreation.js';
import * as projectCreation from './projectCreation.js';

const storedProjectList = JSON.parse(localStorage.getItem('project_list'));
if (storedProjectList) {
    projectCreation.setupExistingProjects();
}

document.querySelector('.add-project').addEventListener('click', () => {
    projectCreation.setupNewProject();
});
document.querySelector('.add-todo').addEventListener('click', () => {
    todoCreation.setupNewTodo();
});