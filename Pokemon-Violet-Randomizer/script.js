// Baseline database categorized by DLC vs Base game
const defaultDatabase = [
    // Paldea Base Game Defaults
    { text: "Shiny Hunt Iron Valiant (Isolated)", count: 1, type: "Base" },
    { text: "Shiny Hunt Roaring Moon (Isolated)", count: 1, type: "Base" },
    { text: "Tera Raid Battles 6-Star", count: 5, type: "Base" },
    { text: "Academy Ace Tournament Run", count: 2, type: "Base" },
    { text: "Gimmighoul Coin Hunting (Chests)", count: 5, type: "Base" },
    
    // Teal Mask DLC 1 Defaults
    { text: "Ogre Oustin' (Hard Mode)", count: 1, type: "Teal Mask" },
    { text: "Shiny Hunt Syrupy Applin", count: 1, type: "Teal Mask" },
    
    // Indigo Disk DLC 2 Defaults
    { text: "Shiny Hunt Alolan Vulpix", count: 1, type: "Indigo Disk" },
    { text: "BBQ Quests (Terrarium Group)", count: 10, type: "Indigo Disk" },
    { text: "Synchro Machine Exploration", count: 1, type: "Indigo Disk" },
    { text: "Item Printer Spins (Max Upgraded)", count: 20, type: "Indigo Disk" },
    { text: "BBQ Elite Four Rematch Challenge", count: 1, type: "Indigo Disk" }
];


// Load from LocalStorage or fall back to baseline defaults
let options = JSON.parse(localStorage.getItem('violetOptions')) || [...defaultDatabase];
let completed = JSON.parse(localStorage.getItem('violetCompleted')) || [];

// Hook HTML Elements safely
const gameVersion = document.getElementById('game-version');
const activitySelect = document.getElementById('activity-select');
const amountInput = document.getElementById('amount-input');
const optionsPoolEl = document.getElementById('options-pool');
const completedPoolEl = document.getElementById('completed-pool');
const poolCountEl = document.getElementById('pool-count');
const resultDisplay = document.getElementById('result-display');
const rollBtn = document.getElementById('roll-btn');

// Saves dataset changes straight to local storage
function saveToStorage() {
    localStorage.setItem('violetOptions', JSON.stringify(options));
    localStorage.setItem('violetCompleted', JSON.stringify(completed));
}

// Draw lists to the user view screen
function renderLists() {
    optionsPoolEl.innerHTML = '';
    completedPoolEl.innerHTML = '';
    poolCountEl.textContent = options.length;

    // Draw active pool items
    options.forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${item.text} {${item.count}}</span> <span class="badge">${item.type}</span>`;
        optionsPoolEl.appendChild(li);
    });

    // Draw historical completed list items
    completed.forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${item.text} {${item.count}}</span> <span class="badge">${item.type}</span>`;
        completedPoolEl.appendChild(li);
    });
}

// Add custom custom entry
document.getElementById('add-btn').addEventListener('click', () => {
    const activity = activitySelect.value;
    const amount = parseInt(amountInput.value) || 1;
    const type = gameVersion.value;

    options.push({ text: activity, count: amount, type: type });
    saveToStorage();
    renderLists();
});

// Wipe active array pool clean
document.getElementById('clear-btn').addEventListener('click', () => {
    options = [];
    saveToStorage();
    renderLists();
    resultDisplay.textContent = 'Active pool emptied!';
    resultDisplay.className = 'idle';
});

// Wipe historical tracker clean
document.getElementById('clear-completed-btn').addEventListener('click', () => {
    completed = [];
    saveToStorage();
    renderLists();
});

// Restore base factory defaults
document.getElementById('reset-database-btn').addEventListener('click', () => {
    options = [...defaultDatabase];
    saveToStorage();
    renderLists();
    resultDisplay.textContent = 'Database Restored!';
    resultDisplay.className = 'idle';
});

// Animation Roll & Eliminate Engine
rollBtn.addEventListener('click', () => {
    if (options.length === 0) {
        resultDisplay.textContent = 'Pool is empty! Click "Load Defaults".';
        resultDisplay.className = 'idle';
        return;
    }

    rollBtn.disabled = true;
    resultDisplay.className = 'rolling';
    let cycles = 0;
    const totalFlips = 12;

    const spinTimer = setInterval(() => {
        const tempIdx = Math.floor(Math.random() * options.length);
        const tempItem = options[tempIdx];
        resultDisplay.textContent = `🎰 [${tempItem.type}] ${tempItem.text} {${tempItem.count}}`;
        cycles++;

        if (cycles >= totalFlips) {
            clearInterval(spinTimer);

            // Final Choice selection calculations
            const finalIdx = Math.floor(Math.random() * options.length);
            const chosenItem = options[finalIdx];

            // Splice array out from current pool and push directly into completed array
            options.splice(finalIdx, 1);
            completed.unshift(chosenItem); // Adds newest elements to the top of list view

            // Commit state to save structures and repaint views
            saveToStorage();
            renderLists();

            resultDisplay.textContent = `🎯 ${chosenItem.text} {${chosenItem.count}}`;
            resultDisplay.className = 'selected';
            rollBtn.disabled = false;
        }
    }, 100);
});

// Initial boot script execution render
renderLists();
