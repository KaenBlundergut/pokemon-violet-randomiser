export function RenderPokedexView() {
    const container = document.createElement('div');
    container.className = 'pokedex-tab-layout';

    container.innerHTML = `
        <div class="control-panel-card pokedex-filter-bar">
            <h2>System Pokédex Core</h2>
            <div class="filter-inputs-row">
                <input type="text" id="dex-search-input" class="form-control" placeholder="Search by name or national ID...">
                <select id="dex-type-filter" class="form-control">
                    <option value="all">All Types</option>
                    <option value="fire">Fire</option>
                    <option value="water">Water</option>
                    <option value="grass">Grass</option>
                    <option value="electric">Electric</option>
                    <option value="psychic">Psychic</option>
                    <option value="ghost">Ghost</option>
                    <option value="dragon">Dragon</option>
                </select>
                <button id="dex-search-btn" class="btn btn-primary">Query Engine</button>
            </div>
        </div>

        <div class="pokedex-workspace-grid">
            <!-- Dynamic Grid Workspace Area -->
            <div id="pokedex-results-grid" class="pokedex-grid-scroll-canvas">
                <div class="loading-state">Initialising PokeAPI pipeline...</div>
            </div>

            <!-- Detailed Visual Focus Panel -->
            <div id="pokedex-detail-panel" class="control-panel-card detail-sticky-inspector">
                <div class="empty-inspector-message">
                    <h3>Data Profile Monitor</h3>
                    <p>Select any entity from the registry grid to inspect real-time metrics, evolutions, and base stat structures.</p>
                </div>
            </div>
        </div>
    `;

    // Initialize data download immediately upon component insertion
    setTimeout(() => InitializePokedexEngine(), 50);

    return container;
}

// Internal State Matrix Cache Storage Array
let loadedPokemonList = [];

async function InitializePokedexEngine() {
    const grid = document.getElementById('pokedex-results-grid');
    if (!grid) return;

    try {
        // Fetching initial Gen 1 batch to establish lightning-fast interface response loading speed
        const response = await fetch('https://pokeapi.co');
        const data = await response.json();
        
        loadedPokemonList = data.results.map((item, index) => ({
            name: item.name,
            id: index + 1,
            url: item.url,
            sprite: `https://githubusercontent.com{index + 1}.png`
        }));

        RenderGridInterface(loadedPokemonList);
        SetupLiveSearchListeners();

    } catch (err) {
        grid.innerHTML = `<div class="error-state">API Pipeline Connection Interrupted. Ensure your machine has active internet access.</div>`;
        console.error("PokeAPI network stream ingestion failure:", err);
    }
}

function RenderGridInterface(list) {
    const grid = document.getElementById('pokedex-results-grid');
    if (!grid) return;

    if (list.length === 0) {
        grid.innerHTML = `<div class="loading-state">No entity configurations match current structural filters.</div>`;
        return;
    }

    grid.innerHTML = list.map(poke => `
        <div class="pokedex-mini-card" data-id="${poke.id}">
            <div class="mini-card-id">#${String(poke.id).padStart(3, '0')}</div>
            <img src="${poke.sprite}" alt="${poke.name}" loading="lazy">
            <div class="mini-card-name">${poke.name.toUpperCase()}</div>
        </div>
    `).join('');

    // Attach click events to cards to trigger details inspector panel
    grid.querySelectorAll('.pokedex-mini-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const cardId = e.currentTarget.getAttribute('data-id');
            InspectSpecificPokemonProfile(cardId);
        });
    });
}

function SetupLiveSearchListeners() {
    const btn = document.getElementById('dex-search-btn');
    const input = document.getElementById('dex-search-input');

    const handleFiltering = () => {
        const query = input.value.toLowerCase().trim();
        const filtered = loadedPokemonList.filter(p => 
            p.name.toLowerCase().includes(query) || String(p.id) === query
        );
        RenderGridInterface(filtered);
    };

    btn?.addEventListener('click', handleFiltering);
    input?.addEventListener('keyup', (e) => { if(e.key === "Enter") handleFiltering(); });
}

async function InspectSpecificPokemonProfile(id) {
    const detailPanel = document.getElementById('pokedex-detail-panel');
    if (!detailPanel) return;

    detailPanel.innerHTML = `<div class="loading-state">Streaming entity architecture vectors...</div>`;

    try {
        const response = await fetch(`https://pokeapi.co{id}`);
        const data = await response.json();

        const types = data.types.map(t => `<span class="type-badge badge-${t.type.name}">${t.type.name.toUpperCase()}</span>`).join(' ');
        const abilities = data.abilities.map(a => `<li>${a.ability.name.replace('-', ' ')} ${a.is_hidden ? '<span class="hidden-flag">[HA]</span>' : ''}</li>`).join('');
        
        // Dynamic generation calculation metrics
        const baseGeneration = id <= 151 ? "Generation I" : id <= 251 ? "Generation II" : id <= 386 ? "Generation III" : "Generation IV+";

        detailPanel.innerHTML = `
            <div class="inspector-scroll-area">
                <div class="inspector-hero-header">
                    <span class="inspector-national-id">National Index: #${String(data.id).padStart(3, '0')}</span>
                    <h2>${data.name.toUpperCase()}</h2>
                    <div class="generation-indicator-tag">${baseGeneration}</div>
                </div>

                <div class="inspector-sprite-row">
                    <div class="sprite-box">
                        <small>Standard Sprite</small>
                        <img src="${data.sprites.front_default || ''}" alt="Standard">
                    </div>
                    <div class="sprite-box">
                        <small>Shiny Mutation Variant</small>
                        <img src="${data.sprites.front_shiny || ''}" alt="Shiny">
                    </div>
                </div>

                <div class="inspector-meta-specs">
                    <p><strong>Structural Type Mapping:</strong> ${types}</p>
                    <p><strong>Physical Dimensions:</strong> Ht: ${(data.height/10).toFixed(1)}m | Wt: ${(data.weight/10).toFixed(1)}kg</p>
                </div>

                <div class="inspector-stats-section">
                    <h3>Base Stat Vector Blueprint Matrix</h3>
                    ${data.stats.map(s => {
                        const percent = Math.min((s.base_stat / 255) * 100, 100);
                        return `
                            <div class="stat-bar-container">
                                <div class="stat-label-row">
                                    <span>${s.stat.name.toUpperCase().replace('-', ' ')}</span>
                                    <strong>${s.base_stat}</strong>
                                </div>
                                <div class="stat-bar-track">
                                    <div class="stat-bar-fill" style="width: ${percent}%;"></div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>

                <div class="inspector-abilities-list">
                    <h3>Inherent Feature Abilities</h3>
                    <ul>${abilities}</ul>
                </div>
            </div>
        `;

    } catch (err) {
        detailPanel.innerHTML = `<div class="error-state">Failed to stream full data profile matrix.</div>`;
        console.error("Detail profile collection matrix breakdown:", err);
    }
}
