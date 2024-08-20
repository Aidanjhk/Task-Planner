function loadAndDisplayWeekTasks() {
    const tasks = loadTasksFromLocalStorage();
    const taskList = document.getElementById('taskList');

    const today = new Date();
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const lastDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));

    taskList.innerHTML = '';  // Clear existing tasks

    tasks.forEach(task => {
        const taskDate = new Date(task.startDate);
        if (taskDate >= firstDayOfWeek && taskDate <= lastDayOfWeek) {
            displayTask(task, taskList);
        }
    });
}

document.addEventListener('DOMContentLoaded', loadAndDisplayWeekTasks);
