import { format } from "date-fns";
import * as DOMhandler from './DOMhandler.js';

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
    const todoTab = DOMhandler.addTodoTab('', parentElem, undefined, undefined, currProj.id, currTodo.id);
    addTodoTabListeners(todoTab);
    setStorage(parentProj, currProj, currTodo);
    const todoInputs = DOMhandler.addTodoInputs();
    addInputListeners(todoInputs);
}

function setupExistingTodos(project) {
    if (project.todoList.length) {
        const parentElem = document.getElementById(`todo-dest-${project.id}`)
        project.todoList.forEach(todo => {
            const todoTab = DOMhandler.addTodoTab(todo.title, parentElem, format(new Date(todo.dueDate), 'dd-MM-yyyy'),
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
                setStorage(parentProj, parentProj.at(currProj.id - 1), projectTodo);
            })
        }

        const checkboxContainer = document.querySelector('.checkbox-container');
        checkboxLabelHandler(checkboxContainer);
        todoContainer.childNodes[5].addEventListener('click', () => {
            const label = DOMhandler.addCheckbox(checkboxContainer);
            projectTodo.checkboxArr
                .push({ title: label.childNodes[1].value, state: label.childNodes[0].checked });
            setStorage(parentProj, parentProj.at(currProj.id - 1), projectTodo);
            checkboxLabelHandler(checkboxContainer);
        });
    }
}

function checkboxInputHandler(label, parentProj, projectTodo, currProj) {
    //checkbox input element
    projectTodo.checkboxArr[label.childNodes[0]
        .getAttribute('data') - 1].state = label.childNodes[0].checked;
    // text input element
    projectTodo.checkboxArr[label.childNodes[1]
        .getAttribute('data') - 1].title = label.childNodes[1].value;
    setStorage(parentProj, parentProj.at(currProj.id - 1), projectTodo);
}

function checkboxLabelHandler(checkboxContainer) {
    checkboxContainer.childNodes.forEach((label, index) => {
        label.childNodes.forEach(child => {
            child.setAttribute('data', index + 1);
            child.addEventListener('input', () => {
                const currProj = JSON.parse(localStorage.getItem('current_project'));
                const parentProj = JSON.parse(localStorage.getItem('parent_project'));
                const currTodo = JSON.parse(localStorage.getItem('current_todo'));
                let projectTodo = parentProj.at(currProj.id - 1).todoList[currTodo.id - 1];
                checkboxInputHandler(label, parentProj, projectTodo, currProj);
            })
        })
    })
}

function addTodoTabListeners(tab) {
    const statusCheckbox = tab.childNodes[0];
    statusCheckbox.addEventListener('input', () => {
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
        let projectTodo = parentProj.at(currProj.id - 1).todoList[currTodo.id - 1];
        projectTodo.status = statusCheckbox.checked;
        document.querySelector('.todo-container').childNodes.forEach(child => {
            child.disabled = statusCheckbox.checked;
            document.querySelector('.checkbox-container').hidden = statusCheckbox.checked;
        })
        setStorage(parentProj, parentProj.at(currProj.id - 1), projectTodo);
        addInputListeners(DOMhandler.addTodoInputs(projectTodo.title, projectTodo.desc,
            projectTodo.dueDate, projectTodo.priority, projectTodo.notes, projectTodo.checkboxArr, projectTodo.status))
    })
    //https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API#interfaces
    tab.addEventListener('dragstart', (ev) => {
        tab.style.backgroundColor = 'blue';
        ev.dataTransfer.clearData();
        ev.dataTransfer.setData("text/plain", tab.getAttribute('data'));
    });
    tab.addEventListener('dragend', () => {
        tab.style.backgroundColor = '';
    });
    const tabTitle = tab.childNodes[1].childNodes[1];
    const removeTab = tab.childNodes[3]
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
    const wrapper = tab.childNodes[1].childNodes[0];
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
        checkboxLabelHandler(checkboxContainer);
    })
}

export { setupNewTodo, setupExistingTodos, addInputListeners }