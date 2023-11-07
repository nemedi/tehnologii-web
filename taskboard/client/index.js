async function load() {
    const response = await fetch('/tasks');
    if (response.status === 200) {
        const tasksByStatus = await response.json();
        if (Object.keys(tasksByStatus).length > 0) {
            document
                .getElementById('container')
                .taskBoard(tasksByStatus, async (task, oldStatus, newStatus) => {
                    const response = await fetch('/tasks'
                        + `?task=${task}&oldStatus=${oldStatus}&newStatus=${newStatus}`,
                        {method: 'PUT'});
                    return response.status === 204;
                });
        }
    }
}