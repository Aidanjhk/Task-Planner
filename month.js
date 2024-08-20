function loadAndDisplayMonthTasks() {
    const tasks = loadTasksFromLocalStorage();
    const taskList = document.getElementById('taskList');

    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    taskList.innerHTML = '';  // Clear existing tasks

    tasks.forEach(task => {
        const taskDate = new Date(task.startDate);
        if (taskDate >= firstDayOfMonth && taskDate <= lastDayOfMonth) {
            displayTask(task, taskList);
        }
    });
}

document.addEventListener('DOMContentLoaded', loadAndDisplayMonthTasks);
