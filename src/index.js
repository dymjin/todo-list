import * as DOMhandler from './DOMhandler.js';
import * as todoCreation from './todoCreation.js';
import * as projectCreation from './projectCreation.js';

let currentProject, currentTodo, todoID = 1, projectID = 1;
if (!JSON.parse(localStorage.getItem('projectList'))) {
    initProject();
} else {
    const projectTitle = JSON.parse(localStorage.getItem('currentProject')).title;
    if (document.querySelector('.project-container')) {
        DOMhandler.clearProjectDOM();
        DOMhandler.clearProjectTabDOM();
    }
    initProject(projectTitle);
}

function addNewProject() {
    let newProject = projectCreation.addProject();
    newProject.id = projectID;
    projectCreation.projectList.push(newProject);
    currentProject = newProject;
    const projectTab = DOMhandler.addProjectTabs('', newProject.id);
    projectID++;
    localStorage.setItem('projectList', JSON.stringify(projectCreation.projectList));
    return projectTab;
}

function initProject(title) {
    let projectTab;
    let storedProjectList = JSON.parse(localStorage.getItem('projectList'));
    if (document.querySelector('.project-container')) {
        DOMhandler.clearProjectDOM();
        DOMhandler.clearProjectTabDOM();
    };
    DOMhandler.addProjectDOM();
    if (storedProjectList) {
        currentProject = JSON.parse(localStorage.getItem('currentProject'));
        storedProjectList.forEach(project => {
            //copy provided project list to global projectList
            project.id = projectID;
            projectCreation.projectList.push(project);
            //project tab functionality
            let tab = DOMhandler.addProjectTabs(project.title, project.id);
            addListeners(tab);
            projectID++;
        });
    }
    else {
        projectTab = addNewProject();
        addListeners(projectTab);
    }
    localStorage.setItem('projectList', JSON.stringify(projectCreation.projectList));
    localStorage.setItem('currentProject', JSON.stringify(currentProject));
}

document.querySelector('.add-project').addEventListener('click', () => {
    const projectTab = addNewProject();
    addListeners(projectTab);
});

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

function addListeners(tab) {
    document.querySelector('.add-todo').addEventListener('click', () => {
        todoInit();
    });
    tab[1].addEventListener('click', () => {
        currentProject = projectCreation.projectList[tab[0].getAttribute('data') - 1];
        localStorage.setItem('currentProject', JSON.stringify(currentProject));
    })
    tab[1].addEventListener('change', () => {
        currentProject.title = tab[1].value;
        localStorage.setItem('projectList', JSON.stringify(projectCreation.projectList));
        localStorage.setItem('currentProject', JSON.stringify(currentProject));
    })
}
