let projectList = [];

function addProject(title, todoList, id) {
    title = title || '';
    todoList = todoList || [];
    return { title, todoList, id };
}

export { addProject, projectList };