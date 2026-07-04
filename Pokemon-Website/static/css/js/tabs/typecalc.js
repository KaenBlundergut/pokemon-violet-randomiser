export function RenderTypeCalcView() {
    const container = document.createElement('div');
    container.className = 'type-calc-container';
    
    const types = ["Normal", "Fire", "Water", "Grass", "Electric", "Ice", "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy"];
    
    container.innerHTML = `
        <div class="control-panel-card">
            <h2>Type Efficiency Calculator</h2>
            <div class="form-group">
                <label>Select Attacking Type</label>
                <select id="attack-type-select" class="form-control">
                    ${types.map(t => `<option value="${t}">${t}</option>`).join('')}
                </select>
            </div>
            <button id="calculate-matchups-btn" class="btn btn-primary">Process Interactions</button>
        </div>
        
        <div class="control-panel-card results-card" style="margin-top:20px;">
            <h3>Calculated Structural Modifiers</h3>
            <div id="type-results-output">Select a type and hit calculate to map elemental damage scaling.</div>
        </div>
    `;
    
    return container;
}

export async function ProcessTypeCalculation() {
    const selectedType = document.getElementById('attack-type-select').value;
    const outputDiv = document.getElementById('type-results-output');
    
    try {
        const response = await fetch('/api/type-calculator', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ attacking: selectedType })
        });
        const data = await response.json();
        
        outputDiv.innerHTML = `
            <p><strong>Super Effective (2x):</strong> ${data["2x"].join(', ') || 'None'}</p>
            <p><strong>Not Very Effective (½x):</strong> ${data["0.5x"].join(', ') || 'None'}</p>
            <p><strong>No Effect (0x):</strong> ${data["0x"].join(', ') || 'None'}</p>
        `;
    } catch (err) {
        outputDiv.textContent = "Error parsing calculation framework matrix.";
    }
}
