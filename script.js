document.addEventListener('DOMContentLoaded', function() {
    checkReset();
    loadTasks();
});

function addTask(task = null) {
    const taskInput = document.getElementById('taskInput');
    const statusInput = document.getElementById('statusInput');
    const dayInput = document.getElementById('dayInput');
    const typeInput = document.getElementById('typeInput');
    
    const taskText = task ? task.text : taskInput.value.trim();
    const taskStatus = task ? task.status : statusInput.value;
    const taskDay = task ? task.day : dayInput.value;
    const taskType = task ? task.type : typeInput.value;

    if (taskText !== '') {
        const li = document.createElement('li');

        const taskName = document.createElement('span');
        taskName.textContent = taskText;

        const taskStatusSpan = document.createElement('span');
        taskStatusSpan.textContent = taskStatus;
        taskStatusSpan.className = 'status';

        const taskTypeSpan = document.createElement('span');
        taskTypeSpan.textContent = taskType;
        taskTypeSpan.className = 'type';

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = function() {
            this.parentElement.remove();
        };

        li.appendChild(taskName);
        li.appendChild(taskStatusSpan);
        li.appendChild(taskTypeSpan);
        li.appendChild(deleteBtn);

        li.onclick = function() {
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
        };

        document.getElementById('taskList' + taskDay).appendChild(li);

        if (!task) {
            taskInput.value = '';
            statusInput.value = 'Not Started';
            dayInput.value = 'Monday';
            typeInput.value = 'repeated';
        }
    }
}

function saveTasks() {
    const tasks = [];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    days.forEach(day => {
        const taskItems = document.querySelectorAll('#taskList' + day + ' li');

        taskItems.forEach(li => {
            const task = {
                text: li.firstChild.textContent,
                status: li.querySelector('.status').textContent,
                type: li.querySelector('.type').textContent,
                day: day
            };
            tasks.push(task);
        });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
    alert('Tasks saved!');
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    if (tasks) {
        tasks.forEach(task => addTask(task));
    }
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
    
    // If there was a reset before, check if it's time to reset again
    if (lastResetDate) {
        const lastReset = new Date(lastResetDate);
        const nextReset = new Date(lastReset);
        nextReset.setDate(lastReset.getDate() + 7); // Set to 7 days after the last reset
        
        // Check if today is after the last reset and it's Sunday
        if (currentDate > nextReset && currentDate.getDay() === 0) {
            resetTasks();
            localStorage.setItem('lastResetDate', currentDate.toISOString());
        }
    } else {
        // If there was no previous reset, set the reset date to the current date
        localStorage.setItem('lastResetDate', currentDate.toISOString());
    }
}
