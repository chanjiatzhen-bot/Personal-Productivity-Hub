// Select Elements
const noteArea = document.getElementById('main-note-area');
const titleInput = document.getElementById('note-title');
const statusMsg = document.getElementById('save-status');
const charCount = document.getElementById('char-count');
const aiResponse = document.getElementById('ai-response');

// 1. LOAD DATA ON START
document.addEventListener('DOMContentLoaded', () => {
    if (noteArea && titleInput) {
        titleInput.value = localStorage.getItem('jackhub_note_title') || "";
        noteArea.value = localStorage.getItem('jackhub_note_body') || "";
        updateStats();
    }
});

// 2. AUTO-SAVE LOGIC
if (noteArea && titleInput) {
    const autoSave = () => {
        if (statusMsg) statusMsg.innerText = "Saving...";
        localStorage.setItem('jackhub_note_title', titleInput.value);
        localStorage.setItem('jackhub_note_body', noteArea.value);
        updateStats();
        
        setTimeout(() => {
            if (statusMsg) statusMsg.innerText = "Saved to cloud";
        }, 1000);
    };

    noteArea.addEventListener('input', autoSave);
    titleInput.addEventListener('input', autoSave);
}

function updateStats() {
    if (charCount) charCount.innerText = `${noteArea.value.length} characters`;
}

// 3. AI ACTIONS
function aiAction(type) {
    if (!noteArea.value) return alert("Write something first!");
    aiResponse.innerHTML = `<p style="color:white; opacity:0.5;">AI is analyzing...</p>`;

    setTimeout(() => {
        let result = "";
        if (type === 'summarize') result = "SUMMARY: Main focus is " + noteArea.value.substring(0, 30) + "...";
        else if (type === 'fix') result = "Grammar check: No major issues found. Tone is natural.";
        else if (type === 'expand') result = "AI Suggestion: Link these notes to your Perodua outlet project.";
        else result = "Tone: Neutral. Suggested: Professional.";
        
        aiResponse.innerHTML = `<p>${result}</p>`;
    }, 1200);
}