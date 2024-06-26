import { format } from "date-fns";
import * as DOMhandler from './DOMhandler.js';
import styles from './style.css';

function addTodo(title = '', desc = '', dueDate = format(new Date(), "yyyy-MM-dd"),
    priority = '', notes = '', checkboxArr = [], status = false, id = 1) {
    const currProj = JSON.parse(localStorage.getItem('current_project'));
    if (currProj.todoList.length) {
        //find element with highest id, then add 1 for new id
        let sortedArr = currProj.todoList.sort((a, b) => a.id - b.id)
        id = (sortedArr.at(-1).id + 1);
    }
    return { title, desc, dueDate, priority, notes, checkboxArr, status, id };
}

function setStorage(parentProject, currProj, currTodo) {
    if (parentProject) {
        if (parentProject[0].id) {
            localStorage.setItem('project_list', JSON.stringify(parentProject));
        } else {
            localStorage.setItem('inbox_project', JSON.stringify(parentProject));
        }
        localStorage.setItem('parent_project', JSON.stringify(parentProject))
    }
    if (currProj) { localStorage.setItem('current_project', JSON.stringify(currProj)); }
    if (currTodo) { localStorage.setItem('current_todo', JSON.stringify(currTodo)); }
}

function setupNewTodo() {
    const currProj = JSON.parse(localStorage.getItem('current_project'));
    const parentProj = JSON.parse(localStorage.getItem('parent_project'));
    const currTodo = addTodo();
    parentProj.at(currProj.id - 1).todoList.push(currTodo);
    currProj.todoList.push(currTodo);
    const parentElem = document.getElementById(`todo-dest-${currProj.id}`)
    const todoTab = DOMhandler.addTodoTab('My todo', parentElem, undefined, undefined, currProj.id, currTodo.id);
    addTodoTabListeners(todoTab);
    setStorage(parentProj, currProj, currTodo);
    const todoInputs = DOMhandler.addTodoInputs();
    addInputListeners(todoInputs);
}

function setupExistingTodos(project) {
    if (project.todoList.length) {
        const parentElem = document.getElementById(`todo-dest-${project.id}`)
        project.todoList.forEach(todo => {
            let text;
            text = todo.title;
            if (!todo.title) {
                text = 'My todo';
            }
            const todoTab = DOMhandler.addTodoTab(text, parentElem, format(new Date(todo.dueDate), 'dd-MM'),
                todo.priority, project.id, todo.id, todo.status);
            addTodoTabListeners(todoTab);
        })
        const currTodo = JSON.parse(localStorage.getItem('current_todo'));
        const todoInputs = DOMhandler.addTodoInputs(currTodo.title, currTodo.desc, currTodo.dueDate,
            currTodo.priority, currTodo.notes, currTodo.checkboxArr, currTodo.status);
        addInputListeners(todoInputs);
    }
}

function addInputListeners(todoContainer) {
    const currProj = JSON.parse(localStorage.getItem('current_project'));
    if (currProj.todoList.length) {
        const parentProj = JSON.parse(localStorage.getItem('parent_project'));
        let currTodo = JSON.parse(localStorage.getItem('current_todo'));
        let projectTodo = parentProj.at(currProj.id - 1).todoList[currTodo.id - 1];
        for (let i = 0; i < 5; i++) {
            todoContainer.childNodes[i].addEventListener('input', () => {
                const currProj = JSON.parse(localStorage.getItem('current_project'));
                const parentProj = JSON.parse(localStorage.getItem('parent_project'));
                const currTodo = JSON.parse(localStorage.getItem('current_todo'));
                let projectTodo = parentProj.at(currProj.id - 1).todoList[currTodo.id - 1];
                // change todo tab DOM
                let todoTab = document.querySelector(`.todo-tab[data="${currProj.id}-${currTodo.id}"]`);
                todoTab.scrollIntoView();
                //potential optimization
                if (todoContainer.childNodes[0].value) {
                    todoTab.childNodes[0].childNodes[1].textContent = todoContainer.childNodes[0].value;
                }
                if (todoContainer.childNodes[2].value) {
                    todoTab.childNodes[2].textContent = format(new Date(todoContainer.childNodes[2].value), "dd-MM");
                }

                switch (todoContainer.childNodes[3].value.toLowerCase()) {
                    case 'low':
                        todoTab.style.setProperty('--priority-color', '#85ffc8');
                        break;
                    case 'medium':
                        todoTab.style.setProperty('--priority-color', '#fcbf5d');
                        break;
                    case 'high':
                        todoTab.style.setProperty('--priority-color', '#fc5151');
                        break;
                }

                //add input event listener for all todoDOM elements
                projectTodo.title = todoContainer.childNodes[0].value;
                projectTodo.desc = todoContainer.childNodes[1].value;
                projectTodo.dueDate = todoContainer.childNodes[2].value;
                projectTodo.priority = todoContainer.childNodes[3].value;
                projectTodo.notes = todoContainer.childNodes[4].value;
                setStorage(parentProj, parentProj.at(currProj.id - 1), projectTodo);
            })
        }
        const statusCheckboxLabel = todoContainer.childNodes[7];
        statusCheckboxLabel.addEventListener('input', () => {
            const currProj = JSON.parse(localStorage.getItem('current_project'));
            const parentProj = JSON.parse(localStorage.getItem('parent_project'));
            let currTodo = JSON.parse(localStorage.getItem('current_todo'));
            let projectTodo = parentProj.at(currProj.id - 1).todoList[currTodo.id - 1];
            let todoTab = document.querySelector(`.todo-tab[data="${currProj.id}-${currTodo.id}"]`);
            let todoTitle = todoTab.childNodes[0];
            const statusCheckbox = statusCheckboxLabel.childNodes[1];
            if (statusCheckbox.checked) {
                todoTitle.style.textDecoration = 'line-through';
                todoTab.style.color = 'white';
            } else {
                todoTitle.style.textDecoration = 'none';
                todoTab.style.color = 'none';
            }
            document.querySelector('.todo-container').childNodes.forEach(child => {
                child.disabled = statusCheckbox.checked;
                document.querySelector('.checkbox-container').hidden = statusCheckbox.checked;
                statusCheckbox.disabled = false;
            })
            projectTodo.status = statusCheckbox.checked;
            setStorage(parentProj, parentProj.at(currProj.id - 1), projectTodo);
        })

        const checkboxContainer = document.querySelector('.checkbox-container');
        checkboxLabelHandler(checkboxContainer, projectTodo.checkboxArr);
        todoContainer.childNodes[5].addEventListener('click', () => {
            const label = DOMhandler.addCheckbox(checkboxContainer);
            let id;
            if (projectTodo.checkboxArr.length) {
                let sortedArr = projectTodo.checkboxArr.sort((a, b) => a.id - b.id)
                id = (sortedArr.at(-1).id + 1);
            } else {
                id = 1;
            }
            projectTodo.checkboxArr
                .push({ title: label.childNodes[1].value, state: label.childNodes[0].checked, id: id });
            label.childNodes.forEach(child => {
                child.setAttribute('data', projectTodo.checkboxArr.at(-1).id);
            })
            label.addEventListener('input', () => {
                checkboxInputHandler(label)
            })
            const rmvCheckboxBtn = label.childNodes[2]
            rmvCheckboxBtn.addEventListener('click', () => {
                checkboxRemoveHandler(checkboxContainer, label);
            })
            setStorage(parentProj, parentProj.at(currProj.id - 1), projectTodo);
        });
    }
}

function checkboxInputHandler(label) {
    const currProj = JSON.parse(localStorage.getItem('current_project'));
    const parentProj = JSON.parse(localStorage.getItem('parent_project'));
    let currTodo = JSON.parse(localStorage.getItem('current_todo'));
    let projectTodo = parentProj.at(currProj.id - 1).todoList[currTodo.id - 1];
    //checkbox input element
    projectTodo.checkboxArr[label.childNodes[0]
        .getAttribute('data') - 1].state = label.childNodes[0].checked;
    // text input element
    projectTodo.checkboxArr[label.childNodes[1]
        .getAttribute('data') - 1].title = label.childNodes[1].value;
    setStorage(parentProj, parentProj.at(currProj.id - 1), projectTodo);
}

function checkboxRemoveHandler(checkboxContainer, label) {
    const rmvBtn = label.childNodes[2];
    const parentProj = JSON.parse(localStorage.getItem('parent_project'));
    const currProj = JSON.parse(localStorage.getItem('current_project'));
    const currTodo = JSON.parse(localStorage.getItem('current_todo'));
    const projectTodo = parentProj.at(currProj.id - 1).todoList.at(currTodo.id - 1);
    projectTodo.checkboxArr.splice(rmvBtn.getAttribute('data') - 1, 1);
    label = document.querySelector(`.checkbox-title[data="${rmvBtn.getAttribute('data')}"]`);
    label.parentNode.parentNode.removeChild(label.parentNode);
    projectTodo.checkboxArr.forEach((checkbox, index) => {
        checkbox.id = index + 1;
    })
    checkboxContainer.childNodes.forEach((container, index) => {
        container.childNodes.forEach(child => {
            child.setAttribute('data', index + 1);
        })
    })
    setStorage(parentProj, parentProj.at(currProj.id - 1), projectTodo);
}

function checkboxLabelHandler(checkboxContainer, checkboxArr) {
    // if (checkboxContainer.firstChild) {
    while (checkboxContainer.firstChild) {
        checkboxContainer.removeChild(checkboxContainer.firstChild);
    }
    // }

    checkboxArr.forEach((checkbox, index) => {
        const label = DOMhandler.addCheckbox(checkboxContainer, checkbox);
        label.childNodes.forEach(child => {
            child.setAttribute('data', index + 1)
            child.addEventListener('input', () => {
                checkboxInputHandler(label);
            })
        })
        const rmvCheckboxBtn = label.childNodes[2]
        rmvCheckboxBtn.addEventListener('click', () => {
            checkboxRemoveHandler(checkboxContainer, label);
        })
    })
    // checkboxContainer.childNodes.forEach((container, index) => {
    //     container.childNodes.forEach((child) => {
    //         child.setAttribute('data', index + 1)
    //         child.addEventListener('input', () => {
    //             checkboxInputHandler(container);
    //         })
    //     })
    //    
    // })
}

function addTodoTabListeners(tab) {
    //https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API#interfaces
    tab.addEventListener('dragstart', (ev) => {
        tab.style.backgroundColor = 'blue';
        ev.dataTransfer.clearData();
        ev.dataTransfer.setData("text/plain", tab.getAttribute('data'));
    });
    tab.addEventListener('dragend', () => {
        tab.style.backgroundColor = '';
    });
    const tabTitle = tab.childNodes[0].childNodes[1];
    const removeTab = tab.childNodes[1];
    removeTab.addEventListener('click', () => {
        let currProj = JSON.parse(localStorage.getItem('current_project'));
        const projList = JSON.parse(localStorage.getItem('project_list'));
        const inbox = JSON.parse(localStorage.getItem('inbox_project'));
        let parentProj = JSON.parse(localStorage.getItem('parent_project'));
        let currTodo = JSON.parse(localStorage.getItem('current_todo'));
        if (+tab.getAttribute('data')[0]) {
            parentProj = projList;
        } else {
            parentProj = inbox;
        }
        currProj = parentProj.at(tab.getAttribute('data')[0] - 1);
        currTodo = currProj.todoList.at(tab.getAttribute('data')[2] - 1);
        if (currProj.todoList.length > 1 || currProj.id) {
            currProj.todoList.splice(tab.getAttribute('data')[2] - 1, 1);
            currProj.todoList.forEach((todo, index) => {
                todo.id = index + 1;
                currTodo = todo;
            })
            let projectTodosContainer = document.getElementById(`todo-dest-${currProj.id}`);
            setStorage(parentProj, currProj, currTodo);
            const todo = DOMhandler.addTodoInputs(currTodo.title, currTodo.desc, currTodo.dueDate,
                currTodo.priority, currTodo.notes, currTodo.checkboxArr, currTodo.status);
            if (currProj.todoList.length) {
                addInputListeners(todo);
            } else {
                setStorage(inbox, inbox[0], inbox[0].todoList.at(-1));
                let currTodo = inbox[0].todoList.at(-1);
                let todo = DOMhandler.addTodoInputs(currTodo.title, currTodo.desc, currTodo.dueDate,
                    currTodo.priority, currTodo.notes, currTodo.checkboxArr, currTodo.status);
                addInputListeners(todo);
            }
            projectTodosContainer.removeChild(tab);
            projectTodosContainer.childNodes.forEach((elem, index) => {
                elem.setAttribute('data', `${currProj.id}-${index + 1}`);
                elem.id = `todo-src-${currProj.id}-${index + 1}`
            });
        } else {
            currProj.todoList.splice(0, 1);
            currTodo = addTodo();
            currProj.todoList.push(currTodo);
            addInputListeners(DOMhandler.addTodoInputs());
            currTodo.id = 1;
            tabTitle.value = '';
            setStorage(parentProj, currProj, currTodo);
        }
    })
    const wrapper = tab.childNodes[0].childNodes[0];
    wrapper.addEventListener('mouseover', () => {
        tabTitle.style.color = "white";
    })
    wrapper.addEventListener('mouseout', () => {
        tabTitle.style.color = "rgb(221, 221, 221)";
    })
    wrapper.addEventListener('click', () => {
        let currProj = JSON.parse(localStorage.getItem('current_project'));
        const projList = JSON.parse(localStorage.getItem('project_list'));
        const inbox = JSON.parse(localStorage.getItem('inbox_project'));
        let parentProj = JSON.parse(localStorage.getItem('parent_project'));
        let currTodo = JSON.parse(localStorage.getItem('current_todo'));
        if (+tab.getAttribute('data')[0]) {
            parentProj = projList;
        } else {
            parentProj = inbox;
        }
        currProj = parentProj.at(tab.getAttribute('data')[0] - 1);
        currTodo = currProj.todoList.at(tab.getAttribute('data')[2] - 1);
        setStorage(parentProj, currProj, currTodo);
        const todo = DOMhandler.addTodoInputs(currTodo.title, currTodo.desc, currTodo.dueDate, currTodo.priority,
            currTodo.notes, currTodo.checkboxArr, currTodo.status);
        addInputListeners(todo);
        const checkboxContainer = document.querySelector('.checkbox-container');
        checkboxLabelHandler(checkboxContainer, currTodo.checkboxArr);
    })
}

export { setupNewTodo, setupExistingTodos, addInputListeners }