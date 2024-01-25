import { format } from "date-fns";
import * as projectCreation from './projectCreation.js';

function addTodo(title, desc, dueDate, priority, notes, lists, status) {
    priority = priority || '';
    notes = notes || '';
    status = status || 'pending';
    lists = lists || [];
    dueDate = dueDate || format(new Date(), "yyyy-MM-dd");
    return { title, desc, dueDate, priority, notes, lists, status };
}

export { addTodo };