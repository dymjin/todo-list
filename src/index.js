import * as DOMhandler from './DOMhandler.js';
import * as todoCreation from './todoCreation.js';
import * as projectCreation from './projectCreation.js';


let currentProject, currentTodo, todoID = 1, projectID = 1;
initProject();
addListeners();

function initProject() {
    currentProject = projectCreation.addProject();
    projectCreation.projectList.push(currentProject);
    currentProject.id = projectID;

    if (document.querySelector('.project-container')) {
        DOMhandler.clearProjectDOM();
    }
    DOMhandler.addProjectDOM();

    const project = DOMhandler.addElement('project', 'test', document.querySelector('.projectlist-container'));
    const rmvBtn = DOMhandler.addElement('remove', 'remove', project, 'button');
    rmvBtn.addEventListener('click', () => {
        document.querySelector('.projectlist-container').removeChild(project);
        const projectList = projectCreation.projectList;
        projectList.splice(projectList.findIndex(({ id }) => id === project.getAttribute('data') - 1), 1);
    });

    project.setAttribute('data', currentProject.id);
    project.addEventListener('click', () => {
        console.log(project.getAttribute('data'))
    })
    projectID++;
    return currentProject;
}

document.querySelector('.add-project').addEventListener('click', () => {
    initProject();
    addListeners();
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
    let checkboxIndex = 0;
    const todoContainer = document.querySelector('.todo-container');
    let todoIndex = currentProject.todoList.findIndex(({ id }) => id === currentTodo.id);
    const todoChildren = todoContainer.childNodes;
    for (let i = 0; i < 5; i++) {
        todoChildren[i].addEventListener('change', () => {
            currentProject.todoList[todoIndex - 1].title = todoChildren[0].value;
            currentProject.todoList[todoIndex - 1].desc = todoChildren[1].value;
            currentProject.todoList[todoIndex - 1].dueDate = todoChildren[2].value;
            currentProject.todoList[todoIndex - 1].priority = todoChildren[3].value;
            currentProject.todoList[todoIndex - 1].notes = todoChildren[4].value;
            console.log(currentProject.todoList)
        })
    }
    todoContainer.childNodes[5].addEventListener('click', () => {
        const checklistContainer = document.querySelector('.checklist-container')
        const label = DOMhandler.addChecklist(checklistContainer);
        const labelChildren = label.childNodes;
        currentProject.todoList[todoIndex - 1]
            .checkboxArr
            .push({ title: label.children[1].value, state: label.children[0].checked });
        for (let i = 0; i < 2; i++) {
            labelChildren[i].setAttribute('data', checkboxIndex);
            labelChildren[i].addEventListener('change', () => {
                currentProject.todoList[todoIndex - 1]
                    .checkboxArr[labelChildren[0]
                        .getAttribute('data')].state = labelChildren[0].checked;
                currentProject.todoList[todoIndex - 1]
                    .checkboxArr[labelChildren[1]
                        .getAttribute('data')].title = labelChildren[1].value;
            })
        }
        checkboxIndex++;
    });
    todoIndex++;
}

function todoInit() {
    currentTodo = todoCreation.addTodo();
    currentProject.todoList.push(currentTodo);
    currentTodo.id = todoID;
    if (document.querySelector('.todo-container')) {
        DOMhandler.clearTodoDOM();
    }
    DOMhandler.addTodoDOM(currentTodo.title, currentTodo.desc, currentTodo.dueDate,
        currentTodo.priority, currentTodo.notes, currentTodo.checkboxArr);
    addInputListeners();
    todoID++;
}

function addListeners() {
    document.querySelector('.add-todo').addEventListener('click', () => {
        todoInit();
    });

    document.querySelector('.project-title').addEventListener('change', () => {
        currentProject.title = document.querySelector('.project-title').value;
    })
}
