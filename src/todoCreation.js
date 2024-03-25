import { format } from "date-fns";
import * as DOMhandler from './DOMhandler.js';

let currentTodo, checkboxIndex = 1, todoTab;

function addTodo(title = '', desc = '', dueDate = format(new Date(), "yyyy-MM-dd"),
    priority = '', notes = '', checkboxArr = [], status = 'pending', id = 1) {
    const currProj = JSON.parse(localStorage.getItem('current_project'));
    if (currProj.todoList.length) {
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
        addTodoTabListeners(todoTab);
    } else {
        projList[currProj.id - 1].todoList.push(currentTodo);
        currProj.todoList.push(currentTodo);
        todoTab = DOMhandler.addTodoTab('', document.querySelector(`.project-todos-container[data="${currProj.id}"]`), undefined,
            undefined, currProj.id, currentTodo.id);
        addTodoTabListeners(todoTab);
    }
    setStorage(projList, currProj, currentTodo, inbox);
    const todoInputs = DOMhandler.addTodoInputs();
    addInputListeners(todoInputs);
}

function setupExistingTodos(parent, project, parentElem) {
    if (project.todoList.length) {
        if (parent[0].id) {
            parentElem = document.querySelector(`.project-todos-container[data="${project.id}"]`)
            project.todoList.forEach(todo => {
                todoTab = DOMhandler.addTodoTab(todo.title, parentElem, format(new Date(todo.dueDate), 'dd-MM-yyyy'),
                    todo.priority, project.id, todo.id);
                addTodoTabListeners(todoTab);
            })
        } else {
            project.todoList.forEach(todo => {
                todoTab = DOMhandler.addTodoTab(todo.title, document.querySelector('.inbox-todos'), format(new Date(todo.dueDate), 'dd-MM-yyyy'),
                    todo.priority, project.id, todo.id);
                addTodoTabListeners(todoTab);
            })
        }
        currentTodo = JSON.parse(localStorage.getItem('current_todo'));
        const todoInputs = DOMhandler.addTodoInputs(currentTodo.title, currentTodo.desc, currentTodo.dueDate,
            currentTodo.priority, currentTodo.notes, currentTodo.checkboxArr);
        addInputListeners(todoInputs);
    }
}

function addInputListeners(todoContainer) {
    const inbox = JSON.parse(localStorage.getItem('inbox_project'));
    const currentProj = JSON.parse(localStorage.getItem('current_project'));
    const projectList = JSON.parse(localStorage.getItem('project_list'));
    let projectTodo, todoTab;
    currentTodo = JSON.parse(localStorage.getItem('current_todo'));
    projectTodo = currentProj.todoList[currentTodo.id - 1];
    if (currentProj.todoList.length) {
        for (let i = 0; i < 5; i++) {
            todoContainer.childNodes[i].addEventListener('input', () => {
                const inbox = JSON.parse(localStorage.getItem('inbox_project'));
                const currentProj = JSON.parse(localStorage.getItem('current_project'));
                const projectList = JSON.parse(localStorage.getItem('project_list'));
                if (currentProj.todoList.length) {
                    currentTodo = JSON.parse(localStorage.getItem('current_todo'));
                    projectTodo = currentProj.todoList[currentTodo.id - 1];
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
                    if (currentProj.id) { projectList[currentProj.id - 1].todoList[currentTodo.id - 1] = projectTodo; }
                    else { inbox[0].todoList[currentTodo.id - 1] = projectTodo; }
                    setStorage(projectList, currentProj, projectTodo, inbox);
                }
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
                        if (currentProj.id) { projectList[currentProj.id - 1].todoList[currentTodo.id - 1] = projectTodo; }
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
            if (currentProj.id) { projectList[currentProj.id - 1].todoList[currentTodo.id - 1] = projectTodo; }
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
                    if (currentProj.id) { projectList[currentProj.id - 1].todoList[currentTodo.id - 1] = projectTodo; }
                    else { inbox[0].todoList[currentTodo.id - 1] = projectTodo; }
                    setStorage(projectList, currentProj, projectTodo, inbox);
                });
            })
            checkboxIndex++;
        });
    }
}

function addTodoTabListeners(tab) {
    //https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API#interfaces
    tab.addEventListener('dragstart', (ev) => {
        console.log('dragStart')
        tab.style.backgroundColor = 'blue';
        ev.dataTransfer.clearData();
        ev.dataTransfer.setData("text/plain", tab.getAttribute('data'));
    });
    tab.addEventListener('dragend', () => {
        console.log('dragEnd');
        tab.style.backgroundColor = '';
    });
    const tabTitle = tab.childNodes[1].childNodes[1];
    const removeTab = tab.childNodes[3]
    removeTab.addEventListener('click', () => {
        let currProj;
        const projList = JSON.parse(localStorage.getItem('project_list'));
        const inbox = JSON.parse(localStorage.getItem('inbox_project'));
        // addInputListeners(DOMhandler.addTodoInputs());
        if (+tab.getAttribute('data')[0]) {
            currProj = projList[tab.getAttribute('data')[0] - 1];
        } else {
            currProj = inbox[0];
        }
        if (currProj.todoList.length > 1) {
            currProj.todoList.splice(tab.getAttribute('data')[2] - 1, 1);
            currProj.todoList.forEach((todo, index) => {
                todo.id = index + 1;
                currentTodo = todo;
            })
            let projectTodosContainer;
            if (currProj.id) {
                projList[currProj.id - 1].todoList = currProj.todoList;
                projectTodosContainer = document.querySelector(`.project-todos-container[data="${currProj.id}"]`);
            } else {
                inbox[0].todoList = currProj.todoList;
                projectTodosContainer = document.querySelector('.inbox-todos')
            }
            setStorage(projList, currProj, currentTodo, inbox);
            addInputListeners(DOMhandler.addTodoInputs(currentTodo.title, currentTodo.desc, currentTodo.dueDate,
                currentTodo.priority, currentTodo.notes, currentTodo.checkboxArr))
            projectTodosContainer.removeChild(tab);
            projectTodosContainer.childNodes.forEach((elem, index) => {
                elem.setAttribute('data', `${currProj.id}-${index + 1}`);
            });
        } else {
            currProj.todoList.splice(0, 1);
            currentTodo = addTodo();
            currProj.todoList.push(currentTodo);
            if (currProj.id) {
                projList[currProj.id - 1].todoList = currProj.todoList;
            } else {
                inbox[0].todoList = currProj.todoList;
            }
            currentTodo.id = 1;
            tabTitle.value = '';
            setStorage(projList, currProj, currentTodo, inbox);
        }
    })
    const wrapper = tab.childNodes[1].childNodes[0];
    wrapper.addEventListener('click', () => {
        let currProj = JSON.parse(localStorage.getItem('current_project'));
        const projList = JSON.parse(localStorage.getItem('project_list'));
        const inbox = JSON.parse(localStorage.getItem('inbox_project'));
        if (+tab.getAttribute('data')[0]) {
            currProj = projList[tab.getAttribute('data')[0] - 1];
        } else {
            currProj = inbox[0];
        }
        currentTodo = currProj.todoList[tab.getAttribute('data')[2] - 1];
        setStorage('', currProj, currentTodo);
        let currTodo = JSON.parse(localStorage.getItem('current_todo'));
        const inputs = DOMhandler.addTodoInputs(currTodo.title, currTodo.desc, currTodo.dueDate, currTodo.priority, currTodo.notes);
        addInputListeners(inputs);
    })
}

export { setupNewTodo, setupExistingTodos, addInputListeners }