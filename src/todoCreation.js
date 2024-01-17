import { format } from "date-fns";

function addTodo(title, desc, dueDate, priority, notes, checklist = false) {
    priority = priority || '';
    notes = notes || '';
    dueDate = dueDate || format(new Date(), "yyyy-MM-dd");
    return { title, desc, dueDate, priority, notes, checklist };
}

export { addTodo };