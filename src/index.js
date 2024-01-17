import styles from './style.css';
import { addTodo } from './todoCreation.js';
import * as DOMhandler from './DOMhandler.js';
import * as todoCreation from './todoCreation.js';

todoCreation.addProject('', 'Title', 'desc');

document.querySelector('.add-todo').addEventListener('click', () => {
    document.querySelector('.todo-dialog').showModal();
});
document.querySelector('.todo-confirm').addEventListener('click', (event) => {
    const todo = addTodo(document.querySelector('.todo-input-title').value, document.querySelector('.todo-input-desc').value);
    document.querySelector('.todo-input-title').value = '';
    document.querySelector('.todo-input-desc').value = '';
    DOMhandler.addTodoDOM(todo.title, todo.desc);
    event.preventDefault();
    document.querySelector('.todo-dialog').close();
});