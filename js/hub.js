/* =======================================================
   1. GLOBAL STATE
   ======================================================= */
let date = new Date(); 
let currYear = date.getFullYear(); 
let currMonth = date.getMonth();

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

document.addEventListener('DOMContentLoaded', () => {
    startClock();
    renderCalendar();
    loadSavedData();
    initMedia();
    loadHomeAgenda();
});

/* =======================================================
   2. LIVE CLOCK
   ======================================================= */
function startClock() {
    const clockElement = document.getElementById('live-clock');
    setInterval(() => {
        const now = new Date();
        clockElement.innerText = now.toLocaleTimeString('en-GB', { hour12: false });
    }, 1000);
}

/* =======================================================
   3. DYNAMIC CALENDAR (Calculates any Month/Year)
   ======================================================= */
function renderCalendar() {
    const grid = document.getElementById('calendar-days');
    const monthYearLabel = document.getElementById('month-year');
    if (!grid) return;

    monthYearLabel.innerText = `${months[currMonth]} ${currYear}`;

    let firstDayOfMonth = new Date(currYear, currMonth, 1).getDay(); 
    let lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate(); 
    
    grid.innerHTML = "";

    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('calendar-day', 'empty');
        grid.appendChild(emptyDiv);
    }

    for (let i = 1; i <= lastDateOfMonth; i++) {
        const day = document.createElement('div');
        day.classList.add('calendar-day');
        day.innerText = i;

        // Highlight Today
        const today = new Date();
        if (i === today.getDate() && currMonth === today.getMonth() && currYear === today.getFullYear()) {
            day.classList.add('today');
        }

        // Check for events to show dots
        const dateKey = `${currYear}-${currMonth}-${i}`;
        if (localStorage.getItem(dateKey)) {
            day.classList.add('has-event');
        }

        grid.appendChild(day);
    }
}

// Calendar Nav
document.getElementById('prev').onclick = () => {
    currMonth--;
    if (currMonth < 0) { currMonth = 11; currYear--; }
    renderCalendar();
};
document.getElementById('next').onclick = () => {
    currMonth++;
    if (currMonth > 11) { currMonth = 0; currYear++; }
    renderCalendar();
};

/* =======================================================
   4. TODAY'S AGENDA SYNC
   ======================================================= */
function loadHomeAgenda() {
    const container = document.getElementById('home-agenda-list');
    if (!container) return;

    const today = new Date();
    const key = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    const events = JSON.parse(localStorage.getItem(key)) || [];

    if (events.length === 0) {
        container.innerHTML = `<p style="opacity:0.5; font-size:1.3rem;">No missions for today.</p>`;
    } else {
        container.innerHTML = events.map((ev, index) => `
            <div class="event-item-mini">
                <span>${ev}</span>
                <i class="fa-solid fa-circle-check" style="color:var(--accent); cursor:pointer;" onclick="deleteAgendaItem('${key}', ${index})"></i>
            </div>
        `).join('');
    }
}

function deleteAgendaItem(key, index) {
    let events = JSON.parse(localStorage.getItem(key));
    events.splice(index, 1);
    if (events.length === 0) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(events));
    loadHomeAgenda();
    renderCalendar();
}

/* =======================================================
   5. SMART MEDIA PLAYER
   ======================================================= */
function toggleMediaInput() {
    const box = document.getElementById('media-input-box');
    box.style.display = (box.style.display === 'none') ? 'flex' : 'none';
}

function updateMedia() {
    const url = document.getElementById('media-url').value;
    const player = document.getElementById('main-player');
    const label = document.getElementById('player-type');
    if (!url) return;

    if (url.includes("spotify.com")) {
        let embedUrl = url.replace("spotify.com/", "spotify.com/embed/");
        player.src = embedUrl;
        player.height = "80";
        label.innerText = "Spotify Mode";
        localStorage.setItem('hub_media_url', embedUrl);
        localStorage.setItem('hub_media_type', 'spotify');
    } 
    else if (url.includes("youtube.com") || url.includes("youtu.be")) {
        let videoId = url.includes("v=") ? url.split("v=")[1].split("&")[0] : url.split("youtu.be/")[1];
        let embedUrl = `https://www.youtube.com/embed/${videoId}`;
        player.src = embedUrl;
        player.height = "180";
        label.innerText = "YouTube Mode";
        localStorage.setItem('hub_media_url', embedUrl);
        localStorage.setItem('hub_media_type', 'youtube');
    }
    toggleMediaInput();
}

function initMedia() {
    const savedUrl = localStorage.getItem('hub_media_url');
    const savedType = localStorage.getItem('hub_media_type');
    if (savedUrl) {
        const player = document.getElementById('main-player');
        player.src = savedUrl;
        player.height = (savedType === 'youtube') ? "180" : "80";
        document.getElementById('player-type').innerText = (savedType === 'spotify') ? "Spotify Mode" : "YouTube Mode";
    }
}

/* =======================================================
   6. MISSIONS (TO-DO)
   ======================================================= */
function addTask() {
    const input = document.getElementById('task-input');
    if (input.value.trim() === '') return;
    const taskObj = { text: input.value, id: Date.now() };
    
    let tasks = JSON.parse(localStorage.getItem('hub_tasks')) || [];
    tasks.push(taskObj);
    localStorage.setItem('hub_tasks', JSON.stringify(tasks));
    
    renderTaskItem(taskObj);
    input.value = '';
}

function renderTaskItem(task) {
    const list = document.getElementById('task-list');
    const li = document.createElement('li');
    li.innerHTML = `<span>${task.text}</span> <i class="fa-solid fa-trash" onclick="deleteTask(${task.id}, this)"></i>`;
    list.appendChild(li);
}

function deleteTask(id, element) {
    let tasks = JSON.parse(localStorage.getItem('hub_tasks')) || [];
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem('hub_tasks', JSON.stringify(tasks));
    element.parentElement.remove();
}

/* =======================================================
   7. AI SIMULATION & AUTO-SAVE
   ======================================================= */
function askAI(type) {
    const note = document.getElementById('note-input');
    if (note.value === "") return;
    const original = note.value;
    note.value = "AI Processing...";
    setTimeout(() => {
        note.value = type === 'summarize' ? `SUMMARY: ${original.substring(0, 50)}...` : `MISSIONS GENERATED:\n1. Execute ${original}\n2. Review results`;
        localStorage.setItem('hub_note', note.value);
    }, 1000);
}

function loadSavedData() {
    const savedNote = localStorage.getItem('hub_note');
    if(savedNote) document.getElementById('note-input').value = savedNote;
    const savedTasks = JSON.parse(localStorage.getItem('hub_tasks')) || [];
    savedTasks.forEach(renderTaskItem);
}

// Save note on every key stroke
document.getElementById('note-input').addEventListener('input', (e) => {
    localStorage.setItem('hub_note', e.target.value);
});