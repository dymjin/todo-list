import { format } from "date-fns";
import * as DOMhandler from './DOMhandler.js';

let currentTodo, checkboxIndex = 1;

function addTodo(title = '', desc = '', dueDate = format(new Date(), "yyyy-MM-dd"),
    priority = '', notes = '', checkboxArr = [], status = 'pending', id = 1) {
    const currProj = JSON.parse(localStorage.getItem('current_project'));
    const inboxArr = JSON.parse(localStorage.getItem('inbox_todos'));
    if (inboxArr && !currProj) {
        if (inboxArr[0].todoList.length) {
            //find element with highest id, then add 1 for new id
            let sortedArr = inboxArr[0].todoList.sort((a, b) => a.id - b.id)
            id = (sortedArr.at(-1).id + 1);
        }
    }
    else {
        if (currProj.todoList.length) {
            //find element with highest id, then add 1 for new id
            let sortedArr = currProj.todoList.sort((a, b) => a.id - b.id)
            id = (sortedArr.at(-1).id + 1);
        }
    }
    return { title, desc, dueDate, priority, notes, checkboxArr, status, id };
}

function getStorage() {
    let projList = JSON.parse(localStorage.getItem('project_list'));
    let currProj = JSON.parse(localStorage.getItem('current_project'));
    return [projList, currProj];
}

function setupNewTodo(parent) {
    currentTodo = addTodo();
    if (parent[0].id === 0) {
        parent[0].todoList.push(currentTodo);
        localStorage.setItem('inbox_todos', JSON.stringify(parent));
        localStorage.setItem('current_todo', JSON.stringify(currentTodo));
        const todoTab = DOMhandler.addTodoTab('', undefined, undefined, undefined, 0, currentTodo.id);
    } else {
        parent[getStorage()[1].id - 1].todoList.push(currentTodo);
        setStorage(parent, getStorage()[1], currentTodo);
        const todoTab = DOMhandler.addTodoTab('', document.querySelector(`.project-todos-container[data="${getStorage()[1].id}"]`),
            undefined, undefined, getStorage()[1].id, currentTodo.id);
    }
    const todoInputs = DOMhandler.addTodoInputs();
    // addTodoTabListeners(todoTab)
    addInputListeners(todoInputs);
}

function setupExistingTodos(project) {
    const inboxTodos = JSON.parse(localStorage.getItem('inbox_todos'));
    const projectList = getStorage()[0];
    const currTodo = JSON.parse(localStorage.getItem('current_todo'));
    DOMhandler.clearTabDOM('todo', '', 'inbox');
    if (project) {
        // DOMhandler.clearTabDOM('todo', getStorage()[0].id, 'project_todo');
        projectList[getStorage()[1].id - 1].todoList.forEach(todo => {
            DOMhandler.addTodoTab(todo.title,
                document.querySelector(`.project-todos-container[data="${project.id}"]`),
                todo.dueDate, todo.priority, project.id, todo.id);
            // addTodoTabListeners(todoTab);
        })
    }
    inboxTodos[0].todoList.forEach(todo => {
        DOMhandler.addTodoTab(todo.title, undefined,
            undefined, todo.priority, 0, todo.id);
        // addTodoTabListeners(todoTab);
    })
    const todoInputs = DOMhandler.addTodoInputs(currTodo.title, currTodo.desc, currTodo.dueDate,
        currTodo.priority, currTodo.notes, currTodo.checkboxArr);
    addInputListeners(todoInputs);
}

function setStorage(projList, currProj, currTodo) {
    localStorage.setItem('project_list', JSON.stringify(projList));
    localStorage.setItem('current_project', JSON.stringify(currProj));
    localStorage.setItem('current_todo', JSON.stringify(currTodo));
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
    const inboxTodos = JSON.parse(localStorage.getItem('inbox_todos'));
    const currentTodo = JSON.parse(localStorage.getItem('current_todo'));
    let pList, currProj, currTodo;
    if (inboxTodos) {
        pList = inboxTodos;
        currProj = inboxTodos[0];
        currTodo = pList[0].todoList[JSON.parse(localStorage.getItem('current_todo')).id - 1];
    } else {
        // pList = parent;
        // currProj = getStorage()[1];
        // currTodo = pList[currProject.id - 1].todoList[JSON.parse(localStorage.getItem('current_todo')).id - 1];
    }
    for (let i = 0; i < 5; i++) {
        todoContainer.childNodes[i].addEventListener('input', () => {
            // change todo tab DOM
            const todoTab = document.querySelector(`.todo-tab[data="0-${currentTodo.id}"]`);
            if (todoContainer.childNodes[0].value !== '') {
                todoTab.childNodes[0].childNodes[1].value = todoContainer.childNodes[0].value;
            }
            if (todoContainer.childNodes[2].value !== '') {
                todoTab.childNodes[1].textContent = format(new Date(todoContainer.childNodes[2].value), "dd-MM-yyyy");
            }
            //add input event listener for all todoDOM elements
            currTodo.title = todoContainer.childNodes[0].value;
            currTodo.desc = todoContainer.childNodes[1].value;
            currTodo.dueDate = todoContainer.childNodes[2].value;
            currTodo.priority = todoContainer.childNodes[3].value;
            currTodo.notes = todoContainer.childNodes[4].value;
            if (inboxTodos) {
                localStorage.setItem('inbox_todos', JSON.stringify(pList));
                localStorage.setItem('current_todo', JSON.stringify(currTodo));
            } else {
                // setStorage();
            }
        })
    }
    //if checkboxArr exists, setup checkbox with values of checkboxArr
    if (currentTodo.checkboxArr.length) {
        setupExistingCheckbox(currTodo, currentTodo.checkboxArr, inboxTodos);
    }

    todoContainer.childNodes[5].addEventListener('click', () => {
        setupNewCheckbox(currTodo, inboxTodos);
    });
}

function setupExistingCheckbox(currTodo, currentCheckboxArr, parent) {
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
            labelChildren[i].setAttribute('data', checkbox.id);
        }
        addCheckboxListeners(currTodo, labelChildren, parent);
        checkboxIndex++;
    })
}

function setupNewCheckbox(currTodo, parent) {
    const checkboxContainer = document.querySelector('.checkbox-container');
    const label = DOMhandler.addCheckbox(checkboxContainer);
    const labelChildren = label.childNodes;
    for (let i = 0; i < 2; i++) {
        // labelChildren[i].setAttribute('data', `${projectCreation.currentProject.id}-${currentTodo.id}-${checkboxIndex}`);
        labelChildren[i].setAttribute('data', checkboxIndex);
    }
    //add checkbox obj to the currentTodo's checkboxArr
    currTodo.checkboxArr
        .push({ title: label.children[1].value, state: label.children[0].checked, id: checkboxIndex });
    if (parent) {
        localStorage.setItem('inbox_todos', JSON.stringify(parent));
        localStorage.setItem('current_todo', JSON.stringify(currTodo));
    } else {
        // setStorage();
    }
    addCheckboxListeners(currTodo, labelChildren, parent);
    checkboxIndex++;
}

function addCheckboxListeners(currTodo, labelChildren, parent) {
    for (let i = 0; i < 2; i++) {
        labelChildren[i].addEventListener('input', () => {
            // checkbox input element
            currTodo.checkboxArr[labelChildren[0]
                .getAttribute('data') - 1].state = labelChildren[0].checked;
            // text input element
            currTodo.checkboxArr[labelChildren[1]
                .getAttribute('data') - 1].title = labelChildren[1].value;
            if (parent) {
                localStorage.setItem('inbox_todos', JSON.stringify(parent));
                localStorage.setItem('current_todo', JSON.stringify(currTodo));
            } else {
                // setStorage();
            }
        })
    }
}


export { setupNewTodo, setupExistingTodos, currentTodo }