import { RenderHomeView, ExecuteRandomizeAction } from './tabs/homepage.js';
import { RenderPokedexView } from './tabs/pokedex.js';

class AppEngine {
    constructor() {
        this.activeTab = 'home';
        this.gamesDataset = null;
        this.recentRandomizations = ['Bulbasaur', 'Pikachu', 'Garchomp'];
        this.init();
    }

    async init() {
        await this.loadGlobalData();
        this.setupEventListeners();
        this.mountView(this.activeTab);
    }

    async loadGlobalData() {
        try {
            const response = await fetch('/api/games-data');
            this.gamesDataset = await response.json();
        } catch (err) {
            console.error("System Failure Loading Game Definitions Database Matrix:", err);
        }
    }

    setupEventListeners() {
        document.querySelectorAll('.nav-link').forEach(button => {
            button.addEventListener('click', (e) => {
                document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.activeTab = e.target.getAttribute('data-target');
                this.mountView(this.activeTab);
            });
        });
    }

    updateNumberVariations() {
        const selectedMode = document.getElementById('dex-mode-select').value;
        const label = document.getElementById('variant-label');
        const value = document.getElementById('variant-value');

        const modeMap = {
            national: { lbl: "National:", val: "#001" },
            generation: { lbl: "Generation:", val: "Gen 1 - #001" },
            regional: { lbl: "Paldea Mapping:", val: "#123" },
            custom: { lbl: "Kitakami Index:", val: "#045" }
        };

        label.textContent = modeMap[selectedMode].lbl;
        value.textContent = modeMap[selectedMode].val;
    }

    mountView(tabId) {
        const viewport = document.getElementById('app-viewport');
        viewport.innerHTML = ''; // Wipe canvas clean before component render

        switch (tabId) {
            case 'home':
                viewport.appendChild(RenderHomeView(this.gamesDataset, this.recentRandomizations));
                // Explicit trigger hook bind to dynamic DOM nodes
                document.getElementById('action-randomize-btn')?.addEventListener('click', ExecuteRandomizeAction);
                break;
            case 'pokedex':
                viewport.appendChild(RenderPokedexView());
                break;
            default:
                // Universal fallback container for upcoming tabs
                const fallBackContainer = document.createElement('div');
                fallBackContainer.className = 'placeholder-card';
                fallBackContainer.innerHTML = `<h2>${tabId.toUpperCase().replace('-', ' ')} Hub View Shell</h2><p>Component sub-modules load here dynamically.</p>`;
                viewport.appendChild(fallBackContainer);
                break;
        }
    }
}

// Instantiate to global scope window mounting
window.addEventListener('DOMContentLoaded', () => {
    window.GlobalAppEngine = new AppEngine();
});


// Add imports at top of static/js/main.js
import { RenderTypeCalcView, ProcessTypeCalculation } from './tabs/typecalc.js';
import { RenderTeamBuilderView, TeamBuilderManager } from './tabs/teambuilder.js';

// Inject these case declarations directly into your switch(tabId) statement inside mountView(tabId):
case 'type-calc':
    viewport.appendChild(RenderTypeCalcView());
    document.getElementById('calculate-matchups-btn')?.addEventListener('click', ProcessTypeCalculation);
    break;

case 'team-builder':
    viewport.appendChild(RenderTeamBuilderView());
    const manager = new TeamBuilderManager();
    manager.init().then(() => {
        document.getElementById('apply-builder-filters')?.addEventListener('click', () => manager.applyFilters());
        document.getElementById('btn-export-team')?.addEventListener('click', () => alert(JSON.stringify(manager.activeTeam)));
        document.getElementById('btn-import-team')?.addEventListener('click', () => {
            const dataStr = prompt("Paste exported payload text matrix array format string configurations:");
            if(dataStr) { manager.activeTeam = JSON.parse(dataStr); manager.updateTeamUI(); }
        });
    });
    break;
