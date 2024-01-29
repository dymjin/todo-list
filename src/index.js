import * as DOMhandler from './DOMhandler.js';
import * as todoCreation from './todoCreation.js';
import * as projectCreation from './projectCreation.js';

let currentProject = projectCreation.addProject();
projectCreation.projectList.push(currentProject);

document.querySelector('.add-project').addEventListener('click', () => {
    // DOMhandler.clearProjectDOM();
    // DOMhandler.addProjectDOM();
    // addListeners();
    // currentProject = projectCreation.addProject(document.querySelector('.project-title').value);
    // projectCreation.projectList.push(currentProject);
});

// const btn = document.createElement('button');
// btn.textContent = 'write';
// btn.addEventListener('click', () => {
//     DOMhandler.clearProjectDOM();
//     DOMhandler.addProjectDOM();
//     addListeners();
// });
// document.body.appendChild(btn);

// function clearProjectObj() {
//     while (projectCreation.projectList.length > 0) {
//         projectCreation.projectList.pop();
//     }
// }

// let copy;
// const restoreBtn = document.createElement('button');
// restoreBtn.textContent = 'read';
// restoreBtn.addEventListener('click', () => {
//     copy = projectCreation.projectList;
//     const restoredProject = projectCreation.addProject(copy[0].title, copy[0].todoList);
//     clearProjectObj();
//     DOMhandler.clearProjectDOM();
//     DOMhandler.addProjectDOM(restoredProject.title);
//     addListeners();
//     restoredProject.todoList.forEach(item => {
//         DOMhandler.addTodoDOM(item.title, item.desc, item.dueDate, item.priority, item.notes, item.checkboxArr);
//     })
//     console.log(restoredProject)
// })
// document.body.appendChild(restoreBtn);

function addInputListeners() {
    let counter = 0;
    const todoContainer = document.querySelector('.todo-container');
    todoContainer.childNodes[0].addEventListener('change', () => {
        currentProject.todoList[DOMhandler.init.get() - 2].title = todoContainer.childNodes[0].value
        console.log(currentProject.todoList)
    });
    todoContainer.childNodes[1].addEventListener('change', () => {
        currentProject.todoList[DOMhandler.init.get() - 2].desc = todoContainer.childNodes[1].value
        console.log(currentProject.todoList)
    });
    todoContainer.childNodes[2].addEventListener('change', () => {
        currentProject.todoList[DOMhandler.init.get() - 2].dueDate = todoContainer.childNodes[2].value
        console.log(currentProject.todoList)
    });
    todoContainer.childNodes[3].addEventListener('change', () => {
        currentProject.todoList[DOMhandler.init.get() - 2].priority = todoContainer.childNodes[3].value
        console.log(currentProject.todoList)
    });
    todoContainer.childNodes[5].addEventListener('click', () => {
        const checklistContainer = document.querySelector('.checklist-container')
        const label = DOMhandler.addChecklist(checklistContainer);
        currentProject.todoList[DOMhandler.init.get() - 2]
            .checkboxArr
            .push({ title: label.children[1].value, state: label.children[0].checked });
        label.children[0].setAttribute('data', counter);
        label.children[0].addEventListener('change', () => {
            currentProject
                .todoList[DOMhandler.init.get() - 2].checkboxArr[label.children[0].getAttribute('data')].state = label.children[0].checked
            // console.log(currentProject
            //     .todoList[DOMhandler.init.get() - 2].checkboxArr)
        })
        label.children[1].setAttribute('data', counter);
        label.children[1].addEventListener('change', () => {
            currentProject
                .todoList[DOMhandler.init.get() - 2].checkboxArr[label.children[1].getAttribute('data')].title = label.children[1].value
            // console.log(currentProject
            //     .todoList[DOMhandler.init.get() - 2].checkboxArr)
        })
        counter++;
    });

}

function addListeners() {
    document.querySelector('.add-todo').addEventListener('click', () => {
        const todo = todoCreation.addTodo();
        currentProject.todoList.push(todo)
        if (document.querySelector('.todo-container')) {
            DOMhandler.clearTodoDOM();
        }
        DOMhandler.addTodoDOM(todo.title, todo.desc, todo.dueDate, todo.priority, todo.notes, todo.checkboxArr);
        addInputListeners();
    });

    document.querySelector('.project-title').addEventListener('change', () => {
        currentProject.title = document.querySelector('.project-title').value;
    })
}

addListeners();