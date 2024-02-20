import * as DOMhandler from './DOMhandler.js';
import * as todoCreation from './todoCreation.js';

let projectList = [], currentProject;

function addProject(title = '', todoList = [], id = 1) {
    let project = {};

    project.title = title;
    project.todoList = todoList;
    project.id = id;
    const storedProjectList = JSON.parse(localStorage.getItem('project_list'));
    if (storedProjectList) {
        let sortedArr = storedProjectList.sort((a, b) => a.id - b.id);
        project.id = (sortedArr[sortedArr.length - 1].id + 1);
    }
    currentProject = project;
    projectList.push(project);
    return project;
}

function setupNewProject() {
    const project = addProject();
    localStorage.setItem("project_list", JSON.stringify(projectList));
    localStorage.setItem("current_project", JSON.stringify(currentProject));
    const projectDOM = DOMhandler.addProjectDOM('', project.id);
    addTabListeners(projectDOM);
    // todoCreation.setupNewTodo();
}

function addTabListeners(tab) {
    //get only the tab title input element
    const tabContainer = tab[0];
    const tabTitle = tab[1];
    const editTab = tab[2];
    const removeTab = tab[3];
    const wrapper = tab[4];
    removeTab.addEventListener('click', () => {
        if (projectList.length > 1) {
            currentProject = projectList[tabContainer.getAttribute('data') - 1];
            projectList.splice(currentProject.id - 1, 1);
            projectList.forEach((project, index) => {
                project.id = index + 1;
            })
            currentProject = projectList[projectList.length - 1];
            const projectlistContainer = document.querySelector('.projectlist-container');
            projectlistContainer.removeChild(tabContainer);
            projectlistContainer.childNodes.forEach((elem, index) => {
                elem.setAttribute('data', index + 1);
                elem.childNodes.forEach(child => {
                    child.setAttribute('data', index + 1);
                })
            });
        } else {
            projectList.splice(0, 1);
            currentProject = addProject();
            currentProject.id = 1;
            document.querySelector('.project-tab-title').value = '';
        }
        localStorage.setItem('project_list', JSON.stringify(projectList));
        localStorage.setItem('current_project', JSON.stringify(currentProject));
    })
    editTab.addEventListener('click', () => {
        tabTitle.disabled = false;
        tabTitle.focus();
    })
    tabTitle.onblur = () => { tabTitle.disabled = true; };
    wrapper.addEventListener('dblclick', () => {
        currentProject = projectList[tabContainer.getAttribute('data') - 1];
        localStorage.setItem('current_project', JSON.stringify(currentProject));
        // tabTitle.disabled = false;
        // projectList = JSON.parse(localStorage.getItem('project_list'));
        // currentProject = projectList[tab.getAttribute('data') - 1];
        // let currentTodo = currentProject.todoList[currentProject.todoList.length - 1]
        // todoCreation.setupExistingTodos(currentProject.todoList);
        // localStorage.setItem('current_project', JSON.stringify(currentProject));
        // localStorage.setItem('current_todo', JSON.stringify(currentTodo));
    })
    tabTitle.addEventListener('input', () => {
        currentProject = projectList[tab[0].getAttribute('data') - 1];
        currentProject.title = tabTitle.value;
        projectList[currentProject.id - 1].title = tabTitle.value;
        localStorage.setItem('current_project', JSON.stringify(currentProject));
        localStorage.setItem('project_list', JSON.stringify(projectList));
    })
}

function setupExistingProjects(list) {
    DOMhandler.clearTabDOM('project')
    list.forEach(project => {
        //copy provided project list to projectList
        projectList.push(project);
        const projectDOM = DOMhandler.addProjectDOM(project.title, project.id);
        //project tab functionality
        addTabListeners(projectDOM);
    });
    currentProject = JSON.parse(localStorage.getItem('current_project'))
    // todoCreation.setupExistingTodos();
}

// export { addProject, projectList, currentProject, setupNewProject, setupExistingProjects };
export { setupNewProject, setupExistingProjects }