# Tasks
This section has dataviewjs scripts chunks for different interesting options

## Filter all completed task (including nested tasks)


```dataviewjs
function filterIncompleteTasks(task) {
    if (!task || task.completed) {
	    return null;
    }
	
    // Filtra subtareas de manera recursiva
	let filteredSubtasks = [];
	if (task.children) {
	    for (let i = 0; i < task.children.length; i++) {
	        let subtask = filterIncompleteTasks(task.children[i]);
	        if (subtask !== null) {
	            filteredSubtasks.push(subtask);
	        }
	    }
	    task.children = filteredSubtasks
	}
    return task;
}

// Filtra todas las tareas principales e itera sobre cada una
let filteredTasks = [];
let tasks = dv.pages().file.tasks;

for (let i = 0; i < tasks.length; i++) {
    let task = filterIncompleteTasks(tasks[i]);
    if (task !== null) {
        filteredTasks.push(task);
    }
}


// Muestra solo las tareas que siguen incompletas
dv.taskList(filteredTasks, true);
```