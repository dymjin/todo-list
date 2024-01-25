import { format } from "date-fns";
import * as projectCreation from './projectCreation.js';

function addTodo(title, desc, dueDate, priority, notes, checkboxArr, status) {
    priority = priority || '';
    notes = notes || '';
    status = status || 'pending';
    checkboxArr = checkboxArr || [];
    dueDate = dueDate || format(new Date(), "yyyy-MM-dd");
    return { title, desc, dueDate, priority, notes, checkboxArr, status };
}

export { addTodo };