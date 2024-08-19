function loadAndDisplayMonthTasks() {
    const tasks = loadTasksFromLocalStorage();
    const taskList = document.getElementById('taskList');

    tasks.forEach(task => {
        displayTask(task, taskList);
    });
}

document.addEventListener('DOMContentLoaded', loadAndDisplayMonthTasks);
