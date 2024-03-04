import { format } from "date-fns";
import * as projectCreation from './projectCreation.js';
import * as DOMhandler from './DOMhandler.js';

let currentTodo, checkboxIndex = 1;

function addTodo(title = '', desc = '', dueDate = format(new Date(), "yyyy-MM-dd"),
    priority = '', notes = '', checkboxArr = [], status = 'pending', id = 1) {
    const currProj = JSON.parse(localStorage.getItem('current_project'));
    // let currProject = JSON.parse(localStorage.getItem('current_project'));
    if (currProj.todoList.length) {
        //find element with highest id, then add 1 for new id
        let sortedArr = currProj.todoList.sort((a, b) => a.id - b.id)
        id = (sortedArr.at(-1).id + 1);
    }
    return { title, desc, dueDate, priority, notes, checkboxArr, status, id };
}

function setupNewTodo() {
    currentTodo = addTodo();
    // add new todo to global projectList
    projectCreation.projectList[projectCreation.currentProject.id - 1].todoList.push(currentTodo);
    setStorage(projectCreation.projectList, projectCreation.currentProject);
    const todoInputs = DOMhandler.addTodoInputs();
    // const todoTab = DOMhandler.addTodoTab();
    // addTodoTabListeners(todoTab)
    addInputListeners(todoInputs);
}

function setupExistingTodos() {
    currentTodo = JSON.parse(localStorage.getItem('current_todo'));
    if (localStorage.getItem('current_project')) {
        projectCreation.currentProject.todoList.forEach((todo) => {
            // const todoTab = DOMhandler.addTodoTab(todo.title,
                // document.querySelector(`.project-tab[data="${projectCreation.currentProject.id}"]`),
                // format(new Date(todo.dueDate), 'dd-MM-yyyy'), todo.priority, projectCreation.currentProject.id, todo.id);
            // addTodoTabListeners(todoTab);
        })
    } else {
        projectCreation.currentProject.todoList.forEach((todo) => {
            // const todoTab = DOMhandler.addTodoTab(todo.title, undefined,
            //     format(new Date(todo.dueDate), 'dd-MM-yyyy'), todo.priority, projectCreation.currentProject.id, todo.id);
            // addTodoTabListeners(todoTab);
        })
    }
    const todoInputs = DOMhandler.addTodoInputs(currentTodo.title, currentTodo.desc, currentTodo.dueDate,
        currentTodo.priority, currentTodo.notes, currentTodo.checkboxArr);
    addInputListeners(todoInputs);
}

function setStorage(projectList, currentProject) {
    localStorage.setItem('project_list', JSON.stringify(projectList));
    localStorage.setItem('current_project', JSON.stringify(projectList[currentProject.id - 1]));
    localStorage.setItem('current_todo', JSON.stringify(projectList[currentProject.id - 1].todoList[currentTodo.id - 1]));
}

// function addTodoTabListeners(tab) {
//     //https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/setData
//     //https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API#interfaces
//     tab[0].addEventListener('dragstart', (ev) => {
//         console.log('dragStart')
//         tab[0].style.backgroundColor = 'blue';
//         ev.dataTransfer.clearData();
//         ev.dataTransfer.setData("text/plain", ev.target.id);
//     })
//     tab[0].addEventListener('dragend', () => {
//         console.log('dragEnd');
//         tab[0].style.backgroundColor = '';
//     })

//     const removeTab = tab[3];
//     const editTab = tab[2];
//     removeTab.addEventListener('click', () => {
//         const projList = projectCreation.projectList;
//         const currProj = projectCreation.currentProject;
//         if (projList[currProj.id - 1].todoList.length > 1) {
//             projList[currProj.id - 1].todoList.splice(removeTab.getAttribute('data')[2] - 1, 1);
//             projList[currProj.id - 1].todoList.forEach((todo, index) => {
//                 todo.id = index + 1;
//             })
//             const todoContainer = document.querySelector(`.todo-tab-wrapper[data="${currProj.id}"]`);
//             todoContainer.removeChild(tab[0]);
//             todoContainer.childNodes.forEach((elem, index) => {
//                 elem.setAttribute('data', `${currProj.id}-${index + 1}`);
//                 elem.childNodes.forEach(child => {
//                     child.setAttribute('data', `${currProj.id}-${index + 1}`);
//                     elem.childNodes[0].childNodes.forEach(child => {
//                         child.setAttribute('data', `${currProj.id}-${index + 1}`);
//                     })
//                 })
//             });

//             currentTodo = projList[currProj.id - 1].todoList.at(-1);

//         } else {
//             projList[currProj.id - 1].todoList.splice(0, 1);
//             currentTodo = addTodo();
//             currentTodo.id = 1;
//             projList[currProj.id - 1].todoList.push(currentTodo);
//             DOMhandler.clearDOM('todo');
//             const todoDOM = DOMhandler.addTodoDOM();
//             document.querySelector(`.todo-tab-title[data="${currProj.id}-${currentTodo.id}"]`).value = 'My todo';
//             document.querySelector(`.todo-tab-duedate[data="${currProj.id}-${currentTodo.id}"]`).textContent = format(new Date(), "dd-MM-yyyy");
//             addInputListeners(todoDOM);
//         }
//         setStorage(projectCreation.projectList, projectCreation.currentProject)
//     })
// }

function addInputListeners(todoContainer) {
    let pList = projectCreation.projectList;
    let currProject = projectCreation.currentProject;
    let pListCurrTodo = pList[currProject.id - 1].todoList[currentTodo.id - 1];
    for (let i = 0; i < 5; i++) {
        todoContainer.childNodes[i].addEventListener('input', () => {
            //change todo tab DOM
            // if (todoContainer.childNodes[0].value !== '') {
            //     document.querySelector(`.todo-tab-title[data="${currProject.id}-${pListCurrTodo.id}"]`).value = todoContainer.childNodes[0].value;
            // }
            // if (todoContainer.childNodes[2].value !== '') {
            //     document.querySelector(`.todo-tab-duedate[data="${currProject.id}-${pListCurrTodo.id}"]`)
            //         .textContent = format(new Date(todoContainer.childNodes[2].value), "dd-MM-yyyy");
            //     pListCurrTodo.dueDate = new Date();
            // }
            //add input event listener for all todoDOM elements
            pListCurrTodo.title = todoContainer.childNodes[0].value;
            pListCurrTodo.desc = todoContainer.childNodes[1].value;
            pListCurrTodo.dueDate = todoContainer.childNodes[2].value;
            pListCurrTodo.priority = todoContainer.childNodes[3].value;
            pListCurrTodo.notes = todoContainer.childNodes[4].value;
            setStorage(pList, currProject);
        })
    }
    //if checkboxArr exists, setup checkbox with values of checkboxArr
    if (currentTodo.checkboxArr.length) {
        setupExistingCheckbox(pListCurrTodo, currentTodo.checkboxArr);
    }

    todoContainer.childNodes[5].addEventListener('click', () => {
        setupNewCheckbox(pListCurrTodo);
    });
}

function setupExistingCheckbox(projectListCurrentTodo, currentCheckboxArr) {
    const checkboxContainer = document.querySelector('.checkbox-container');
    //clear checkboxDOM if it exists
    while (checkboxContainer.firstChild) {
        checkboxContainer.removeChild(checkboxContainer.firstChild)
    }
    currentCheckboxArr.forEach(checkbox => {
        const label = DOMhandler.addCheckbox(checkboxContainer, checkbox);
        const labelChildren = label.childNodes;
        //set both checkbox-item + checkbox-item-title's data attribute, respectively
        for (let i = 0; i < 2; i++) {
            labelChildren[i].setAttribute('data', `${projectCreation.currentProject.id}-${currentTodo.id}-${checkbox.id}`);
        }
        addCheckboxListeners(projectListCurrentTodo, labelChildren);
        checkboxIndex++;
    })
}

function setupNewCheckbox(projectListCurrentTodo) {
    const checkboxContainer = document.querySelector('.checkbox-container');
    const label = DOMhandler.addCheckbox(checkboxContainer);
    const labelChildren = label.childNodes;
    for (let i = 0; i < 2; i++) {
        labelChildren[i].setAttribute('data', `${projectCreation.currentProject.id}-${currentTodo.id}-${checkboxIndex}`);
    }
    //add checkbox obj to the currentTodo's checkboxArr
    projectListCurrentTodo.checkboxArr
        .push({ title: label.children[1].value, state: label.children[0].checked, id: checkboxIndex });
    setStorage(projectCreation.projectList, projectCreation.currentProject);
    addCheckboxListeners(projectListCurrentTodo, labelChildren);
    checkboxIndex++;
}

function addCheckboxListeners(projectListCurrentTodo, labelChildren) {
    for (let i = 0; i < 2; i++) {
        labelChildren[i].addEventListener('input', () => {
            // checkbox input element
            projectListCurrentTodo.checkboxArr[labelChildren[0]
                .getAttribute('data')[4] - 1].state = labelChildren[0].checked;
            // text input element
            projectListCurrentTodo.checkboxArr[labelChildren[1]
                .getAttribute('data')[4] - 1].title = labelChildren[1].value;
            setStorage(projectCreation.projectList, projectCreation.currentProject)
        })
    }
}


export { setupNewTodo, setupExistingTodos, currentTodo }