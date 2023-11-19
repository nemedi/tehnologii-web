const {existsSync, readFileSync, writeFileSync, read} = require('fs');
const uuid = require('uuid');

module.exports = function(path) {
    const tasks = existsSync(path)
        ? JSON.parse(readFileSync(path))
        : [];
    return {
        getTasks() {
            return tasks;
        },
        addTask(description) {
            const task = {id: uuid.v1(), description};
            tasks.push(task);
            writeFileSync(path,  JSON.stringify(tasks));
            return task;
        },
        removeTask(id) {
            let index = tasks.findIndex(task => task.id === id);
            if (index > -1) {
                tasks.splice(index, 1);
                writeFileSync(path, JSON.stringify(tasks));
                return true;
            } else {
                return false;
            }
        }
    };
}