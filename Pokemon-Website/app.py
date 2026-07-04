from flask import Flask, render_template, jsonify, request
import random

app = Flask(__name__)

# Complete Generation / Game Matrix
GAME_CATALOGUE = {
    "Gen 1": {"games": ["Red", "Blue", "Yellow"], "dlc": []},
    "Gen 2": {"games": ["Gold", "Silver", "Crystal"], "dlc": []},
    "Gen 3": {"games": ["Ruby", "Sapphire", "Emerald", "FireRed", "LeafGreen"], "dlc": []},
    "Gen 4": {"games": ["Diamond", "Pearl", "Platinum", "HeartGold", "SoulSilver"], "dlc": []},
    "Gen 5": {"games": ["Black", "White", "Black 2", "White 2"], "dlc": []},
    "Gen 6": {"games": ["X", "Y", "Omega Ruby", "Alpha Sapphire"], "dlc": []},
    "Gen 7": {"games": ["Sun", "Moon", "Ultra Sun", "Ultra Moon", "Let's Go Pikachu", "Let's Go Eevee"], "dlc": []},
    "Gen 8": {"games": ["Sword", "Shield", "Brilliant Diamond", "Shining Pearl", "Legends Arceus"], "dlc": ["Isle of Armor", "Crown Tundra"]},
    "Gen 9": {"games": ["Scarlet", "Violet"], "dlc": ["The Teal Mask", "The Indigo Disk"]}
}

@app.route('/')
def serve_spa():
    return render_template('index.html')

@app.route('/api/games-data', methods=['GET'])
def get_games_matrix():
    return jsonify(GAME_CATALOGUE)

@app.route('/api/generate-randomizer', methods=['POST'])
def process_randomizer_logic():
    client_config = request.json
    
    # Process configuration modifiers
    difficulty = client_config.get("difficulty", "normal")
    modifiers = client_config.get("options", [])
    
    # Base simulation of a seed generator matrix return object
    simulated_seed_result = {
        "seed": random.randint(10000000, 99999999),
        "status": "Success",
        "generated_starters": ["Treecko", "Cyndaquil", "Piplup"] if "starters" in modifiers else ["Bulbasaur", "Charmander", "Squirtle"],
        "difficulty_multiplier": 1.5 if difficulty == "chaos" else 1.0
    }
    return jsonify(simulated_seed_result)

if __name__ == '__main__':
    app.run(debug=True, port=5000)

# Complete Type Effectiveness Matrix 
# Format: TYPE: { WEAK_AGAINST_ATTACK: 2.0, RESISTANT_TO_ATTACK: 0.5, IMMUNE_TO_ATTACK: 0.0 }
TYPE_MATRIX = {
    "Normal":   {"Rock": 0.5, "Ghost": 0.0, "Steel": 0.5},
    "Fire":     {"Fire": 0.5, "Water": 0.5, "Grass": 2.0, "Ice": 2.0, "Bug": 2.0, "Rock": 0.5, "Dragon": 0.5, "Steel": 2.0},
    "Water":    {"Fire": 2.0, "Water": 0.5, "Grass": 0.5, "Ground": 2.0, "Rock": 2.0, "Dragon": 0.5},
    "Grass":    {"Fire": 0.5, "Water": 2.0, "Grass": 0.5, "Poison": 0.5, "Ground": 2.0, "Flying": 0.5, "Bug": 0.5, "Rock": 2.0, "Dragon": 0.5, "Steel": 0.5},
    "Electric": {"Water": 2.0, "Electric": 0.5, "Grass": 0.5, "Ground": 0.0, "Flying": 2.0, "Dragon": 0.5},
    "Ice":      {"Fire": 0.5, "Water": 0.5, "Grass": 2.0, "Ice": 0.5, "Ground": 2.0, "Flying": 2.0, "Dragon": 2.0, "Steel": 0.5},
    "Fighting": {"Normal": 2.0, "Ice": 2.0, "Poison": 0.5, "Flying": 0.5, "Psychic": 0.5, "Bug": 0.5, "Rock": 2.0, "Ghost": 0.0, "Dark": 2.0, "Steel": 2.0, "Fairy": 0.5},
    "Poison":   {"Grass": 2.0, "Poison": 0.5, "Ground": 0.5, "Rock": 0.5, "Ghost": 0.5, "Steel": 0.0, "Fairy": 2.0},
    "Ground":   {"Fire": 2.0, "Electric": 2.0, "Grass": 0.5, "Poison": 2.0, "Flying": 0.0, "Bug": 0.5, "Rock": 2.0, "Steel": 2.0},
    "Flying":   {"Electric": 0.5, "Grass": 2.0, "Fighting": 2.0, "Bug": 2.0, "Rock": 0.5, "Steel": 0.5},
    "Psychic":  {"Fighting": 2.0, "Poison": 2.0, "Psychic": 0.5, "Dark": 0.0, "Steel": 0.5},
    "Bug":      {"Fire": 0.5, "Grass": 2.0, "Fighting": 0.5, "Poison": 0.5, "Flying": 0.5, "Psychic": 2.0, "Ghost": 0.5, "Dark": 2.0, "Steel": 0.5, "Fairy": 0.5},
    "Rock":     {"Fire": 2.0, "Ice": 2.0, "Fighting": 0.5, "Ground": 0.5, "Flying": 2.0, "Bug": 2.0, "Steel": 0.5},
    "Ghost":    {"Normal": 0.0, "Psychic": 2.0, "Ghost": 2.0, "Dark": 0.5},
    "Dragon":   {"Dragon": 2.0, "Steel": 0.5, "Fairy": 0.0},
    "Dark":     {"Fighting": 0.5, "Psychic": 2.0, "Ghost": 2.0, "Dark": 0.5, "Fairy": 0.5},
    "Steel":    {"Water": 0.5, "Electric": 0.5, "Ice": 2.0, "Rock": 2.0, "Steel": 0.5, "Fairy": 2.0},
    "Fairy":    {"Fighting": 2.0, "Poison": 0.5, "Dragon": 2.0, "Dark": 2.0, "Steel": 0.5}
}

@app.route('/api/type-calculator', methods=['POST'])
def calculate_type_matchups():
    data = request.json
    attacking = data.get("attacking", "Normal")
    
    # Extract interactions across all target entities
    matchups = {"2x": [], "0.5x": [], "0x": []}
    for defending_type, interactions in TYPE_MATRIX.items():
        if attacking in interactions:
            multiplier = interactions[attacking]
            if multiplier == 2.0: matchups["2x"].append(defending_type)
            elif multiplier == 0.5: matchups["0.5x"].append(defending_type)
            elif multiplier == 0.0: matchups["0x"].append(defending_type)
            
    return jsonify(matchups)


# Simulated Database Cache Array for Frontend Team Filtering Matrix
POKEMON_DATABASE_MOCK = [
    {"id": 3, "name": "Venusaur", "type": "Grass", "gen": 1, "class": "Standard", "gmax": True},
    {"id": 6, "name": "Charizard", "type": "Fire", "gen": 1, "class": "Standard", "gmax": True},
    {"id": 150, "name": "Mewtwo", "type": "Psychic", "gen": 1, "class": "Legendary", "gmax": False},
    {"id": 792, "name": "Lunala", "type": "Psychic", "gen": 7, "class": "Legendary", "gmax": False},
    {"id": 795, "name": "Pheromosa", "type": "Bug", "gen": 7, "class": "Ultra Beast", "gmax": False},
    {"id": 984, "name": "Great Tusk", "type": "Ground", "gen": 9, "class": "Paradox", "gmax": False},
    {"id": 1007, "name": "Koraidon", "type": "Fighting", "gen": 9, "class": "Legendary", "gmax": False}
]

@app.route('/api/pokemon-pool', methods=['GET'])
def get_pokemon_pool():
    return jsonify(POKEMON_DATABASE_MOCK)
