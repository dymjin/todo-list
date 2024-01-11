
function makeContainer(name, type, parent) {
    const container = document.createElement(`${type}`);
    container.className = `${name.replaceAll('_', "-")}`;
    parent.appendChild(container);
}

function initPageContainers() {
    makeContainer('project_container', 'div', document.querySelector('.page-container'));
    makeContainer('todo-title', 'div', document.querySelector('.project-container'));
    makeContainer('todo-desc', 'div', document.querySelector('.project-container'));
}

function makeInput(/*value,*/ type, parent, placeholder) {
    const input = document.createElement('input');
    input.setAttribute('type', type);
    // value === undefined ? 0 : input.setAttribute('value', value);
    input.setAttribute('placeholder', placeholder)
    parent.appendChild(input);
}

function makeNewProject(title, desc) {
    initPageContainers();
    makeInput('text', document.querySelector('.todo-title'), 'title');
    makeInput('text', document.querySelector('.todo-desc'), 'desc');
}

export { makeNewProject };