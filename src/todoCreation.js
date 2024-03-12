import { format } from "date-fns";
import * as DOMhandler from './DOMhandler.js';

let currentTodo, checkboxIndex = 1, currTodo, todoTab;

function addTodo(title = '', desc = '', dueDate = format(new Date(), "yyyy-MM-dd"),
    priority = '', notes = '', checkboxArr = [], status = 'pending', id = 1) {
    const currProj = JSON.parse(localStorage.getItem('current_project'));
    if (currProj.todoList.length) {
        console.log('lawd')
        //find element with highest id, then add 1 for new id
        let sortedArr = currProj.todoList.sort((a, b) => a.id - b.id)
        id = (sortedArr.at(-1).id + 1);
    }
    return { title, desc, dueDate, priority, notes, checkboxArr, status, id };
}

function setStorage(projList, currProj, currTodo, inbox) {
    if (projList) { localStorage.setItem('project_list', JSON.stringify(projList)); }
    if (currProj) { localStorage.setItem('current_project', JSON.stringify(currProj)); }
    if (currTodo) { localStorage.setItem('current_todo', JSON.stringify(currTodo)); }
    if (inbox) { localStorage.setItem('inbox_project', JSON.stringify(inbox)) };
}

function setupNewTodo() {
    const inbox = JSON.parse(localStorage.getItem('inbox_project'));
    const currProj = JSON.parse(localStorage.getItem('current_project'));
    const projList = JSON.parse(localStorage.getItem('project_list'));
    currentTodo = addTodo();
    if (!currProj.id) { /*inbox project id = 0*/
        inbox[0].todoList.push(currentTodo);
        currProj.todoList.push(currentTodo)
        todoTab = DOMhandler.addTodoTab('', undefined, undefined, undefined, 0, currentTodo.id);
    } else {
        projList[currProj.id - 1].todoList.push(currentTodo);
        currProj.todoList.push(currentTodo);
        todoTab = DOMhandler.addTodoTab('', document.querySelector(`.project-todos-container[data="${currProj.id}"]`), undefined,
            undefined, currProj.id, currentTodo.id);
    }
    setStorage(projList, currProj, currentTodo, inbox);
    // addTodoTabListeners(todoTab)
    const todoInputs = DOMhandler.addTodoInputs();
    addInputListeners(todoInputs);
}

function setupExistingTodos(parent, parentElem) {
    parent.forEach(project => {
        if (parent[0].id) {
            parentElem = document.querySelector(`.project-todos-container[data="${project.id}"]`)
        }
        project.todoList.forEach(todo => {
            const todoTab = DOMhandler.addTodoTab(todo.title, parentElem, format(new Date(todo.dueDate), 'dd-MM-yyyy'),
                todo.priority, project.id, todo.id);
        })
    })
    currentTodo = JSON.parse(localStorage.getItem('current_todo'));
    const todoInputs = DOMhandler.addTodoInputs(currentTodo.title, currentTodo.desc, currentTodo.dueDate,
        currentTodo.priority, currentTodo.notes, currentTodo.checkboxArr);
    addInputListeners(todoInputs);
}

function addInputListeners(todoContainer) {
    const inbox = JSON.parse(localStorage.getItem('inbox_project'));
    const currentProj = JSON.parse(localStorage.getItem('current_project'));
    const projectList = JSON.parse(localStorage.getItem('project_list'));
    let projectTodo, todoTab;
    projectTodo = currentProj.todoList[currentTodo.id - 1];
    for (let i = 0; i < 5; i++) {
        todoContainer.childNodes[i].addEventListener('input', () => {
            // change todo tab DOM
            if (currentProj.id) {
                todoTab = document.querySelector(`.todo-tab[data="${currentProj.id}-${currentTodo.id}"]`);
            } else {
                todoTab = document.querySelector(`.todo-tab[data="0-${currentTodo.id}"]`);
            }
            //potential optimization
            if (todoContainer.childNodes[0].value) {
                todoTab.childNodes[1].childNodes[1].value = todoContainer.childNodes[0].value;
            }
            if (todoContainer.childNodes[2].value) {
                todoTab.childNodes[2].textContent = format(new Date(todoContainer.childNodes[2].value), "dd-MM-yyyy");
            }
            //add input event listener for all todoDOM elements
            projectTodo.title = todoContainer.childNodes[0].value;
            projectTodo.desc = todoContainer.childNodes[1].value;
            projectTodo.dueDate = todoContainer.childNodes[2].value;
            projectTodo.priority = todoContainer.childNodes[3].value;
            projectTodo.notes = todoContainer.childNodes[4].value;
            if (projectList) { projectList[currentProj.id - 1].todoList[currentTodo.id - 1] = projectTodo; }
            else { inbox[0].todoList[currentTodo.id - 1] = projectTodo; }
            setStorage(projectList, currentProj, projectTodo, inbox);
        })
    }
    const checkboxContainer = document.querySelector('.checkbox-container');
    if (checkboxContainer) {
        while (checkboxContainer.firstChild) {
            checkboxContainer.removeChild(checkboxContainer.firstChild)
        }
    }

    // if checkboxArr exists, setup checkbox with values of checkboxArr
    if (projectTodo.checkboxArr.length) {
        projectTodo.checkboxArr.forEach(checkbox => {
            const label = DOMhandler.addCheckbox(checkboxContainer, checkbox);
            label.childNodes.forEach(child => {
                child.setAttribute('data', checkbox.id);
                child.addEventListener('input', () => {
                    //checkbox input element
                    projectTodo.checkboxArr[label.childNodes[0]
                        .getAttribute('data') - 1].state = label.childNodes[0].checked;
                    // text input element
                    projectTodo.checkboxArr[label.childNodes[1]
                        .getAttribute('data') - 1].title = label.childNodes[1].value;
                    if (projectList) { projectList[currentProj.id - 1].todoList[currentTodo.id - 1] = projectTodo; }
                    else { inbox[0].todoList[currentTodo.id - 1] = projectTodo; }
                    setStorage(projectList, currentProj, projectTodo, inbox);
                });
            })
            checkboxIndex++;
        })
    }

    todoContainer.childNodes[5].addEventListener('click', () => {
        const label = DOMhandler.addCheckbox(checkboxContainer);
        label.childNodes.forEach(child => {
            child.setAttribute('data', checkboxIndex);
        })
        projectTodo.checkboxArr
            .push({ title: label.childNodes[1].value, state: label.childNodes[0].checked, id: checkboxIndex });
        if (projectList) { projectList[currentProj.id - 1].todoList[currentTodo.id - 1] = projectTodo; }
        else { inbox[0].todoList[currentTodo.id - 1] = projectTodo; }
        setStorage(projectList, currentProj, projectTodo, inbox);
        label.childNodes.forEach(child => {
            child.addEventListener('input', () => {
                //checkbox input element
                projectTodo.checkboxArr[label.childNodes[0]
                    .getAttribute('data') - 1].state = label.childNodes[0].checked;
                // text input element
                projectTodo.checkboxArr[label.childNodes[1]
                    .getAttribute('data') - 1].title = label.childNodes[1].value;
                if (projectList) { projectList[currentProj.id - 1].todoList[currentTodo.id - 1] = projectTodo; }
                else { inbox[0].todoList[currentTodo.id - 1] = projectTodo; }
                setStorage(projectList, currentProj, projectTodo, inbox);
            });
        })
        checkboxIndex++;
    });
}

// function addTodoTabListeners(tab) {
//https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/setData
//https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API#interfaces
// tab[0].addEventListener('dragstart', (ev) => {
//     console.log('dragStart')
//     tab[0].style.backgroundColor = 'blue';
//     ev.dataTransfer.clearData();
//     ev.dataTransfer.setData("text/plain", ev.target.id);
// })
// tab[0].addEventListener('dragend', () => {
//     console.log('dragEnd');
//     tab[0].style.backgroundColor = '';
// })
// const wrapper = tab.childNodes[1]
// const removeTab = tab[3];
// const editTab = tab[2];
// wrapper.addEventListener('click', () => {
//     currentTodo = tab.getAttribute('data')[2];
//     setStorage('', '', currentTodo);
//     console.log(currentTodo)
// })
// removeTab.addEventListener('click', () => {
//     const projList = projectCreation.projectList;
//     const currProj = projectCreation.currentProject;
//     if (projList[currProj.id - 1].todoList.length > 1) {
//         projList[currProj.id - 1].todoList.splice(removeTab.getAttribute('data')[2] - 1, 1);
//         projList[currProj.id - 1].todoList.forEach((todo, index) => {
//             todo.id = index + 1;
//         })
//         const todoContainer = document.querySelector(`.todo-tab-wrapper[data="${currProj.id}"]`);
//         todoContainer.removeChild(tab[0]);
//         todoContainer.childNodes.forEach((elem, index) => {
//             elem.setAttribute('data', `${currProj.id}-${index + 1}`);
//             elem.childNodes.forEach(child => {
//                 child.setAttribute('data', `${currProj.id}-${index + 1}`);
//                 elem.childNodes[0].childNodes.forEach(child => {
//                     child.setAttribute('data', `${currProj.id}-${index + 1}`);
//                 })
//             })
//         });

//         currentTodo = projList[currProj.id - 1].todoList.at(-1);

//     } else {
//         projList[currProj.id - 1].todoList.splice(0, 1);
//         currentTodo = addTodo();
//         currentTodo.id = 1;
//         projList[currProj.id - 1].todoList.push(currentTodo);
//         DOMhandler.clearDOM('todo');
//         const todoDOM = DOMhandler.addTodoDOM();
//         document.querySelector(`.todo-tab-title[data="${currProj.id}-${currentTodo.id}"]`).value = 'My todo';
//         document.querySelector(`.todo-tab-duedate[data="${currProj.id}-${currentTodo.id}"]`).textContent = format(new Date(), "dd-MM-yyyy");
//         addInputListeners(todoDOM);
//     }
//     setStorage(projectCreation.projectList, projectCreation.currentProject)
// })
// }

export { setupNewTodo, setupExistingTodos, currentTodo }