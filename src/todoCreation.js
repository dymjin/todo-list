import { format } from "date-fns";
import * as projectCreation from './projectCreation.js';
import * as DOMhandler from './DOMhandler.js';
// import * as index from './index.js';

let currentProject, projectList, currentTodo, todoID = 1, checkboxIndex = 1;

function addTodo(title, desc, dueDate, priority, notes, checkboxArr, status, id) {
    title = title || '';
    desc = desc || '';
    dueDate = dueDate || format(new Date(), "dd-MM-yyyy");
    priority = priority || '';
    notes = notes || '';
    checkboxArr = checkboxArr || [];
    status = status || 'pending';
    id = todoID;
    todoID++
    return { title, desc, dueDate, priority, notes, checkboxArr, status, id };
}

function setupNewTodo() {
    if (document.querySelector('.todo-container')) {
        DOMhandler.clearTodoDOM();
    }
    currentProject = JSON.parse(localStorage.getItem('current_project'));
    projectList = JSON.parse(localStorage.getItem('project_list'));
    let newTodo = addTodo();
    projectList[currentProject.id - 1].todoList.push(newTodo);
    currentProject.todoList.push(newTodo);
    currentTodo = newTodo;
    localStorage.setItem('project_list', JSON.stringify(projectList));
    localStorage.setItem('current_project', JSON.stringify(currentProject));
    localStorage.setItem('current_todo', JSON.stringify(currentTodo));
    const todoDOM = DOMhandler.addTodoDOM();
    addInputListeners(todoDOM);
}

function setupExistingTodos(list) {
    if (document.querySelector('.todo-container')) {
        DOMhandler.clearTodoDOM();
    }
    let currentTodo = JSON.parse(localStorage.getItem('current_todo'));
    currentTodo = list[currentTodo.id - 1];
    const todoDOM = DOMhandler.addTodoDOM(currentTodo.title, currentTodo.desc, currentTodo.dueDate,
        currentTodo.priority, currentTodo.notes, currentTodo.checkboxArr);
    addInputListeners(todoDOM);
    todoID = currentTodo.id;
}

function addInputListeners(inputList) {
    let currentProject = JSON.parse(localStorage.getItem('current_project'));
    let projectList = JSON.parse(localStorage.getItem('project_list'));
    let currentTodo = JSON.parse(localStorage.getItem('current_todo'));
    let storageItems = [projectList, currentProject, currentTodo];
    let projects = [currentProject.todoList[currentTodo.id - 1],
    projectList[currentProject.id - 1].todoList[currentTodo.id - 1],
        currentTodo];
    for (let i = 0; i < 5; i++) {
        inputList[i].addEventListener('input', () => {
            projects.forEach(item => {
                item.title = inputList[0].value;
                item.desc = inputList[1].value;
                item.dueDate = inputList[2].value;
                item.priority = inputList[3].value;
                item.notes = inputList[4].value;
            })
            localStorage.setItem('project_list', JSON.stringify(projectList));
            localStorage.setItem('current_project', JSON.stringify(currentProject));
            localStorage.setItem('current_todo', JSON.stringify(currentTodo));
        })
    }
    if (currentTodo.checkboxArr.length) {
        setupExistingChecklist(projects, storageItems, currentTodo.checkboxArr);
    }
    inputList[5].addEventListener('click', () => {
        setupNewChecklist(projects, storageItems);
    });
}

function setupExistingChecklist(projectsArr, storageItemsArr, currentCheckboxArr) {
    const checklistContainer = document.querySelector('.checklist-container');
    while (checklistContainer.firstChild) {
        checklistContainer.removeChild(checklistContainer.firstChild)
    }
    currentCheckboxArr.forEach(checkbox => {
        const label = DOMhandler.addChecklist(checklistContainer, checkbox);
        const labelChildren = label.childNodes;
        //set both checklist-item + checklist-item-title's data attribute, respectively
        for (let i = 0; i < 2; i++) {
            labelChildren[i].setAttribute('data', checkbox.id);
        }
        addChecklistListeners(projectsArr, storageItemsArr, labelChildren);
        checkboxIndex++;
    })
}

function setupNewChecklist(projectsArr, storageItemsArr) {
    const checklistContainer = document.querySelector('.checklist-container');
    const label = DOMhandler.addChecklist(checklistContainer);
    const labelChildren = label.childNodes;
    for (let i = 0; i < 2; i++) {
        labelChildren[i].setAttribute('data', checkboxIndex);
    }
    projectsArr.forEach(item => {
        item.checkboxArr
            .push({ title: label.children[1].value, state: label.children[0].checked, id: checkboxIndex });
        localStorage.setItem('project_list', JSON.stringify(storageItemsArr[0]));
        localStorage.setItem('current_project', JSON.stringify(storageItemsArr[1]));
        localStorage.setItem('current_todo', JSON.stringify(storageItemsArr[2]));
    });
    addChecklistListeners(projectsArr, storageItemsArr, labelChildren);
    checkboxIndex++;
}

function addChecklistListeners(projectsArr, storageItemsArr, labelChildren) {
    projectsArr.forEach(item => {
        for (let i = 0; i < 2; i++) {
            labelChildren[i].addEventListener('input', () => {
                item.checkboxArr[labelChildren[0]
                    .getAttribute('data') - 1].state = labelChildren[0].checked;
                item.checkboxArr[labelChildren[1]
                    .getAttribute('data') - 1].title = labelChildren[1].value;
                localStorage.setItem('project_list', JSON.stringify(storageItemsArr[0]));
                localStorage.setItem('current_project', JSON.stringify(storageItemsArr[1]));
                localStorage.setItem('current_todo', JSON.stringify(storageItemsArr[2]));
            })
        }
    })
}


export { addTodo, setupExistingTodos, setupNewTodo };