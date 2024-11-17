function loadTasks(data) {
    document.getElementById('container').tasks(data, {
        addTask: '/add-task',
        removeTask: '/remove-task'
    });
}