document.addEventListener('DOMContentLoaded', function() {
    checkReset();
    loadTasks();
});

function addTask(task = null) {
    const taskInput = document.getElementById('taskInput');
    const statusInput = document.getElementById('statusInput');
    const dayInput = document.getElementById('dayInput');
    const typeInput = document.getElementById('typeInput');
    const startTimeInput = document.getElementById('startTimeInput');
    const endTimeInput = document.getElementById('endTimeInput');
    const estimatedTimeInput = document.getElementById('estimatedTimeInput');
    
    const taskText = task ? task.text : taskInput.value.trim();
    const taskStatus = task ? task.status : statusInput.value;
    const taskDay = task ? task.day : dayInput.value;
    const taskType = task ? task.type : typeInput.value;
    const taskStartTime = task ? task.startTime : startTimeInput.value;
    const taskEndTime = task ? task.endTime : endTimeInput.value;
    const taskEstimatedTime = task ? task.estimatedTime : estimatedTimeInput.value;

    if (taskText !== '') {
        const li = document.createElement('li');

        const taskName = document.createElement('span');
        taskName.textContent = `${taskText} ${formatTaskDetails(taskStartTime, taskEndTime, taskEstimatedTime)}`;

        const taskStatusSpan = document.createElement('span');
        taskStatusSpan.textContent = taskStatus;
        taskStatusSpan.className = 'status';

        const taskTypeSpan = document.createElement('span');
        taskTypeSpan.textContent = taskType;
        taskTypeSpan.className = 'type';

        const statusBtn = document.createElement('button');
        statusBtn.textContent = 'Update Status';
        statusBtn.className = 'status-btn';
        statusBtn.onclick = function() {
            updateStatus(taskStatusSpan);
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = function() {
            this.parentElement.remove();
        };

        const subtaskBtn = document.createElement('button');
        subtaskBtn.textContent = 'Add Subtask';
        subtaskBtn.className = 'subtask-btn';
        subtaskBtn.onclick = function() {
            addSubtask(this.parentElement);
        };

        li.appendChild(taskName);
        li.appendChild(taskStatusSpan);
        li.appendChild(taskTypeSpan);
        li.appendChild(statusBtn);
        li.appendChild(subtaskBtn);
        li.appendChild(deleteBtn);

        document.getElementById('taskList' + taskDay).appendChild(li);

        if (!task) {
            taskInput.value = '';
            statusInput.value = 'Not Started';
            dayInput.value = 'Monday';
            typeInput.value = 'repeated';
            startTimeInput.value = '';
            endTimeInput.value = '';
            estimatedTimeInput.value = '';
        }

        return li; // Return the list item to add subtasks later if needed
    }
}

function formatTaskDetails(startTime, endTime, estimatedTime) {
    return `(Start: ${startTime || 'Not Set'}, End: ${endTime || 'Not Set'}, Est. ${estimatedTime || 'Not Set'} hrs)`;
}

function updateStatus(taskStatusSpan) {
    let newStatus;
    switch (taskStatusSpan.textContent) {
        case 'Not Started':
            newStatus = 'In Progress';
            break;
        case 'In Progress':
            newStatus = 'Complete';
            break;
        case 'Complete':
            newStatus = 'Complete & Checked';
            break;
        case 'Complete & Checked':
            newStatus = 'Not Started';
            break;
    }
    taskStatusSpan.textContent = newStatus;
}

function addSubtask(taskElement) {
    const subtaskText = prompt('Enter subtask:');
    if (subtaskText) {
        const subtaskLi = document.createElement('li');
        subtaskLi.style.marginLeft = '20px';
        subtaskLi.className = 'subtask';

        const subtaskName = document.createElement('span');
        subtaskName.textContent = subtaskText;

        const subtaskStatusSpan = document.createElement('span');
        subtaskStatusSpan.textContent = 'Not Started';
        subtaskStatusSpan.className = 'status';

        const subtaskStatusBtn = document.createElement('button');
        subtaskStatusBtn.textContent = 'Update Status';
        subtaskStatusBtn.className = 'status-btn';
        subtaskStatusBtn.onclick = function() {
            updateStatus(subtaskStatusSpan);
        };

        const deleteSubtaskBtn = document.createElement('button');
        deleteSubtaskBtn.textContent = 'Delete Subtask';
        deleteSubtaskBtn.className = 'delete-btn';
        deleteSubtaskBtn.onclick = function() {
            this.parentElement.remove();
        };

        subtaskLi.appendChild(subtaskName);
        subtaskLi.appendChild(subtaskStatusSpan);
        subtaskLi.appendChild(subtaskStatusBtn);
        subtaskLi.appendChild(deleteSubtaskBtn);

        taskElement.appendChild(subtaskLi);
    }
}

function saveTasks() {
    const tasks = [];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    days.forEach(day => {
        const taskItems = document.querySelectorAll('#taskList' + day + ' > li');

        taskItems.forEach(li => {
            const task = {
                text: li.firstChild.textContent,
                status: li.querySelector('.status').textContent,
                type: li.querySelector('.type').textContent,
                day: day,
                startTime: li.firstChild.textContent.match(/Start: (.*?),/)[1] !== 'Not Set' ? li.firstChild.textContent.match(/Start: (.*?),/)[1] : '',
                endTime: li.firstChild.textContent.match(/End: (.*?),/)[1] !== 'Not Set' ? li.firstChild.textContent.match(/End: (.*?),/)[1] : '',
                estimatedTime: li.firstChild.textContent.match(/Est. (.*?) hrs/)[1] !== 'Not Set' ? li.firstChild.textContent.match(/Est. (.*?) hrs/)[1] : '',
                subtasks: []
            };

            // Save subtasks
            const subtasks = li.querySelectorAll('.subtask');
            subtasks.forEach(subtask => {
                task.subtasks.push({
                    text: subtask.firstChild.textContent,
                    status: subtask.querySelector('.status').textContent
                });
            });

            tasks.push(task);
        });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
    alert('Tasks saved!');
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    if (tasks) {
        tasks.forEach(task => {
            const taskLi = addTask(task);
            // Load subtasks
            if (task.subtasks && task.subtasks.length > 0) {
                task.subtasks.forEach(subtask => {
                    addSubtaskToTask(taskLi, subtask);
                });
            }
        });
    }
}

function addSubtaskToTask(taskElement, subtask) {
    const subtaskLi = document.createElement('li');
    subtaskLi.style.marginLeft = '20px';
    subtaskLi.className = 'subtask';

    const subtaskName = document.createElement('span');
    subtaskName.textContent = subtask.text;

    const subtaskStatusSpan = document.createElement('span');
    subtaskStatusSpan.textContent = subtask.status;
    subtaskStatusSpan.className = 'status';

    const subtaskStatusBtn = document.createElement('button');
    subtaskStatusBtn.textContent = 'Update Status';
    subtaskStatusBtn.className = 'status-btn';
    subtaskStatusBtn.onclick = function() {
        updateStatus(subtaskStatusSpan);
    };

    const deleteSubtaskBtn = document.createElement('button');
    deleteSubtaskBtn.textContent = 'Delete Subtask';
    deleteSubtaskBtn.className = 'delete-btn';
    deleteSubtaskBtn.onclick = function() {
        this.parentElement.remove();
    };

    subtaskLi.appendChild(subtaskName);
    subtaskLi.appendChild(subtaskStatusSpan);
    subtaskLi.appendChild(subtaskStatusBtn);
    subtaskLi.appendChild(deleteSubtaskBtn);

    taskElement.appendChild(subtaskLi);
}

function resetTasks() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    days.forEach(day => {
        const taskItems = document.querySelectorAll('#taskList' + day + ' li');

        taskItems.forEach(li => {
            const taskType = li.querySelector('.type').textContent;
            const taskStatus = li.querySelector('.status').textContent;
            
            if (taskType === 'one-time' && taskStatus === 'Complete & Checked') {
                li.remove();
            } else {
                li.querySelector('.status').textContent = 'Not Started';
            }
        });
    });

    alert('Tasks reset to Not Started, and one-time completed tasks removed!');
}

function checkReset() {
    const lastResetDate = localStorage.getItem('lastResetDate');
    const currentDate = new Date();
    
    if (lastResetDate) {
        const lastReset = new Date(lastResetDate);
        const nextReset = new Date(lastReset);
        nextReset.setDate(lastReset.getDate() + 7);
        
        if (currentDate > nextReset && currentDate.getDay() === 0) {
            resetTasks();
            localStorage.setItem('lastResetDate', currentDate.toISOString());
        }
    } else {
        localStorage.setItem('lastResetDate', currentDate.toISOString());
    }
}
