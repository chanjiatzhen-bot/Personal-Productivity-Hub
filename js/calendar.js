let date = new Date(); // Defaults to system date (Feb 2026 for you)
let currYear = date.getFullYear();
let currMonth = date.getMonth();

let selectedDateKey = ""; // To track which day we are looking at

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// --- 1. RENDER THE CALENDAR ---
function renderCalendar() {
    const grid = document.getElementById("calendar-grid");
    document.getElementById("display-month").innerText = months[currMonth];
    document.getElementById("display-year").innerText = currYear;

    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(); 
    let lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(); 
    
    grid.innerHTML = "";

    // Padding for start of month
    for (let i = 0; i < firstDayofMonth; i++) {
        grid.innerHTML += `<div class="day-box empty"></div>`;
    }

    // Days of the month
    for (let i = 1; i <= lastDateofMonth; i++) {
        let isToday = i === new Date().getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear() ? "today" : "";
        
        // Check if day has saved events
        let dateKey = `${currYear}-${currMonth}-${i}`;
        let hasEvent = localStorage.getItem(dateKey) ? "has-event" : "";

        grid.innerHTML += `<div class="day-box ${isToday} ${hasEvent}" onclick="selectDate(${i})">${i}</div>`;
    }
}

// --- 2. SELECT A DATE & SHOW AGENDA ---
function selectDate(day) {
    selectedDateKey = `${currYear}-${currMonth}-${day}`;
    document.getElementById('selected-date-label').innerText = `${months[currMonth]} ${day}, ${currYear}`;
    loadEvents();
}

function loadEvents() {
    const list = document.getElementById('event-list');
    const saved = JSON.parse(localStorage.getItem(selectedDateKey)) || [];
    
    if (saved.length === 0) {
        list.innerHTML = `<div class="empty-state"><p>No events scheduled.</p></div>`;
    } else {
        list.innerHTML = saved.map(ev => `<div class="event-item">${ev}</div>`).join('');
    }
}

function saveEvent() {
    const input = document.getElementById('event-input');
    if (!selectedDateKey) return alert("Select a date on the grid first!");
    if (input.value.trim() === "") return;

    let saved = JSON.parse(localStorage.getItem(selectedDateKey)) || [];
    saved.push(input.value);
    localStorage.setItem(selectedDateKey, JSON.stringify(saved));
    
    input.value = "";
    loadEvents();
    renderCalendar(); // Refresh grid to show the glowing dot
}

// --- 3. CONTROLS ---
document.getElementById('prev-month').onclick = () => { currMonth--; if(currMonth < 0){ currMonth=11; currYear--; } renderCalendar(); };
document.getElementById('next-month').onclick = () => { currMonth++; if(currMonth > 11){ currMonth=0; currYear++; } renderCalendar(); };
document.getElementById('go-today').onclick = () => { date = new Date(); currYear = date.getFullYear(); currMonth = date.getMonth(); renderCalendar(); };

renderCalendar();

function loadEvents() {
    const list = document.getElementById('event-list');
    const saved = JSON.parse(localStorage.getItem(selectedDateKey)) || [];
    
    if (saved.length === 0) {
        list.innerHTML = `<div class="empty-state"><p>No events scheduled.</p></div>`;
    } else {
        // Updated to include a delete button for each item
        list.innerHTML = saved.map((ev, index) => `
            <div class="event-item">
                <span>${ev}</span>
                <i class="fa-solid fa-trash-can delete-icon" onclick="deleteEvent(${index})"></i>
            </div>
        `).join('');
    }
}

function deleteEvent(index) {
    let saved = JSON.parse(localStorage.getItem(selectedDateKey)) || [];
    saved.splice(index, 1); // Remove the specific item
    
    if (saved.length === 0) {
        localStorage.removeItem(selectedDateKey); // Clean up storage if empty
    } else {
        localStorage.setItem(selectedDateKey, JSON.stringify(saved));
    }
    
    loadEvents();
    renderCalendar(); // Refresh dots on the grid
}