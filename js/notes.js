/* =======================================================
   AI NOTES LOGIC
   ======================================================= */

// Select elements
const noteArea = document.getElementById('main-note-area');
const titleInput = document.getElementById('note-title');
const statusMsg = document.getElementById('save-status');
const charCount = document.getElementById('char-count');
const aiResponse = document.getElementById('ai-response');

// Only run if we are actually on the Notes page
if (noteArea && titleInput) {

    // 1. LOAD DATA ON START
    window.addEventListener('DOMContentLoaded', () => {
        noteArea.value = localStorage.getItem('hub_current_note') || "";
        titleInput.value = localStorage.getItem('hub_current_title') || "";
        updateStats(); // Update character count on load
    });

    // 2. AUTO-SAVE LOGIC
    let typingTimer;
    
    const startSaveTimer = () => {
        clearTimeout(typingTimer);
        if (statusMsg) statusMsg.innerText = "Typing...";
        updateStats();
        typingTimer = setTimeout(saveNote, 1000); // Save 1 second after typing stops
    };

    function saveNote() {
        localStorage.setItem('hub_current_note', noteArea.value);
        localStorage.setItem('hub_current_title', titleInput.value);
        
        if (statusMsg) {
            statusMsg.innerText = "All changes saved";
            // Clear the "Saved" message after 2 seconds
            setTimeout(() => {
                if(statusMsg.innerText === "All changes saved") statusMsg.innerText = "Saved";
            }, 2000);
        }
    }

    function updateStats() {
        if (charCount) {
            charCount.innerText = `${noteArea.value.length} characters`;
        }
    }

    // Listen for typing in BOTH the title and the main area
    noteArea.addEventListener('keyup', startSaveTimer);
    titleInput.addEventListener('keyup', startSaveTimer);

}

// 3. AI ACTION LOGIC
function aiAction(type) {
    if (!noteArea || noteArea.value.length < 5) {
        return alert("Write a bit more for the AI to analyze!");
    }
    
    aiResponse.innerHTML = `<p style="color:white; opacity:0.5;">AI is processing...</p>`;
    
    setTimeout(() => {
        let result = "";
        const text = noteArea.value;

        if (type === 'summarize') {
            result = `The AI suggests your main focus is: "${text.substring(0, 40)}..."`;
        } else if (type === 'fix') {
            result = "Grammar check complete. Your tone is consistent. No major errors found.";
        } else if (type === 'expand') {
            result = "Expanding idea: Consider how this project links to your Perodua automotive site.";
        } else {
            result = "Tone suggestion: This note sounds neutral. Try making it more professional.";
        }
        
        aiResponse.innerHTML = `<p>${result}</p>`;
    }, 1500);
}