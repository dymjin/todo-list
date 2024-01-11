function makeContainer(name, type, parent) {
    const container = document.createElement(type);
    container.className = name;
    parent.appendChild(container);
    return container;
}

function initPageContainers() {
    makeContainer('project-container', 'div', document.querySelector('.page-container'));
    makeContainer('todo-container', 'div', document.querySelector('.project-container'));
}

function makeNewProject(projectTitle) {
    initPageContainers(projectTitle);
    makeTodo();
    const btn = makeContainer('add-todo', 'button', document.querySelector('.project-container'));
    btn.textContent = '+';
    btn.addEventListener('click', () => makeTodo());
}

function makeInput(type, parent, placeholder) {
    const input = document.createElement('input');
    input.setAttribute('type', type);
    input.setAttribute('placeholder', placeholder);
    parent.appendChild(input);
}

function makeTodo() {
    makeInput('text', document.querySelector('.todo-container'), 'title');
    makeInput('text', document.querySelector('.todo-container'), 'desc');
}

export { makeNewProject, makeTodo };