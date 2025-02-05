# Tasks
This section has dataviewjs scripts chunks for different interesting options

## Filter all completed task (including nested tasks)

```
```dataviewjs
function filterIncompleteTasks(task) {
    if (!task || task.completed) {
        return null;
    }

    // Filter subtasks recursively using .map
    if (task.children) {
        task.children = task.children
            .map(filterIncompleteTasks)
            .filter(subtask => subtask !== null);
    }
    return task;
}

// Filter all main tasks and iterate over each one using .map
let tasks = dv.pages().file.tasks;
let filteredTasks = tasks
    .map(filterIncompleteTasks)
    .filter(task => task !== null);

// Display only the tasks that are still incomplete
dv.taskList(filteredTasks, true);
```