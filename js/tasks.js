let tasks = JSON.parse(localStorage.getItem('jackhub_tasks')) || [];

function renderTasks() {
    const todoList = document.getElementById('list-todo');
    const doingList = document.getElementById('list-doing');
    const doneList = document.getElementById('list-done');

    if (!todoList) return;

    // Clear all columns
    todoList.innerHTML = ""; doingList.innerHTML = ""; doneList.innerHTML = "";

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
        
        if (task.status === 'todo') todoList.appendChild(div);
        else if (task.status === 'doing') doingList.appendChild(div);
        else doneList.appendChild(div);
    });

    updateProgress();
    localStorage.setItem('jackhub_tasks', JSON.stringify(tasks));
}

function saveNewTask() {
    const text = document.getElementById('new-task-text');
    const cat = document.getElementById('new-task-cat');
    if (!text.value) return;

    tasks.push({ text: text.value, category: cat.value, status: 'todo' });
    text.value = "";
    document.getElementById('input-area').style.display = "none";
    renderTasks();
}

function moveTask(index, direction) {
    const order = ['todo', 'doing', 'done'];
    let curIdx = order.indexOf(tasks[index].status);
    if (direction === 'next' && curIdx < 2) tasks[index].status = order[curIdx + 1];
    if (direction === 'prev' && curIdx > 0) tasks[index].status = order[curIdx - 1];
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

function updateProgress() {
    const fill = document.getElementById('progress-fill');
    const percentTxt = document.getElementById('progress-percent');
    if (!fill) return;

    if (tasks.length === 0) {
        fill.style.width = "0%";
        percentTxt.innerText = "0%";
        return;
    }
    const done = tasks.filter(t => t.status === 'done').length;
    const percent = Math.round((done / tasks.length) * 100);
    fill.style.width = percent + "%";
    percentTxt.innerText = percent + "%";
}

function openTaskInput() {
    const area = document.getElementById('input-area');
    area.style.display = area.style.display === "none" ? "block" : "none";
}

document.addEventListener('DOMContentLoaded', renderTasks);