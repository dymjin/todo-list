let projectList = [];

function addProject(title, todoList) {
    title = title || '';
    todoList = todoList || [];
    return { title, todoList };
}

export { addProject, projectList };