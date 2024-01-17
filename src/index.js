import styles from './style.css';
import { addTodo } from './todoCreation.js';
import * as DOMhandler from './DOMhandler.js';
import * as todoCreation from './todoCreation.js';

let projectList = [];
let project = {};

DOMhandler.addProjectDOM();

document.querySelector('.add-todo').addEventListener('click', () => {
    document.querySelector('.todo-dialog').showModal();
});

document.querySelector('.todo-confirm').addEventListener('click', (event) => {
    const todo = todoCreation.addTodo(
        document.querySelector('.todo-input-title').value,
        document.querySelector('.todo-input-desc').value
    );
    project.todo = todo;
    document.querySelector('.todo-input-title').value = '';
    document.querySelector('.todo-input-desc').value = '';
    DOMhandler.addTodoDOM(todo.title, todo.desc);
    event.preventDefault();
    document.querySelector('.todo-dialog').close();
});