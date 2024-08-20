let taskCreationInProgress = false;
let lastTaskCreationTime = 0;

function saveTasksToLocalStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}

function displayTask(task, view) {
    const row = document.createElement('tr');

    // Apply different colors based on task status
    let rowColor = '';
    switch (task.status) {
        case 'Done & Checked':
            rowColor = 'darkgreen';
            break;
        case 'Done':
            rowColor = 'lightgreen';
            break;
        case 'In Progress':
            rowColor = 'blue';
            break;
        case 'Not Started':
            rowColor = 'red';
            break;
    }

    row.style.backgroundColor = rowColor;

    row.innerHTML = `
        <td contenteditable="true" onblur="autoSaveTask('${task.id}', 'text', this.textContent)">${task.text}</td>
        <td><input type="date" value="${task.startDate}" onchange="autoSaveTask('${task.id}', 'startDate', this.value)"></td>
        <td><input type="date" value="${task.dueDate}" onchange="autoSaveTask('${task.id}', 'dueDate', this.value)"></td>
        <td><input type="time" value="${task.startTime}" onchange="autoSaveTask('${task.id}', 'startTime', this.value)"></td>
        <td><input type="time" value="${task.endTime}" onchange="autoSaveTask('${task.id}', 'endTime', this.value)"></td>
        <td><input type="number" value="${task.estimatedTime}" onchange="autoSaveTask('${task.id}', 'estimatedTime', this.value)"></td>
        <td>
            <select onchange="autoSaveTask('${task.id}', 'status', this.value)">
                <option value="Not Started" ${task.status === 'Not Started' ? 'selected' : ''}>Not Started</option>
                <option value="In Progress" ${task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                <option value="Done" ${task.status === 'Done' ? 'selected' : ''}>Done</option>
                <option value="Done & Checked" ${task.status === 'Done & Checked' ? 'selected' : ''}>Done & Checked</option>
            </select>
        </td>
        <td>
            <select onchange="autoSaveTask('${task.id}', 'repeat', this.value)">
                <option value="None" ${task.repeat === 'None' ? 'selected' : ''}>None</option>
                <option value="Daily" ${task.repeat === 'Daily' ? 'selected' : ''}>Daily</option>
                <option value="Weekly" ${task.repeat === 'Weekly' ? 'selected' : ''}>Weekly</option>
                <option value="Monthly" ${task.repeat === 'Monthly' ? 'selected' : ''}>Monthly</option>
            </select>
        </td>
        <td>
            <button onclick="deleteTask('${task.id}')">Delete</button>
            <button onclick="addSubtask('${task.id}')">Add Subtask</button>
        </td>
    `;

    view.appendChild(row);

    // Display subtasks
    if (task.subtasks && task.subtasks.length > 0) {
        task.subtasks.forEach(subtask => {
            const subtaskRow = document.createElement('tr');
            subtaskRow.classList.add('subtask-row');

            // Apply different colors based on subtask status
            let subtaskColor = '';
            switch (subtask.status) {
                case 'Done & Checked':
                    subtaskColor = 'darkgreen';
                    break;
                case 'Done':
                    subtaskColor = 'lightgreen';
                    break;
                case 'In Progress':
                    subtaskColor = 'blue';
                    break;
                case 'Not Started':
                    subtaskColor = 'red';
                    break;
            }

            subtaskRow.style.backgroundColor = subtaskColor;

            subtaskRow.innerHTML = `
                <td contenteditable="true" onblur="autoSaveSubtask('${task.id}', '${subtask.id}', 'text', this.textContent)">${subtask.text}</td>
                <td>
                    <select onchange="autoSaveSubtask('${task.id}', '${subtask.id}', 'status', this.value)">
                        <option value="Not Started" ${subtask.status === 'Not Started' ? 'selected' : ''}>Not Started</option>
                        <option value="In Progress" ${subtask.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                        <option value="Done" ${subtask.status === 'Done' ? 'selected' : ''}>Done</option>
                        <option value="Done & Checked" ${subtask.status === 'Done & Checked' ? 'selected' : ''}>Done & Checked</option>
                    </select>
                </td>
                <td>
                    <select onchange="autoSaveSubtask('${task.id}', '${subtask.id}', 'repeat', this.value)">
                        <option value="None" ${subtask.repeat === 'None' ? 'selected' : ''}>None</option>
                        <option value="Daily" ${subtask.repeat === 'Daily' ? 'selected' : ''}>Daily</option>
                        <option value="Weekly" ${subtask.repeat === 'Weekly' ? 'selected' : ''}>Weekly</option>
                        <option value="Monthly" ${subtask.repeat === 'Monthly' ? 'selected' : ''}>Monthly</option>
                    </select>
                </td>
                <td>
                    <button onclick="deleteSubtask('${task.id}', '${subtask.id}')">Delete Subtask</button>
                </td>
            `;

            view.appendChild(subtaskRow);
        });
    }
}

function autoSaveTask(taskId, field, value) {
    const tasks = loadTasksFromLocalStorage();
    const task = tasks.find(t => t.id === taskId);

    if (task) {
        task[field] = value;  // Update the task field with the new value
        saveTasksToLocalStorage(tasks);  // Save the updated tasks array to localStorage
        loadAndDisplayTasks();  // Refresh the task list to apply new status styles
    } else {
        console.error(`Task with ID ${taskId} not found.`);
    }
}

function addSubtask(taskId) {
    const subtaskText = prompt("Enter subtask:");
    if (!subtaskText) return;

    const tasks = loadTasksFromLocalStorage();
    const task = tasks.find(t => t.id === taskId);
    
    const subtask = {
        id: Date.now() + Math.random().toString(36).substr(2, 9),  // Unique ID for the subtask
        text: subtaskText,
        status: 'Not Started',
        repeat: task.repeat  // Inherit repeat value from the parent task
    };

    task.subtasks.push(subtask);  // Add the new subtask to the task's subtasks array
    saveTasksToLocalStorage(tasks);
    loadAndDisplayTasks();  // Refresh the task list to show the new subtask
}


function autoSaveSubtask(taskId, subtaskId, field, value) {
    const tasks = loadTasksFromLocalStorage();
    const task = tasks.find(t => t.id === taskId);
    const subtask = task.subtasks.find(st => st.id === subtaskId);

    if (subtask) {
        subtask[field] = value;  // Update the subtask field with the new value
        saveTasksToLocalStorage(tasks);  // Save the updated tasks array to localStorage
        loadAndDisplayTasks();  // Refresh the task list to apply the changes
    } else {
        console.error(`Subtask with ID ${subtaskId} not found.`);
    }
}


function deleteSubtask(taskId, subtaskId) {
    const tasks = loadTasksFromLocalStorage();
    const task = tasks.find(t => t.id === taskId);

    task.subtasks = task.subtasks.filter(st => st.id !== subtaskId);  // Filter out the subtask to delete
    saveTasksToLocalStorage(tasks);
    loadAndDisplayTasks();  // Refresh the task list to remove the deleted subtask
}

function deleteTask(taskId) {
    let tasks = loadTasksFromLocalStorage();
    
    // Log the tasks and the ID to be deleted for debugging
    console.log('Tasks before deletion:', tasks);
    console.log('Attempting to delete task with ID:', taskId);

    // Find the index of the task to delete
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);  // Remove the task from the array
        saveTasksToLocalStorage(tasks);  // Save the updated tasks array to localStorage
        console.log('Tasks after deletion:', tasks);
        loadAndDisplayTasks();  // Reload the task list after deletion
        taskCreationInProgress = false;  // Allow new tasks to be created after deletion
    } else {
        console.error(`Task with ID ${taskId} not found.`);
    }
}

function createTask() {
    if (taskCreationInProgress) {
        alert("Please complete the current task before adding a new one.");
        return;  // Prevent creating multiple tasks at the same time
    }

    taskCreationInProgress = true;

    // Ensure the task ID is unique by combining Date.now() with a random value
    const uniqueId = Date.now() + Math.random().toString(36).substr(2, 9);

    const today = new Date().toISOString().split('T')[0];  // Get today's date in YYYY-MM-DD format
    const task = {
        id: uniqueId,
        text: 'New Task',
        startDate: today,
        dueDate: today,
        startTime: '',
        endTime: '',
        estimatedTime: '',
        status: 'Not Started',
        repeat: 'None',
        subtasks: []  // Initialize subtasks as an empty array
    };

    const tasks = loadTasksFromLocalStorage();
    tasks.push(task);
    saveTasksToLocalStorage(tasks);

    taskCreationInProgress = false;  // Allow new tasks to be created after this one

    loadAndDisplayTasks();  // Refresh the task list to show the new task
}


function loadAndDisplayTasks() {
    const tasks = loadTasksFromLocalStorage();
    const taskList = document.getElementById('taskList');

    taskList.innerHTML = '';  // Clear existing tasks

    tasks.forEach(task => {
        displayTask(task, taskList);
    });
}


function addSubtask(taskId) {
    const subtaskText = prompt("Enter subtask:");
    if (!subtaskText) return;

    const tasks = loadTasksFromLocalStorage();
    const task = tasks.find(t => t.id === taskId);
    
    const subtask = {
        id: Date.now() + Math.random().toString(36).substr(2, 9),  // Unique ID for the subtask
        text: subtaskText,
        status: 'Not Started'  // Default status for subtasks
    };

    task.subtasks.push(subtask);  // Add the new subtask to the task's subtasks array
    saveTasksToLocalStorage(tasks);
    loadAndDisplayTasks();  // Refresh the task list to show the new subtask
}

function autoSaveSubtask(taskId, subtaskId, field, value) {
    const tasks = loadTasksFromLocalStorage();
    const task = tasks.find(t => t.id === taskId);
    const subtask = task.subtasks.find(st => st.id === subtaskId);

    if (subtask) {
        subtask[field] = value;  // Update the subtask field with the new value
        saveTasksToLocalStorage(tasks);  // Save the updated tasks array to localStorage
        loadAndDisplayTasks();  // Refresh the task list to apply the changes
    } else {
        console.error(`Subtask with ID ${subtaskId} not found.`);
    }
}

function deleteSubtask(taskId, subtaskId) {
    const tasks = loadTasksFromLocalStorage();
    const task = tasks.find(t => t.id === taskId);

    task.subtasks = task.subtasks.filter(st => st.id !== subtaskId);
    saveTasksToLocalStorage(tasks);
    loadAndDisplayTasks();  // Refresh the task list to remove the deleted subtask
}


document.addEventListener('DOMContentLoaded', loadAndDisplayTasks);
