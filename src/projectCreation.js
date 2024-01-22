let projectList = [];

function addProject(title) {
    let todoList = [];
    title = title || '';
    todoList = [];
    return { title, todoList };
}

export { addProject, projectList };