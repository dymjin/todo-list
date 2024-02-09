import * as DOMhandler from './DOMhandler.js';
import * as todoCreation from './todoCreation.js';
import * as projectCreation from './projectCreation.js';

let storedProjectList = JSON.parse(localStorage.getItem('project_list'));

if (storedProjectList) {
    projectCreation.setupExistingProjects(storedProjectList);
    const currentProject = JSON.parse(localStorage.getItem('current_project'));
    todoCreation.setupExistingTodos(currentProject.todoList);
}
else {
    projectCreation.setupNewProject();
    todoCreation.setupNewTodo();
};

document.querySelector('.add-project').addEventListener('click', () => {
    projectCreation.setupNewProject();
});

document.querySelector('.add-todo').addEventListener('click', () => {
    DOMhandler.clearTodoDOM();
    todoCreation.setupNewTodo();
});