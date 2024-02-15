import * as DOMhandler from './DOMhandler.js';
import * as todoCreation from './todoCreation.js';

let projectList = [], projectID = 1, currentProject;

function addProject(title, todoList, id) {
    title = title || '';
    todoList = todoList || [];
    id = projectID;
    projectID++;
    return { title, todoList, id };
}

function setupNewProject() {
    if (document.querySelector('.project-container')) {
        DOMhandler.clearProjectDOM();
    };
    DOMhandler.addProjectDOM();
    let newProject = addProject();
    projectList.push(newProject);
    currentProject = newProject;
    const projectTab = DOMhandler.addProjectTabs('', newProject.id)[0];
    addTabListeners(projectTab);
    localStorage.setItem("current_project", JSON.stringify(currentProject));
    todoCreation.setupNewTodo();
}

function addTabListeners(tab) {
    //get only the tab title input element
    const tabTitle = tab.children[0];
    tabTitle.addEventListener('click', () => {
        projectList = JSON.parse(localStorage.getItem('project_list'));
        currentProject = projectList[tab.getAttribute('data') - 1];
        // let currentTodo = currentProject.todoList[currentProject.todoList.length - 1]
        // todoCreation.setupExistingTodos(currentProject.todoList);
        localStorage.setItem('current_project', JSON.stringify(currentProject));
        // localStorage.setItem('current_todo', JSON.stringify(currentTodo));
    })
    tabTitle.addEventListener('input', () => {
        currentProject = projectList[tab.getAttribute('data') - 1];
        currentProject.title = tabTitle.value;
        projectList[currentProject.id - 1].title = tabTitle.value;
        localStorage.setItem('current_project', JSON.stringify(currentProject));
        localStorage.setItem('project_list', JSON.stringify(projectList));
    })
}

function setupExistingProjects(list) {
    if (document.querySelector('.project-container')) {
        DOMhandler.clearProjectDOM();
        DOMhandler.clearProjectTabDOM();
    };
    DOMhandler.addProjectDOM();
    list.forEach(project => {
        //copy provided project list to projectList
        projectList.push(addProject(project.title));
        //project tab functionality
        const projectTab = DOMhandler.addProjectTabs(project.title, project.id)[0];
        addTabListeners(projectTab);
    });
    projectList = JSON.parse(localStorage.getItem('project_list'));
    currentProject = JSON.parse(localStorage.getItem('current_project'))
    todoCreation.setupExistingTodos();
}

export { addProject, projectList, currentProject, setupNewProject, setupExistingProjects };