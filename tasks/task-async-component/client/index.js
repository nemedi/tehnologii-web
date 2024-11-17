window.onload = async function() {
    const response = await fetch('/tasks');
    const body = await response.json();
    document.getElementById('container').tasks(body, {
        addTask: async function(task) {
            const response = await fetch(`/tasks`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
                    body: task
                });
            return await response.json();
        },
        removeTask: async function(id) {
			const response = await fetch(`/tasks/${id}`, {method: 'DELETE'});
			return response.status === 204;
        }
    });
}
