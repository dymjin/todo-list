import * as DOMhandler from './DOMhandler.js';
import * as todoCreation from './todoCreation.js';
import * as projectCreation from './projectCreation.js';

let currentProject = projectCreation.addProject();
projectCreation.projectList.push(currentProject);

document.querySelector('.add-project').addEventListener('click', () => {
    DOMhandler.clearProject();
    DOMhandler.addProjectDOM();
    addListeners();
    currentProject = projectCreation.addProject(document.querySelector('.project-title').value);
    projectCreation.projectList.push(currentProject);
});

const btn = document.createElement('button');
btn.textContent = 'write';
btn.addEventListener('click', () => {
    DOMhandler.clearProject();
    DOMhandler.addProjectDOM();
});
document.body.appendChild(btn);

let copy;
function clearProjectObj() {
    while (projectCreation.projectList.length > 0) {
        projectCreation.projectList.pop();
    }
}

const restoreBtn = document.createElement('button');
restoreBtn.textContent = 'read';
restoreBtn.addEventListener('click', () => {
    copy = projectCreation.projectList;
    const restoredProject = projectCreation.addProject(copy[0].title, copy[0].todoList);
    clearProjectObj();
    DOMhandler.clearProject();
    DOMhandler.addProjectDOM(restoredProject.title);
    restoredProject.todoList.forEach(item => {
        DOMhandler.addTodoDOM(item.title, item.desc, item.dueDate, item.priority);
    })
    console.log(restoredProject)
})
document.body.appendChild(restoreBtn);

function addListeners() {
    document.querySelector('.add-todo').addEventListener('click', () => {
        document.querySelector('.todo-dialog').showModal();
    });

    document.querySelector('.todo-confirm').addEventListener('click', (event) => {
        event.preventDefault();
        const checklistChildren = document.querySelector('.checklist-container').childNodes;
        let checkboxArr = [];
        checklistChildren.forEach(child => {
            checkboxArr.push({ title: child.children[1].value, state: child.children[0].checked })
        })
        const newTodo = todoCreation.addTodo(
            document.querySelector('.todo-input-title').value,
            document.querySelector('.todo-input-desc').value,
            document.querySelector('.due-date').value,
            document.querySelector('.priority-select').value,
            document.querySelector('.notes-input').value,
            checkboxArr
        );
        currentProject.todoList.push(newTodo);
        console.log(newTodo)
        DOMhandler.addTodoDOM(newTodo.title, newTodo.desc, newTodo.dueDate, newTodo.priority, newTodo.notes, newTodo.checkboxArr);
        document.querySelector('.todo-input-title').value = '';
        document.querySelector('.todo-input-desc').value = '';
        document.querySelector('.due-date').value = '';
        document.querySelector('.priority-select').value = '';
        document.querySelector('.notes-input').value = '';
        while (document.querySelector('.checklist-container').firstChild) {
            document.querySelector('.checklist-container').removeChild(document.querySelector('.checklist-container').firstChild);
        }
        document.querySelector('.checklist-container').hidden = true;
        document.querySelector('.todo-dialog').close();
    });

    document.querySelector('.add-checkbox').addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.checklist-container').hidden = false;
        let arr = [{ title: "square", state: true }, { title: "circle", state: false }]
        DOMhandler.addChecklist(document.querySelector('.checklist-container'));
    });

    document.querySelector('.project-title').addEventListener('change', () => {
        currentProject.title = document.querySelector('.project-title').value;
    })
}

addListeners();