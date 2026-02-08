// 1. DOWNLOAD DATA FUNCTION
function downloadBackup() {
    // Collect every bit of data we've saved in the browser
    const allData = {
        notes: localStorage.getItem('hub_note'),
        tasks: localStorage.getItem('hub_tasks'),
        transactions: localStorage.getItem('transactions'),
        mediaUrl: localStorage.getItem('hub_media_url'),
        // Add any other keys you found in your 'Application' tab
    };

    const dataStr = JSON.stringify(allData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    // Filename will look like: jackhub_backup_2026-02-08.json
    link.download = `jackhub_backup_${new Date().toISOString().slice(0,10)}.json`;
    link.click();
    
    alert("Hub data saved to your Downloads folder!");
}

// 2. RESTORE DATA FUNCTION
function importBackup(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Put data back into LocalStorage
            if (data.notes) localStorage.setItem('hub_note', data.notes);
            if (data.tasks) localStorage.setItem('hub_tasks', data.tasks);
            if (data.transactions) localStorage.setItem('transactions', data.transactions);
            if (data.mediaUrl) localStorage.setItem('hub_media_url', data.mediaUrl);

            alert("Data successfully restored from laptop! Reloading...");
            window.location.href = "index.html"; // Send you back home
        } catch (err) {
            alert("Error: Invalid backup file.");
        }
    };
    reader.readAsText(file);
}

// 3. WIPE DATA FUNCTION
function clearEverything() {
    if (confirm("Are you sure? This will delete ALL your notes and tasks from this browser.")) {
        localStorage.clear();
        location.reload();
    }
}