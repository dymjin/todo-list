import * as DOMhandler from './DOMhandler.js';
import * as todoCreation from './todoCreation.js';
import * as projectCreation from './projectCreation.js';

// let storedProjectList = JSON.parse(localStorage.getItem('project_list'));

const project = projectCreation.addProject();

// if (storedProjectList) {
//     projectCreation.setupExistingProjects(storedProjectList);
// }
// else {
//     projectCreation.setupNewProject();
// };

// document.querySelector('.add-project').addEventListener('click', () => {
//     projectCreation.setupNewProject();
// });

// document.querySelector('.add-todo').addEventListener('click', () => {
//     todoCreation.setupNewTodo();
// });