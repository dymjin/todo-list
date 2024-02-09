import * as DOMhandler from './DOMhandler.js';
// import * as index from './index.js';

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
        DOMhandler.clearProjectTabDOM();
    };
    DOMhandler.addProjectDOM();
    let newProject = addProject();
    projectList.push(newProject);
    currentProject = newProject;
    localStorage.setItem('project_list', JSON.stringify(projectList));
    localStorage.setItem('current_project', JSON.stringify(currentProject));
    const projectTab = DOMhandler.addProjectTabs('', newProject.id)[0];
    addTabListeners(projectTab);
}

function addTabListeners(tab) {
    //get only the tab title input element
    const tabTitle = tab.children[0];
    tabTitle.addEventListener('click', () => {
        projectList = JSON.parse(localStorage.getItem('project_list'));
        currentProject = projectList[tab.getAttribute('data') - 1];
        localStorage.setItem('project_list', JSON.stringify(projectList));
        localStorage.setItem('current_project', JSON.stringify(currentProject));
    })
    tabTitle.addEventListener('input', () => {
        currentProject = projectList[tab.getAttribute('data') - 1];
        currentProject.title = tabTitle.value;
        localStorage.setItem('project_list', JSON.stringify(projectList));
        localStorage.setItem('current_project', JSON.stringify(currentProject));
    })
}

function setupExistingProjects(list) {
    if (document.querySelector('.project-container')) {
        DOMhandler.clearProjectDOM();
        DOMhandler.clearProjectTabDOM();
    };
    DOMhandler.addProjectDOM();
    currentProject = JSON.parse(localStorage.getItem('current_project'));
    list.forEach(project => {
        //copy provided project list to projectList
        projectList.push(addProject(project.title));
        //project tab functionality
        const projectTab = DOMhandler.addProjectTabs(project.title, project.id)[0];
        addTabListeners(projectTab);
    });
    localStorage.setItem('current_project', JSON.stringify(currentProject));
}

export { addProject, projectList, setupNewProject, setupExistingProjects };