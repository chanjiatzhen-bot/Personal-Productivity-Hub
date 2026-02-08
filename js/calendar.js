let date = new Date();
let currYear = date.getFullYear();
let currMonth = date.getMonth();
let selectedDateKey = "";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function renderCalendar() {
    const grid = document.getElementById("calendar-grid");
    const monthYearLabel = document.getElementById("display-month");
    if (!grid) return;

    monthYearLabel.innerText = months[currMonth];
    document.getElementById("display-year").innerText = currYear;

    let firstDay = new Date(currYear, currMonth, 1).getDay(); 
    let lastDate = new Date(currYear, currMonth + 1, 0).getDate(); 
    
    grid.innerHTML = "";

    for (let i = 0; i < firstDay; i++) grid.innerHTML += `<div class="day-box empty"></div>`;

    for (let i = 1; i <= lastDate; i++) {
        let key = `event_${currYear}_${currMonth}_${i}`;
        let hasEvent = localStorage.getItem(key) ? "has-event" : "";
        let isToday = (i === new Date().getDate() && currMonth === new Date().getMonth()) ? "today" : "";

        grid.innerHTML += `<div class="day-box ${isToday} ${hasEvent}" onclick="selectDate(${i})">${i}</div>`;
    }
}

function selectDate(day) {
    selectedDateKey = `event_${currYear}_${currMonth}_${day}`;
    document.getElementById('selected-date-label').innerText = `${months[currMonth]} ${day}, ${currYear}`;
    loadAgenda();
}

function loadAgenda() {
    const list = document.getElementById('event-list');
    const events = JSON.parse(localStorage.getItem(selectedDateKey)) || [];
    
    list.innerHTML = events.length === 0 ? `<p>No events.</p>` : 
        events.map((ev, i) => `<div class="event-item"><span>${ev}</span><i class="fa-solid fa-trash" onclick="deleteEvent(${i})"></i></div>`).join('');
}

function saveEvent() {
    const input = document.getElementById('event-input');
    if (!selectedDateKey || !input.value) return;

    let events = JSON.parse(localStorage.getItem(selectedDateKey)) || [];
    events.push(input.value);
    localStorage.setItem(selectedDateKey, JSON.stringify(events));
    input.value = "";
    loadAgenda();
    renderCalendar();
}

function deleteEvent(index) {
    let events = JSON.parse(localStorage.getItem(selectedDateKey));
    events.splice(index, 1);
    if (events.length === 0) localStorage.removeItem(selectedDateKey);
    else localStorage.setItem(selectedDateKey, JSON.stringify(events));
    loadAgenda();
    renderCalendar();
}

// Nav Listeners
document.getElementById('prev-month').onclick = () => { currMonth--; if(currMonth<0){currMonth=11; currYear--;} renderCalendar(); };
document.getElementById('next-month').onclick = () => { currMonth++; if(currMonth>11){currMonth=0; currYear++;} renderCalendar(); };

document.addEventListener('DOMContentLoaded', renderCalendar);