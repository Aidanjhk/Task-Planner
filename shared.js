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
    
    row.innerHTML = `
        <td contenteditable="true" onblur="autoSaveTask(${task.id}, 'text', this.textContent)">${task.text}</td>
        <td><input type="date" value="${task.startDate}" onchange="autoSaveTask(${task.id}, 'startDate', this.value)"></td>
        <td><input type="date" value="${task.dueDate}" onchange="autoSaveTask(${task.id}, 'dueDate', this.value)"></td>
        <td><input type="time" value="${task.startTime}" onchange="autoSaveTask(${task.id}, 'startTime', this.value)"></td>
        <td><input type="time" value="${task.endTime}" onchange="autoSaveTask(${task.id}, 'endTime', this.value)"></td>
        <td><input type="number" value="${task.estimatedTime}" onchange="autoSaveTask(${task.id}, 'estimatedTime', this.value)"></td>
		<td>
            <select onchange="autoSaveTask(${task.id}, 'status', this.value)">
                <option value="Not Started" ${task.status === 'Not Started' ? 'selected' : ''}>Not Started</option>
                <option value="In Progress" ${task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                <option value="Done" ${task.status === 'Done' ? 'selected' : ''}>Done</option>
                <option value="Done & Checked" ${task.status === 'Done & Checked' ? 'selected' : ''}>Done & Checked</option>
            </select>
        </td>
        <td>
            <select onchange="autoSaveTask(${task.id}, 'repeat', this.value)">
                <option value="daily" ${task.repeat === 'daily' ? 'selected' : ''}>Daily</option>
                <option value="weekly" ${task.repeat === 'weekly' ? 'selected' : ''}>Weekly</option>
                <option value="monthly" ${task.repeat === 'monthly' ? 'selected' : ''}>Monthly</option>
            </select>
        </td>
        <td>
           <button onclick="deleteTask('${task.id}')">Delete</button>
        </td>
    `;

    view.appendChild(row);

    // Display subtasks
    if (task.subtasks && task.subtasks.length > 0) {
        const subtaskContainer = document.createElement('tr');
        subtaskContainer.classList.add('subtask-container');
        
        task.subtasks.forEach(subtask => {
            const subtaskRow = document.createElement('tr');
            subtaskRow.classList.add('subtask-row');
            
            subtaskRow.innerHTML = `
                <td colspan="9" class="subtask-cell">
                    <div contenteditable="true" onblur="autoSaveSubtask(${task.id}, ${subtask.id}, this.textContent)">${subtask.text}</div>
                    <button onclick="deleteSubtask(${task.id}, ${subtask.id})">Delete Subtask</button>
                </td>
            `;
            
            subtaskContainer.appendChild(subtaskRow);
        });

        view.appendChild(subtaskContainer);
    }
}

function autoSaveTask(taskId, field, value) {
    const tasks = loadTasksFromLocalStorage();
    const task = tasks.find(t => t.id === taskId);

    if (task) {
        task[field] = value;
        saveTasksToLocalStorage(tasks);
        if (field === 'text' && value !== 'New Task') {
            taskCreationInProgress = false;  // Allow new tasks to be created after the current one is edited
        }
    }
}

function addSubtask(taskId) {
    const subtaskText = prompt("Enter subtask:");
    if (!subtaskText) return;

    const tasks = loadTasksFromLocalStorage();
    const task = tasks.find(t => t.id === taskId);
    
    const subtask = {
        id: Date.now(),
        text: subtaskText
    };

    task.subtasks.push(subtask);
    saveTasksToLocalStorage(tasks);
    loadAndDisplayTasks();  // Refresh the task list
}

function autoSaveSubtask(taskId, subtaskId, value) {
    const tasks = loadTasksFromLocalStorage();
    const task = tasks.find(t => t.id === taskId);
    const subtask = task.subtasks.find(st => st.id === subtaskId);

    if (subtask) {
        subtask.text = value;
        saveTasksToLocalStorage(tasks);
    }
}

function deleteSubtask(taskId, subtaskId) {
    const tasks = loadTasksFromLocalStorage();
    const task = tasks.find(t => t.id === taskId);

    task.subtasks = task.subtasks.filter(st => st.id !== subtaskId);
    saveTasksToLocalStorage(tasks);
    loadAndDisplayTasks();  // Refresh the task list
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
    const now = Date.now();

    if (now - lastTaskCreationTime < 1000) {
        return;  // Prevent creating multiple tasks within 1 second
    }

    lastTaskCreationTime = now;


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
        subtasks: []
    };

    const tasks = loadTasksFromLocalStorage();
    tasks.push(task);
    saveTasksToLocalStorage(tasks);

    taskCreationInProgress = true;  // Block new task creation until this one is edited or deleted

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

document.addEventListener('DOMContentLoaded', loadAndDisplayTasks);
