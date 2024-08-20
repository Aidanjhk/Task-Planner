function loadAndDisplayDayTasks() {
    const tasks = loadTasksFromLocalStorage();
    const today = new Date().toISOString().split('T')[0];
    const taskList = document.getElementById('taskList');

    //tasks.forEach(task => {
    //    if (task.startDate === today) {
    //        displayTask(task, taskList);
    //    }
    //});
}

document.addEventListener('DOMContentLoaded', loadAndDisplayDayTasks);
