import { format } from "date-fns";
import * as projectCreation from './projectCreation.js';
import * as DOMhandler from './DOMhandler.js';

let currentTodo, checkboxIndex = 1;

function addTodo(title, desc, dueDate, priority, notes, checkboxArr, status, id = 1) {
    title = title || '';
    desc = desc || '';
    dueDate = dueDate || format(new Date(), "dd-MM-yyyy");
    priority = priority || '';
    notes = notes || '';
    checkboxArr = checkboxArr || [];
    status = status || 'pending';

    let currProject = projectCreation.currentProject;
    if (currProject && currProject.todoList.length > 0) {
        //find element with highest id, then add 1 for new id
        let sortedArr = currProject.todoList.sort((a, b) => a.id - b.id)
        id = (sortedArr[sortedArr.length - 1].id + 1);
    }

    return { title, desc, dueDate, priority, notes, checkboxArr, status, id };
}

function setupNewTodo() {
    if (document.querySelector('.todo-container')) {
        DOMhandler.clearTodoDOM();
    }
    let newTodo = addTodo();
    // add new todo to global projectList
    projectCreation.projectList[projectCreation.currentProject.id - 1].todoList.push(newTodo);
    currentTodo = newTodo;
    setStorage(projectCreation.projectList, projectCreation.currentProject);
    const todoDOM = DOMhandler.addTodoDOM();
    addInputListeners(todoDOM);
}

function setupExistingTodos() {
    if (document.querySelector('.todo-container')) {
        DOMhandler.clearTodoDOM();
    }
    currentTodo = JSON.parse(localStorage.getItem('current_todo'));
    const todoDOM = DOMhandler.addTodoDOM(currentTodo.title, currentTodo.desc, currentTodo.dueDate,
        currentTodo.priority, currentTodo.notes, currentTodo.checkboxArr);
    addInputListeners(todoDOM);
}

function setStorage(projectList, currentProject) {
    localStorage.setItem('project_list', JSON.stringify(projectList));
    localStorage.setItem('current_project', JSON.stringify(projectList[currentProject.id - 1]));
    localStorage.setItem('current_todo', JSON.stringify(projectList[currentProject.id - 1].todoList[currentTodo.id - 1]));
}

function addInputListeners(inputList) {
    let pList = projectCreation.projectList;
    let currProject = projectCreation.currentProject;
    let pListCurrTodo = pList[currProject.id - 1].todoList[currentTodo.id - 1];
    for (let i = 0; i < 5; i++) {
        inputList[i].addEventListener('input', () => {
            //add input event listener for all todoDOM elements
            pListCurrTodo.title = inputList[0].value;
            pListCurrTodo.desc = inputList[1].value;
            pListCurrTodo.dueDate = inputList[2].value;
            pListCurrTodo.priority = inputList[3].value;
            pListCurrTodo.notes = inputList[4].value;
            setStorage(pList, currProject);
        })
    }
    //if checkboxArr exists, setup checklist with values of checkboxArr
    if (currentTodo.checkboxArr.length) {
        setupExistingChecklist(pListCurrTodo, currentTodo.checkboxArr);
    }

    inputList[5].addEventListener('click', () => {
        setupNewChecklist(pListCurrTodo);
    });
}

function setupExistingChecklist(projectListCurrentTodo, currentCheckboxArr) {
    const checklistContainer = document.querySelector('.checklist-container');
    //clear checklistDOM if it exists
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
        addChecklistListeners(projectListCurrentTodo, labelChildren);
        checkboxIndex++;
    })
}

function setupNewChecklist(projectListCurrentTodo) {
    const checklistContainer = document.querySelector('.checklist-container');
    const label = DOMhandler.addChecklist(checklistContainer);
    const labelChildren = label.childNodes;
    for (let i = 0; i < 2; i++) {
        labelChildren[i].setAttribute('data', checkboxIndex);
    }
    //add checkbox obj to the currentTodo's checkboxArr
    projectListCurrentTodo.checkboxArr
        .push({ title: label.children[1].value, state: label.children[0].checked, id: checkboxIndex });
    setStorage(projectCreation.projectList, projectCreation.currentProject);
    addChecklistListeners(projectListCurrentTodo, labelChildren);
    checkboxIndex++;
}

function addChecklistListeners(projectListCurrentTodo, labelChildren) {
    for (let i = 0; i < 2; i++) {
        labelChildren[i].addEventListener('input', () => {
            //checkbox input element
            projectListCurrentTodo.checkboxArr[labelChildren[0]
                .getAttribute('data') - 1].state = labelChildren[0].checked;
            //text input element
            projectListCurrentTodo.checkboxArr[labelChildren[1]
                .getAttribute('data') - 1].title = labelChildren[1].value;
            setStorage(projectCreation.projectList, projectCreation.currentProject)
        })
    }
}

export { addTodo, setupExistingTodos, setupNewTodo, currentTodo };