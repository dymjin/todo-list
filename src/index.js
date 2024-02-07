import * as DOMhandler from './DOMhandler.js';
import * as todoCreation from './todoCreation.js';
import * as projectCreation from './projectCreation.js';

// let currentProject, currentTodo, todoID = 1, projectID = 1;
const storedProjectList = JSON.parse(localStorage.getItem('project_list'));
if (document.querySelector('.project-container')) {
    DOMhandler.clearProjectDOM();
    DOMhandler.clearProjectTabDOM();
};
if (storedProjectList) {
    projectCreation.setupExistingProjects(storedProjectList);
}
else {
    projectCreation.setupNewProject();
};

function populateStorage() {
    localStorage.setItem('project-list', JSON.stringify(projectCreation.projectList));
}

document.querySelector('.add-project').addEventListener('click', () => {
    projectCreation.setupNewProject();
});

// function todoInit() {
//     let storedTodo = JSON.parse(localStorage.getItem('currentTodo'));
//     if (document.querySelector('.todo-container')) {
//         DOMhandler.clearTodoDOM();
//     }
//     if (storedTodo) {
//         currentTodo = storedTodo;
//         DOMhandler.addTodoDOM(storedTodo.title, storedTodo.desc, storedTodo.dueDate,
//             storedTodo.priority, storedTodo.notes, storedTodo.checkboxArr);
//         todoID = storedTodo.id;
//     } else {
//         currentTodo = todoCreation.addTodo();
//         currentTodo.id = todoID;
//         currentProject.todoList.push(currentTodo);
//         DOMhandler.addTodoDOM();
//     }
//     addInputListeners();
//     todoID++;
//     // localStorage.setItem('projectList', JSON.stringify(projectCreation.projectList));
//     localStorage.setItem('currentProject', JSON.stringify(currentProject));
//     localStorage.setItem('currentTodo', JSON.stringify(currentTodo));
// }

// function addInputListeners() {
//     let checkboxIndex = 0;
//     const todoContainer = document.querySelector('.todo-container');
//     console.log(todoContainer)
//     //used for finding current todo's index in todolist later
//     // let todoIndex = currentProject.todoList.findIndex(({ id }) => id === currentTodo.id);

//     const todoChildren = todoContainer.childNodes;
//     for (let i = 0; i < 5; i++) {
//         todoChildren[i].addEventListener('change', () => {
//             currentProject.todoList[currentTodo.id - 1].title = todoChildren[0].value;
//             currentProject.todoList[currentTodo.id - 1].desc = todoChildren[1].value;
//             currentProject.todoList[currentTodo.id - 1].dueDate = todoChildren[2].value;
//             currentProject.todoList[currentTodo.id - 1].priority = todoChildren[3].value;
//             currentProject.todoList[currentTodo.id - 1].notes = todoChildren[4].value;
//             localStorage.setItem('projectList', JSON.stringify(projectCreation.projectList));
//             localStorage.setItem('currentProject', JSON.stringify(currentProject));
//             localStorage.setItem('currentTodo', JSON.stringify(currentTodo));
//         })
//     }
//     todoContainer.childNodes[5].addEventListener('click', () => {
//         const checklistContainer = document.querySelector('.checklist-container')
//         const label = DOMhandler.addChecklist(checklistContainer);
//         const labelChildren = label.childNodes;
//         currentProject.todoList[currentTodo.id - 1]
//             .checkboxArr
//             .push({ title: label.children[1].value, state: label.children[0].checked });
//         localStorage.setItem('currentTodo', JSON.stringify(currentTodo));
//         for (let i = 0; i < 2; i++) {
//             labelChildren[i].setAttribute('data', checkboxIndex);
//             labelChildren[i].addEventListener('change', () => {
//                 currentProject.todoList[currentTodo.id - 1]
//                     .checkboxArr[labelChildren[0]
//                         .getAttribute('data')].state = labelChildren[0].checked;
//                 currentProject.todoList[currentTodo.id - 1]
//                     .checkboxArr[labelChildren[1]
//                         .getAttribute('data')].title = labelChildren[1].value;
//                 localStorage.setItem('projectList', JSON.stringify(projectCreation.projectList));
//                 localStorage.setItem('currentProject', JSON.stringify(currentProject));
//                 localStorage.setItem('currentTodo', JSON.stringify(currentTodo));
//             })
//         }
//         checkboxIndex++;
//     });
//     // todoIndex++;
// }

//     document.querySelector('.add-todo').addEventListener('click', () => {
//         todoInit();
//     });
