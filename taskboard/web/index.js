async function getTasksByStatus() {
    const response = await fetch('/tasks');
    if (response.status === 200) {
        const tasksByStatus = await response.json();
        return tasksByStatus;
    } else {
        return {};
    }
}

async function changeTaskStatus(task, oldStatus, newStatus) {
    const response = await fetch(`/tasks?task=${task}&oldStatus=${oldStatus}&newStatus=${newStatus}`, {method: 'PUT'});
    return response.status === 204;
}

async function load() {
    const tasksByStatus = await getTasksByStatus();
    if (Object.keys(tasksByStatus).length > 0) {
        document
            .querySelector('#container')
            .taskBoard({tasksByStatus, changeTaskStatus});
    }
}