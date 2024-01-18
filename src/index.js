import styles from './style.css';
import * as DOMhandler from './DOMhandler.js';
import * as todoCreation from './todoCreation.js';

let projectList = [];
let project = {};

document.querySelector('.add-todo').addEventListener('click', () => {
    document.querySelector('.todo-dialog').showModal();
});

document.querySelector('.todo-confirm').addEventListener('click', (event) => {
    event.preventDefault();
    const todo = todoCreation.addTodo(
        document.querySelector('.todo-input-title').value,
        document.querySelector('.todo-input-desc').value,
        document.querySelector('.due-date').value,
        document.querySelector('.priority-select').value
    );
    project.todo = todo;
    DOMhandler.addTodoDOM(todo.title, todo.desc, todo.dueDate, todo.priority);
    document.querySelector('.todo-input-title').value = '';
    document.querySelector('.todo-input-desc').value = '';
    document.querySelector('.due-date').value = '';
    document.querySelector('.priority-select').value = 'Set priority';
    
    document.querySelector('.todo-dialog').close();
});