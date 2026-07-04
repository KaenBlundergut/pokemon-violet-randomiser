export function RenderHomeView(catalog, history) {
    const section = document.createElement('section');
    section.className = 'homepage-view-grid';

    // Build lists for choices dynamically
    let genOptions = '';
    Object.keys(catalog || {}).forEach((gen, index) => {
        genOptions += `<option value="${index + 1}">${gen}</option>`;
    });

    section.innerHTML = `
        <div class="control-panel-card">
            <h2 class="section-title">Pokémon Randomizer Core Panel</h2>
            
            <div class="form-group">
                <label>Generation Number Selection Context</label>
                <select id="rand-gen-select" class="form-control">
                    ${genOptions || '<option>Gen 1</option>'}
                </select>
            </div>

            <div class="form-group">
                <label>Target Core ROM Version Base</label>
                <select id="rand-game-select" class="form-control">
                    <option>Pokémon Red</option>
                    <option>Pokémon Blue</option>
                    <option>Pokémon Violet</option>
                </select>
            </div>

            <div class="form-group">
                <label>Target Game Addon DLC Expansion Mapping</label>
                <select id="rand-dlc-select" class="form-control">
                    <option value="none">None</option>
                    <option value="teal-mask">The Teal Mask DLC</option>
                    <option value="indigo-disk">The Indigo Disk DLC</option>
                </select>
            </div>

            <fieldset class="options-checkbox-matrix">
                <legend>Randomizer Core Subroutine Flags</legend>
                <label><input type="checkbox" value="starters" checked> Random Starter Vectors</label>
                <label><input type="checkbox" value="wild"> Random Wild Spawns</label>
                <label><input type="checkbox" value="trainers"> Randomize Trainer Rosters</label>
                <label><input type="checkbox" value="evolutions"> Chaos Evolutions Pathing</label>
                <label><input type="checkbox" value="abilities"> Scramble Passive Abilities</label>
                <label><input type="checkbox" value="items"> Unpredictable Field Item Spawns</label>
            </fieldset>

            <div class="form-group">
                <label>Scaling Aggression Variable (Difficulty Modifiers)</label>
                <div class="radio-button-cluster">
                    <label><input type="radio" name="diff" value="easy"> Easy</label>
                    <label><input type="radio" name="diff" value="normal" checked> Normal</label>
                    <label><input type="radio" name="diff" value="hard"> Hard</label>
                    <label><input type="radio" name="diff" value="chaos"> Chaos</label>
                </div>
            </div>

            <button id="action-randomize-btn" class="btn btn-primary btn-block">Execute Randomization Routine</button>
        </div>

        <div class="history-sidebar-card">
            <h3>Recent Matrix Runs</h3>
            <ul class="history-list">
                ${history.map(poke => `<li><span class="pokeball-bullet"></span> ${poke}</li>`).join('')}
            </ul>
        </div>
    `;

    return section;
}

export async function ExecuteRandomizeAction() {
    const payload = {
        generation: document.getElementById('rand-gen-select').value,
        game: document.getElementById('rand-game-select').value,
        dlc: document.getElementById('rand-dlc-select').value,
        difficulty: document.querySelector('input[name="diff"]:checked').value,
        options: Array.from(document.querySelectorAll('.options-checkbox-matrix input:checked')).map(cb => cb.value)
    };

    try {
        const response = await fetch('/api/generate-randomizer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        alert(`Randomizer Process Initialized successfully!\nSeed Vector Instance: ${data.seed}\nStarters: ${data.generated_starters.join(', ')}`);
    } catch (err) {
        console.error("Network configuration pipeline parsing error:", err);
    }
}
