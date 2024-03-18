import * as DOMhandler from './DOMhandler.js';
import * as todoCreation from './todoCreation.js';

let projectList = [], currentProject, inboxArr = [];

function addProject(title = '', todoList = [], id = 1) {
    const storedProjectList = JSON.parse(localStorage.getItem('project_list'));
    if (storedProjectList) {
        let sortedArr = storedProjectList.sort((a, b) => a.id - b.id);
        id = (sortedArr[sortedArr.length - 1].id + 1);
    }
    return { title, todoList, id };
}

function initInbox() {
    let currentProject = addProject('inbox', [], 0);
    inboxArr.push(currentProject);
    localStorage.setItem('inbox_project', JSON.stringify(inboxArr));
    localStorage.setItem('current_project', JSON.stringify(currentProject))
}

if (!localStorage.getItem('inbox_project')) {
    initInbox();
    todoCreation.setupNewTodo();
} else {
    const inbox = JSON.parse(localStorage.getItem('inbox_project'));
    todoCreation.setupExistingTodos(inbox, inbox[0],
        document.querySelector('.inbox'));
}

function setStorage(projList, currProj) {
    localStorage.setItem('project_list', JSON.stringify(projList));
    localStorage.setItem('current_project', JSON.stringify(currProj));
}

function setupNewProject() {
    const projList = JSON.parse(localStorage.getItem('project_list'));
    currentProject = addProject();
    if (projList) {
        projList.push(currentProject);
        setStorage(projList, currentProject);
    } else {
        projectList.push(currentProject);
        setStorage(projectList, currentProject);
    }
    const projectTab = DOMhandler.addProjectTab('', currentProject.id);
    addTabListeners(projectTab);
    todoCreation.setupNewTodo();
}

function setupExistingProjects(projList) {
    projList.forEach(project => {
        //copy provided project list to projectList
        projectList.push(project);
        const projectTab = DOMhandler.addProjectTab(project.title, project.id);
        currentProject = project;
        //project tab functionality
        addTabListeners(projectTab);
        if (project.todoList.length) {
            todoCreation.setupExistingTodos(projList, project);
        }
    });
}

function addTabListeners(tab) {
    const todoContainer = tab.childNodes[3];
    const tabContainer = tab;
    const titleWrapper = tab.childNodes[0].childNodes[0];
    const tabTitle = tab.childNodes[0].childNodes[1];
    const editTab = tab.childNodes[1];
    const removeTab = tab.childNodes[2];
    removeTab.addEventListener('click', () => {
        currentProject = JSON.parse(localStorage.getItem('current_project'));
        projectList = JSON.parse(localStorage.getItem('project_list'));
        todoCreation.addInputListeners(DOMhandler.addTodoInputs())
        if (projectList.length > 1) {
            projectList.splice(tab.getAttribute('data') - 1, 1);
            projectList.forEach((project, index) => {
                project.id = index + 1;
                currentProject = project;
            })
            setStorage(projectList, currentProject);
            localStorage.setItem('current_todo', JSON.stringify(currentProject.todoList.at(-1)));
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
        } else {
            projectList.splice(0, 1);
            currentProject = addProject();
            projectList.push(currentProject)
            currentProject.id = 1;
            document.querySelector('.project-tab-title').value = '';
            while (todoContainer.firstChild) {
                todoContainer.removeChild(todoContainer.firstChild)
            }
            setStorage(projectList, currentProject);
            todoCreation.setupNewTodo();
        }
    })
    editTab.addEventListener('click', () => {
        tabTitle.disabled = false;
        tabTitle.focus();
    })
    tabTitle.onblur = () => { tabTitle.disabled = true; };
    titleWrapper.addEventListener('click', () => {
        const projectList = JSON.parse(localStorage.getItem('project_list'))
        currentProject = projectList[tabContainer.getAttribute('data') - 1];
        localStorage.setItem('current_project', JSON.stringify(currentProject));
        let todo = currentProject.todoList.at(-1);
        localStorage.setItem('current_todo', JSON.stringify(todo));
        todoCreation.addInputListeners(DOMhandler.addTodoInputs(todo.title, todo.desc, todo.dueDate,
            todo.priority, todo.notes, todo.checkboxArr));
    })
    tabTitle.addEventListener('input', () => {
        const projectList = JSON.parse(localStorage.getItem('project_list'));
        currentProject = projectList[tabContainer.getAttribute('data') - 1];
        currentProject.title = tabTitle.value;
        projectList[currentProject.id - 1].title = tabTitle.value;
        setStorage(projectList, currentProject);
    })
    //https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/setData
    //https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API#interfaces
    // todoContainer.addEventListener('dragover', (ev) => {
    //     console.log('dragOver');
    //     ev.preventDefault();
    // })
    // todoContainer.addEventListener('drop', (ev) => {
    //     console.log('drop')
    //     ev.preventDefault();
    //     const data = ev.dataTransfer.getData("text");
    //     console.log(data)
    //     const source = document.getElementById(data);
    //     ev.target.appendChild(source);
    // })
}

export { setupNewProject, setupExistingProjects };