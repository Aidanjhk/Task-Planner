function createTask() {
    const taskInput = document.getElementById('taskInput');
    const startDateInput = document.getElementById('startDateInput');
    const endDateInput = document.getElementById('endDateInput');

    const task = {
        id: Date.now(),
        text: taskInput.value.trim(),
        startDate: startDateInput.value,
        endDate: endDateInput.value,
        status: 'Not Started',
        subtasks: []
    };

    const tasks = loadTasksFromLocalStorage();
    tasks.push(task);
    saveTasksToLocalStorage(tasks);
    window.location.href = 'day.html';  // Redirect to the Day view
}
