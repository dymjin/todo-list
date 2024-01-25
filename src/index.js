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
        let list = [];
        checklistChildren.forEach(child => {
            list.push({ title: child.children[1].value, state: child.children[0].checked ? "pending" : 'complete' })
        })
        const newTodo = todoCreation.addTodo(
            document.querySelector('.todo-input-title').value,
            document.querySelector('.todo-input-desc').value,
            document.querySelector('.due-date').value,
            document.querySelector('.priority-select').value,
            document.querySelector('.notes-input').value,
            list
        );
        currentProject.todoList.push(newTodo);
        console.log(newTodo)
        DOMhandler.addTodoDOM(newTodo.title, newTodo.desc, newTodo.dueDate, newTodo.priority, newTodo.notes, newTodo.lists);
        document.querySelector('.todo-input-title').value = '';
        document.querySelector('.todo-input-desc').value = '';
        document.querySelector('.due-date').value = '';
        document.querySelector('.priority-select').value = '';
        document.querySelector('.todo-dialog').close();
    });

    document.querySelector('button.add-checkbox').addEventListener('click', () => {
        // if (checklist.length) {
        //     checklist.forEach(item => {
        //         DOMhandler.addChecklist(item);
        //     });
        // } else {
        //     DOMhandler.addChecklist();
        // }
        // currentProject.todoList[0].lists.push(checklist);
        // console.log(currentProject.todoList)
    });

    document.querySelector('.add-checkbox').addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.checklist-container').hidden = false;
        // let checklist = [{ title: "square", state: true }, { title: "circle", state: false }]
        DOMhandler.addChecklist(document.querySelector('.checklist-container'));
    });

    document.querySelector('.project-title').addEventListener('change', () => {
        currentProject.title = document.querySelector('.project-title').value;
    })
}

addListeners();