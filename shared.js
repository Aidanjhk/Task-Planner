function saveTasksToLocalStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}

function displayTask(task, view) {
    const taskContainer = document.createElement('div');
    taskContainer.classList.add('task-container');

    const li = document.createElement('li');
    li.classList.add('task-item');
    li.textContent = `${task.text} (Start: ${task.startTime || 'Not Set'}, End: ${task.endTime || 'Not Set'})`;

    const statusBtn = document.createElement('button');
    statusBtn.textContent = 'Update Status';
    statusBtn.onclick = function() {
        updateTaskStatus(task.id);
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = function() {
        deleteTask(task.id);
        taskContainer.remove();
    };

    const subtaskBtn = document.createElement('button');
    subtaskBtn.textContent = 'Add Subtask';
    subtaskBtn.onclick = function() {
        const subtaskText = prompt('Enter subtask:');
        if (subtaskText) {
            const subtask = {
                id: Date.now(),
                text: subtaskText,
                status: 'Not Started'
            };
            addSubtask(task.id, subtask);
            displaySubtask(subtask, taskContainer);
        }
    };

    li.appendChild(statusBtn);
    li.appendChild(deleteBtn);
    li.appendChild(subtaskBtn);
    taskContainer.appendChild(li);

    // Display subtasks, if any
    if (task.subtasks && task.subtasks.length > 0) {
        const subtaskList = document.createElement('ul');
        subtaskList.classList.add('subtask-list');
        task.subtasks.forEach(subtask => {
            displaySubtask(subtask, subtaskList);
        });
        taskContainer.appendChild(subtaskList);
    }

    view.appendChild(taskContainer);
}

function displaySubtask(subtask, container) {
    const subtaskLi = document.createElement('li');
    subtaskLi.classList.add('subtask-item');
    subtaskLi.textContent = `${subtask.text} (Status: ${subtask.status})`;

    const statusBtn = document.createElement('button');
    statusBtn.textContent = 'Update Subtask Status';
    statusBtn.onclick = function() {
        updateSubtaskStatus(subtask.id);
    };

    const deleteSubtaskBtn = document.createElement('button');
    deleteSubtaskBtn.textContent = 'Delete Subtask';
    deleteSubtaskBtn.onclick = function() {
        deleteSubtask(subtask.id);
        subtaskLi.remove();
    };

    subtaskLi.appendChild(statusBtn);
    subtaskLi.appendChild(deleteSubtaskBtn);
    container.appendChild(subtaskLi);
}

function updateTaskStatus(taskId) {
    const tasks = loadTasksFromLocalStorage();
    const task = tasks.find(t => t.id === taskId);
    const statusOptions = ['Not Started', 'In Progress', 'Done', 'Done & Checked'];
    const currentStatusIndex = statusOptions.indexOf(task.status);
    task.status = statusOptions[(currentStatusIndex + 1) % statusOptions.length];
    saveTasksToLocalStorage(tasks);
    location.reload();  // Refresh to reflect the status change
}

function updateSubtaskStatus(subtaskId) {
    const tasks = loadTasksFromLocalStorage();
    tasks.forEach(task => {
        const subtask = task.subtasks.find(st => st.id === subtaskId);
        if (subtask) {
            const statusOptions = ['Not Started', 'In Progress', 'Done', 'Done & Checked'];
            const currentStatusIndex = statusOptions.indexOf(subtask.status);
            subtask.status = statusOptions[(currentStatusIndex + 1) % statusOptions.length];
            saveTasksToLocalStorage(tasks);
            location.reload();
        }
    });
}

function deleteTask(taskId) {
    let tasks = loadTasksFromLocalStorage();
    tasks = tasks.filter(t => t.id !== taskId);
    saveTasksToLocalStorage(tasks);
}

function addSubtask(taskId, subtask) {
    const tasks = loadTasksFromLocalStorage();
    const task = tasks.find(t => t.id === taskId);
    task.subtasks.push(subtask);
    saveTasksToLocalStorage(tasks);
}

function deleteSubtask(subtaskId) {
    const tasks = loadTasksFromLocalStorage();
    tasks.forEach(task => {
        task.subtasks = task.subtasks.filter(st => st.id !== subtaskId);
    });
    saveTasksToLocalStorage(tasks);
}
