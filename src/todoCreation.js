import { format } from "date-fns";

function addTodo(title, desc, dueDate, priority, notes, checkboxArr, status, id) {
    title = title || '';
    desc = desc || '';
    dueDate = dueDate || format(new Date(), "yyyy-MM-dd");
    priority = priority || '';
    notes = notes || '';
    checkboxArr = checkboxArr || [];
    status = status || 'pending';
    return { title, desc, dueDate, priority, notes, checkboxArr, status, id };
}

export { addTodo };