window.onload = async () => {
    const changeTaskStatus = async (task, oldStatus, newStatus) => {
        const response = await fetch('/tasks'
            + '?task=' + encodeURIComponent(task)
            + '&oldStatus=' + encodeURIComponent(oldStatus)
            + '&newStatus=' + encodeURIComponent(newStatus),
            {method: 'PATCH'});
        return response.status === 204;
    };
    const response = await fetch('/tasks');
    if (response.status === 200) {
        const tasksByStatus = await response.json();
        if (Object.keys(tasksByStatus).length > 0) {
            document
                .getElementById('container')
                .taskBoard(tasksByStatus, changeTaskStatus);
        }
    }
};