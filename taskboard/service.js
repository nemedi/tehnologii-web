const {existsSync, readFileSync,writeFileSync, read} = require('fs');

module.exports = function(path) {
    function load(path) {
        if (existsSync(path)) {
            return JSON.parse(readFileSync(path));
        } else {
            return {};
        }
    }
    function store(tasksByStatus, path) {
        writeFileSync(path, JSON.stringify(tasksByStatus));
    }
    const tasksByStatus = load(path);
    return {
        getTasksByStatus() {
            return tasksByStatus;
        },
        changeTaskStatus(task, oldStatus, newStatus) {
            if (tasksByStatus[oldStatus] instanceof Array
                && tasksByStatus[newStatus] instanceof Array) {
                let index = tasksByStatus[oldStatus].findIndex(t => t === task);
                if (index) {
                    tasksByStatus[oldStatus].splice(index, 1);
                    tasksByStatus[newStatus].push(task);
                    store(tasksByStatus, path);
                    return true;
                }
            }
            return false;
        }
    };
};