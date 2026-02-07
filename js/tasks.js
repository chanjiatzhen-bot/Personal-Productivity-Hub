let tasks = JSON.parse(localStorage.getItem('hub_tasks')) || [];

function renderTasks() {
    const containers = {
        todo: document.getElementById('list-todo'),
        doing: document.getElementById('list-doing'),
        done: document.getElementById('list-done')
    };

    // Clear lists
    Object.values(containers).forEach(c => c.innerHTML = "");

    tasks.forEach((task, index) => {
        const div = document.createElement('div');
        div.className = 'task-item';
        div.innerHTML = `
            <h5>${task.text}</h5>
            <span class="task-tag">${task.category}</span>
            <div style="margin-top:10px; display:flex; gap:10px;">
                <small onclick="moveTask(${index}, 'prev')" style="cursor:pointer; color:#777">Back</small>
                <small onclick="moveTask(${index}, 'next')" style="cursor:pointer; color:var(--accent)">Advance</small>
                <small onclick="deleteTask(${index})" style="cursor:pointer; color:#777; margin-left:auto">Delete</small>
            </div>
        `;
        containers[task.status].appendChild(div);
    });

    updateProgress();
    localStorage.setItem('hub_tasks', JSON.stringify(tasks));
}

function moveTask(index, direction) {
    const statusOrder = ['todo', 'doing', 'done'];
    let currentIdx = statusOrder.indexOf(tasks[index].status);

    if (direction === 'next' && currentIdx < 2) tasks[index].status = statusOrder[currentIdx + 1];
    if (direction === 'prev' && currentIdx > 0) tasks[index].status = statusOrder[currentIdx - 1];

    renderTasks();
}

function saveNewTask() {
    const text = document.getElementById('new-task-text').value;
    const cat = document.getElementById('new-task-cat').value;
    if (!text) return;

    tasks.push({ text, category: cat, status: 'todo' });
    document.getElementById('new-task-text').value = "";
    document.getElementById('input-area').style.display = "none";
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

function updateProgress() {
    if (tasks.length === 0) {
        document.getElementById('progress-fill').style.width = "0%";
        document.getElementById('progress-percent').innerText = "0%";
        return;
    }
    const doneCount = tasks.filter(t => t.status === 'done').length;
    const percent = Math.round((doneCount / tasks.length) * 100);
    document.getElementById('progress-fill').style.width = percent + "%";
    document.getElementById('progress-percent').innerText = percent + "%";
}

function openTaskInput() {
    const el = document.getElementById('input-area');
    el.style.display = el.style.display === "none" ? "block" : "none";
}

renderTasks();