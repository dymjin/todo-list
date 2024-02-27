import { format } from "date-fns";
import * as projectCreation from './projectCreation.js';
import * as DOMhandler from './DOMhandler.js';

let currentTodo, checkboxIndex = 1;

function addTodo(title = '', desc = '', dueDate = format(new Date(), "yyyy-MM-dd"),
    priority = '', notes = '', checkboxArr = [], status = 'pending', id = 1) {

    // let currProject = JSON.parse(localStorage.getItem('current_project'));
    if (projectCreation.currentProject.todoList.length) {
        //find element with highest id, then add 1 for new id
        let sortedArr = projectCreation.currentProject.todoList.sort((a, b) => a.id - b.id)
        id = (sortedArr[sortedArr.length - 1].id + 1);
    }
    return { title, desc, dueDate, priority, notes, checkboxArr, status, id };
}

function setupNewTodo() {
    DOMhandler.clearDOM('todo');
    currentTodo = addTodo();
    // add new todo to global projectList
    projectCreation.projectList[projectCreation.currentProject.id - 1].todoList.push(currentTodo);
    setStorage(projectCreation.projectList, projectCreation.currentProject);

    const todoDOM = DOMhandler.addTodoDOM();
    const todoTab = DOMhandler.addTodoTab('', format(new Date(), 'dd-MM-yyyy'), '', projectCreation.currentProject.id, currentTodo.id);
    // addTodoTabListeners(todoTab)
    addInputListeners(todoDOM);
}

function setupExistingTodos() {
    DOMhandler.clearDOM('todo');
    currentTodo = JSON.parse(localStorage.getItem('current_todo'));
    projectCreation.currentProject.todoList.forEach(todo => {
        DOMhandler.addTodoTab(todo.title, format(new Date(todo.dueDate), 'dd-MM-yyyy'), todo.priority, projectCreation.currentProject.id, todo.id)
    })
    const todoDOM = DOMhandler.addTodoDOM(currentTodo.title, currentTodo.desc, currentTodo.dueDate,
        currentTodo.priority, currentTodo.notes, currentTodo.checkboxArr);
    addInputListeners(todoDOM);
}

function setStorage(projectList, currentProject) {
    localStorage.setItem('project_list', JSON.stringify(projectList));
    localStorage.setItem('current_project', JSON.stringify(projectList[currentProject.id - 1]));
    localStorage.setItem('current_todo', JSON.stringify(projectList[currentProject.id - 1].todoList[currentTodo.id - 1]));
}

// function addTodoTabListeners(tab) {
//     const removeTab = tab[3];
//     const editTab = tab[2];
//     const tabContainer = tab[0];
//     removeTab.addEventListener('click', () => {
//         if (projectCreation.currentProject.todoList.length > 1) {
//             currentTodo = projectCreation.currentProject.todoList[tab[0].getAttribute('data')[2] - 1];
//             projectCreation.currentProject.todoList.splice(currentTodo.id - 1, 1);
//             projectCreation.currentProject.todoList.forEach((todo, index) => {
//                 todo.id = index + 1;
//             })
//             if (projectCreation.currentProject.todoList[currentTodo.id]) { }
//             else { currentTodo.id = projectCreation.currentProject.todoList[projectCreation.currentProject.todoList.length - 1].id }
//             const project = document.querySelector(`.project[data="${projectCreation.currentProject.id}"]`);
//             const todo = document.querySelector(`.todo[data="${projectCreation.currentProject.id}-${currentTodo.id}"]`);
//             project.removeChild(tabContainer);
//             console.log(todo.parentNode.childNodes[3])
//             todo.childNodes.forEach((elem, index) => {
//                 // console.log(elem)
//                 elem.setAttribute('data', `${projectCreation.currentProject.id}-${index + 1}`);
//                 // elem.forEach(child => {
//                     // child.setAttribute('data', `${projectCreation.currentProject.id}-${index + 1}`);
//                     // console.log(child)
//                 // })
//             });
//         } else {
//             //         projectList.splice(0, 1);
//             //         currentProject = addProject();
//             //         projectList.push(currentProject)
//             //         currentProject.id = 1;
//             //         document.querySelector('.project-tab-title').value = '';
//         }
//         setStorage(projectCreation.projectList, projectCreation.currentProject)
//     })
// }

function addInputListeners(inputList) {
    let pList = projectCreation.projectList;
    let currProject = projectCreation.currentProject;
    let pListCurrTodo = pList[currProject.id - 1].todoList[currentTodo.id - 1];

    for (let i = 0; i < 5; i++) {
        inputList[i].addEventListener('input', () => {
            //change todo tab DOM
            if (inputList[0].value !== '') {
                document.querySelector(`.todo-tab-title[data="${currProject.id}-${pListCurrTodo.id}"]`).value = inputList[0].value;
            }
            if (inputList[2].value !== '') {
                document.querySelector(`.todo-tab-duedate[data="${currProject.id}-${pListCurrTodo.id}"]`)
                    .textContent = format(new Date(inputList[2].value), "dd-MM-yyyy");
                pListCurrTodo.dueDate = new Date();
            }
            //add input event listener for all todoDOM elements
            pListCurrTodo.title = inputList[0].value;
            pListCurrTodo.desc = inputList[1].value;
            pListCurrTodo.dueDate = inputList[2].value;
            pListCurrTodo.priority = inputList[3].value;
            pListCurrTodo.notes = inputList[4].value;
            setStorage(pList, currProject);
        })
    }
    //if checkboxArr exists, setup checkbox with values of checkboxArr
    if (currentTodo.checkboxArr.length) {
        setupExistingCheckbox(pListCurrTodo, currentTodo.checkboxArr);
    }

    inputList[5].addEventListener('click', () => {
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