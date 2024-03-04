import * as DOMhandler from './DOMhandler.js';
// import * as todoCreation from './todoCreation.js';

let projectList = [], currentProject;

function addProject(title = '', todoList = [], id = 1) {
    const storedProjectList = JSON.parse(localStorage.getItem('project_list'));
    if (storedProjectList) {
        let sortedArr = storedProjectList.sort((a, b) => a.id - b.id);
        id = (sortedArr[sortedArr.length - 1].id + 1);
    }
    return { title, todoList, id };
}

function setupNewProject() {
    // const project = DOMhandler.addProjectTab();
    // const todo = DOMhandler.addTodoTab();
    // todo.addEventListener()
    // addTabListeners(project)
    currentProject = addProject();
    projectList.push(currentProject);
    localStorage.setItem("project_list", JSON.stringify(projectList));
    localStorage.setItem("current_project", JSON.stringify(currentProject));
    const projectTab = DOMhandler.addProjectTab('', currentProject.id);
    addTabListeners(projectTab);
    // todoCreation.setupNewTodo();
}


function addTabListeners(tab) {
    //https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/setData
    //https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API#interfaces
    // tab[0].addEventListener('dragenter', (ev) => {
    //     console.log('dragEnter');
    // })
    const tabContainer = tab;
    const titleWrapper = tab.childNodes[0].childNodes[0];
    const tabTitle = tab.childNodes[0].childNodes[1];
    const editTab = tab.childNodes[1];
    const removeTab = tab.childNodes[2];
    removeTab.addEventListener('click', () => {
        if (projectList.length > 1) {
            currentProject = projectList[tabContainer.getAttribute('data') - 1];
            projectList.splice(currentProject.id - 1, 1);
            projectList.forEach((project, index) => {
                project.id = index + 1;
            })
            if (projectList[currentProject.id]) { }
            else { currentProject.id = projectList[projectList.length - 1].id }
            const projectTabsContainer = document.querySelector('.project-tabs-container');
            projectTabsContainer.removeChild(tabContainer);
            projectTabsContainer.childNodes.forEach((elem, index) => {
                elem.setAttribute('data', index + 1);
                elem.childNodes.forEach(child => {
                    child.setAttribute('data', index + 1);
                })
            });
        } else {
            projectList.splice(0, 1);
            currentProject = addProject();
            projectList.push(currentProject)
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
    titleWrapper.addEventListener('dblclick', () => {
        currentProject = projectList[tabContainer.getAttribute('data') - 1];
        localStorage.setItem('current_project', JSON.stringify(currentProject));
        // DOMhandler.clearTabDOM('todo');
        // todoCreation.setupExistingTodos();

        // tabTitle.disabled = false;
        // projectList = JSON.parse(localStorage.getItem('project_list'));
        currentProject = projectList[tabContainer.getAttribute('data') - 1];
        // let currentTodo = currentProject.todoList[currentProject.todoList.length - 1]
        // todoCreation.setupExistingTodos(currentProject.todoList);
        localStorage.setItem('current_project', JSON.stringify(currentProject));
        // localStorage.setItem('current_todo', JSON.stringify(currentTodo));
    })
    tabTitle.addEventListener('input', () => {
        currentProject = projectList[tabContainer.getAttribute('data') - 1];
        currentProject.title = tabTitle.value;
        projectList[currentProject.id - 1].title = tabTitle.value;
        localStorage.setItem('current_project', JSON.stringify(currentProject));
        localStorage.setItem('project_list', JSON.stringify(projectList));
    })
}

function setupExistingProjects(list) {
    DOMhandler.clearTabDOM('project');
    list.forEach(project => {
        //copy provided project list to projectList
        projectList.push(project);
        const projectTab = DOMhandler.addProjectTab(project.title, project.id);
        //project tab functionality
        addTabListeners(projectTab);
    });
    currentProject = JSON.parse(localStorage.getItem('current_project'))
    // todoCreation.setupExistingTodos();
}

// // export { addProject, projectList, currentProject, setupNewProject, setupExistingProjects };
// export { setupNewProject, setupExistingProjects, projectList, currentProject }
export { setupNewProject, setupExistingProjects, projectList, currentProject };