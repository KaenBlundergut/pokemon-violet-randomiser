export function RenderTeamBuilderView() {
    const container = document.createElement('div');
    container.className = 'team-builder-grid';
    
    container.innerHTML = `
        <div class="control-panel-card filters-sidebar">
            <h3>Filter Matrix Engines</h3>
            <input type="text" id="builder-search" class="form-control" placeholder="Search by name...">
            
            <fieldset class="options-checkbox-matrix" style="margin-top:15px; grid-template-columns:1fr;">
                <legend>Class Filter Categorization</legend>
                <label><input type="checkbox" class="class-filter" value="Legendary"> Legendary</label>
                <label><input type="checkbox" class="class-filter" value="Ultra Beast"> Ultra Beast</label>
                <label><input type="checkbox" class="class-filter" value="Paradox"> Paradox</label>
                <label><input type="checkbox" id="gmax-filter"> Gigantamax Able</label>
            </fieldset>

            <button id="apply-builder-filters" class="btn btn-primary btn-block">Apply Filters</button>
            <div class="team-io-cluster" style="margin-top:20px;">
                <button id="btn-export-team" class="nav-link" style="width:100%; text-align:center; background:#334155; margin-bottom:5px;">Export Squad</button>
                <button id="btn-import-team" class="nav-link" style="width:100%; text-align:center; background:#334155;">Import Squad</button>
            </div>
        </div>
        
        <div class="control-panel-card selection-workbench">
            <h3>Active Roster Selection Workspace (<span id="team-size-counter">0</span>/6)</h3>
            <div id="active-team-slots" class="options-checkbox-matrix" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 20px;">
                <!-- Chosen items spawn here -->
            </div>
            
            <h3>Available Engine Roster Results</h3>
            <div id="filtered-pokemon-results" class="options-checkbox-matrix" style="grid-template-columns: repeat(2, 1fr);">
                <!-- Search outputs populate here -->
            </div>
        </div>
    `;
    return container;
}

export class TeamBuilderManager {
    constructor() {
        this.allPokemon = [];
        this.activeTeam = [];
    }

    async init() {
        const res = await fetch('/api/pokemon-pool');
        this.allPokemon = await res.json();
        this.renderResults(this.allPokemon);
    }

    renderResults(list) {
        const target = document.getElementById('filtered-pokemon-results');
        if(!target) return;
        target.innerHTML = list.map(p => `
            <div class="placeholder-card" style="padding:10px; text-align:center;">
                <strong>${p.name}</strong> <span style="font-size:11px; color:#94a3b8;">(${p.class})</span>
                <button class="add-to-team-btn btn" data-id="${p.id}" style="background:var(--accent-red); color:white; font-size:11px; padding:3px 8px; border:none; border-radius:4px; margin-top:5px; cursor:pointer; width:100%;">Add</button>
            </div>
        `).join('');
        
        // Dynamic event attachments
        target.querySelectorAll('.add-to-team-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.addToTeam(parseInt(e.target.getAttribute('data-id'))));
        });
    }

    addToTeam(id) {
        if(this.activeTeam.length >= 6) { alert("Active standard lineup maximum configuration limit reached!"); return; }
        const item = this.allPokemon.find(p => p.id === id);
        if(item) {
            this.activeTeam.push(item);
            this.updateTeamUI();
        }
    }

    updateTeamUI() {
        document.getElementById('team-size-counter').textContent = this.activeTeam.length;
        const target = document.getElementById('active-team-slots');
        target.innerHTML = this.activeTeam.map((p, idx) => `
            <div class="placeholder-card" style="padding:10px; border-color:var(--accent-red); text-align:center;">
                <strong>${p.name}</strong>
                <button class="rem-team-btn" data-idx="${idx}" style="background:none; border:none; color:var(--accent-red); cursor:pointer; display:block; margin:5px auto 0 auto;">Remove</button>
            </div>
        `).join('');
        
        target.querySelectorAll('.rem-team-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.activeTeam.splice(parseInt(e.target.getAttribute('data-idx')), 1);
                this.updateTeamUI();
            });
        });
    }

    applyFilters() {
        const query = document.getElementById('builder-search').value.toLowerCase();
        const checkedClasses = Array.from(document.querySelectorAll('.class-filter:checked')).map(cb => cb.value);
        const gmaxOnly = document.getElementById('gmax-filter').checked;

        const filtered = this.allPokemon.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(query);
            const matchesClass = checkedClasses.length === 0 || checkedClasses.includes(p.class);
            const matchesGmax = !gmaxOnly || p.gmax;
            return matchesSearch && matchesClass && matchesGmax;
        });
        this.renderResults(filtered);
    }
}
