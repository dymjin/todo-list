import * as DOMhandler from './DOMhandler.js';
import * as todoCreation from './todoCreation.js';

function addProject(title = '', todoList = [], id = 1) {
    const storedProjectList = JSON.parse(localStorage.getItem('project_list'));
    if (storedProjectList) {
        let sortedArr = storedProjectList.sort((a, b) => a.id - b.id);
        id = (sortedArr[sortedArr.length - 1].id + 1);
    }
    return { title, todoList, id };
}

function initInbox() {
    const inbox = [];
    const currProj = addProject('inbox', [], 0);
    inbox.push(currProj);
    setStorage(inbox, currProj)
}

if (!localStorage.getItem('inbox_project')) {
    initInbox();
    todoCreation.setupNewTodo();
} else {
    const inbox = JSON.parse(localStorage.getItem('inbox_project'));
    todoCreation.setupExistingTodos(inbox[0]);
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

function setupNewProject() {
    let projList = JSON.parse(localStorage.getItem('project_list'));
    const currProj = addProject();
    projList ? 0 : projList = [];
    projList.push(currProj);
    setStorage(projList, currProj);
    const projectTab = DOMhandler.addProjectTab('', currProj.id);
    addTabListeners(projectTab);
    todoCreation.setupNewTodo();
}

function setupExistingProjects() {
    const projList = JSON.parse(localStorage.getItem('project_list'));
    projList.forEach(project => {
        const projectTab = DOMhandler.addProjectTab(project.title, project.id);
        //project tab functionality
        addTabListeners(projectTab);
        if (project.todoList.length) {
            todoCreation.setupExistingTodos(project);
        }
    });
}

function dropHandler(ev, todoContainer) {
    ev.preventDefault();
    let srcParent, destParent, transferTodo;
    let todoContainerIndex = todoContainer.getAttribute('data');

    const projList = JSON.parse(localStorage.getItem('project_list'));
    const inbox = JSON.parse(localStorage.getItem('inbox_project'));
    let parentProj = JSON.parse(localStorage.getItem('parent_project'));

    const data = ev.dataTransfer.getData("text");
    let currProjIndex = data[0];

    if (todoContainerIndex !== currProjIndex) { /* make sure srcParent index isn't the same as destParent index */
        if (+currProjIndex) {
            parentProj = projList;
            if (+todoContainerIndex) {
                destParent = projList;
            } else {
                destParent = inbox;
            }
        } else {
            parentProj = inbox;
            destParent = projList;
        }
        srcParent = parentProj;
    
        transferTodo = srcParent.at(currProjIndex - 1).todoList.at(data[2] - 1);
        srcParent.at(currProjIndex - 1).todoList.splice(transferTodo.id - 1, 1);

        destParent.at(todoContainerIndex - 1).todoList.push(transferTodo);
        destParent.at(todoContainerIndex - 1).todoList.forEach((todo, index) => {
            todo.id = index + 1;
        })
        const source = document.getElementById(`todo-src-${data}`);
        todoContainer.appendChild(source);

        todoContainer.childNodes.forEach((elem, index) => {
            elem.setAttribute('data', `${todoContainerIndex}-${index + 1}`);
            elem.id = `todo-src-${todoContainerIndex}-${index + 1}`;
        });

        if (srcParent.at(currProjIndex - 1).todoList.length) {
            srcParent.at(currProjIndex - 1).todoList.forEach((todo, index) => {
                todo.id = index + 1;
            })
            let srcParentDOM;
            srcParentDOM = document.getElementById(`todo-dest-${currProjIndex}`);
            srcParentDOM.childNodes.forEach((elem, index) => {
                elem.setAttribute('data', `${currProjIndex}-${index + 1}`);
                elem.id = `todo-src-${currProjIndex}-${index + 1}`;
            });
        }
        setStorage(destParent, destParent.at(todoContainerIndex - 1), destParent.at(todoContainerIndex - 1).todoList.at(-1));
        localStorage.setItem('project_list', JSON.stringify(projList));
        localStorage.setItem('inbox_project', JSON.stringify(inbox));
    }
}

const inboxDOM = document.querySelector('.inbox-todos');
inboxDOM.addEventListener('drop', (ev) => {
    dropHandler(ev, inboxDOM);
})
inboxDOM.addEventListener('dragover', (ev) => {
    console.log('dragOver');
    ev.preventDefault();
})
function addTabListeners(tab) {
    const todoContainer = tab.childNodes[3];
    //https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API#interfaces
    todoContainer.addEventListener('dragover', (ev) => {
        console.log('dragOver');
        ev.preventDefault();
    })
    todoContainer.addEventListener('drop', (ev) => {
        dropHandler(ev, todoContainer);
    })

    const tabContainer = tab;
    const titleWrapper = tab.childNodes[0].childNodes[0];
    const tabTitle = tab.childNodes[0].childNodes[1];
    const editTab = tab.childNodes[1];
    const removeTab = tab.childNodes[2];
    removeTab.addEventListener('click', () => {
        let currProj = JSON.parse(localStorage.getItem('current_project'));
        const projList = JSON.parse(localStorage.getItem('project_list'));
        const inbox = JSON.parse(localStorage.getItem('inbox_project'));
        todoCreation.addInputListeners(DOMhandler.addTodoInputs());
        projList.splice(currProj.id - 1, 1);
        projList.forEach((project, index) => {
            project.id = index + 1;
            currProj = project;
        })
        if (!projList.length) {
            localStorage.removeItem('project_list');
            setStorage(inbox, inbox[0], inbox[0].todoList.at(-1));
        } else {
            setStorage(projList, currProj, currProj.todoList.at(-1));
        }
        const projectTabsContainer = document.querySelector('.project-tabs-container');
        projectTabsContainer.removeChild(tabContainer);
        projectTabsContainer.childNodes.forEach((elem, index) => {
            elem.setAttribute('data', index + 1);
            elem.childNodes[3].setAttribute('data', index + 1);
            elem.childNodes[3].id = `todo-dest-${index + 1}`;
            elem.childNodes[3].childNodes.forEach((child, index2) => {
                child.setAttribute('data', `${index + 1}-${index2 + 1}`)
            })
        });
    })
    editTab.addEventListener('click', () => {
        tabTitle.disabled = false;
        tabTitle.focus();
    })
    tabTitle.onblur = () => { tabTitle.disabled = true; };
    titleWrapper.addEventListener('click', () => {
        const projList = JSON.parse(localStorage.getItem('project_list'));
        let currProj = projList[tabContainer.getAttribute('data') - 1];
        if (currProj.todoList.length) {
            let todo = currProj.todoList.at(-1);
            todoCreation.addInputListeners(DOMhandler.addTodoInputs(todo.title, todo.desc, todo.dueDate,
                todo.priority, todo.notes, todo.checkboxArr, todo.status));
        } else {
            // todoCreation.addInputListeners(DOMhandler.addTodoInputs())
            DOMhandler.addTodoInputs();
        }
        setStorage(projList, currProj, currProj.todoList.at(-1));
    })
    tabTitle.addEventListener('input', () => {
        const projList = JSON.parse(localStorage.getItem('project_list'));
        let currProj = projList[tabContainer.getAttribute('data') - 1];
        currProj.title = tabTitle.value;
        projList[currProj.id - 1].title = tabTitle.value;
        setStorage(projList, currProj);
    })
}

export { setupNewProject, setupExistingProjects };