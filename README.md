# Adventure Idle - Modular Game Architecture

A modular idle RPG game built with vanilla JavaScript using ES6 modules.

## 📁 Project Structure

```
Idle-Game/
├── index.html                 # Main HTML file
├── src/
│   ├── js/
│   │   ├── main.js           # Entry point - initializes the game
│   │   ├── core/             # Core game systems
│   │   │   └── GameState.js  # Manages player state and data
│   │   ├── data/             # Game data and constants
│   │   │   └── GameData.js   # All game constants, templates, actions
│   │   ├── systems/          # Game logic systems
│   │   │   ├── ActivitySystem.js   # Handles activities (gathering, production, combat)
│   │   │   ├── CombatSystem.js     # Combat mechanics and damage calculation
│   │   │   ├── EquipmentSystem.js  # Equipment management
│   │   │   ├── InventorySystem.js  # Inventory operations
│   │   │   └── SkillSystem.js      # XP and leveling mechanics
│   │   └── ui/               # User interface components
│   │       ├── UIManager.js        # Coordinates all UI components
│   │       ├── ActionsUI.js        # Renders action buttons
│   │       ├── EquipmentUI.js      # Renders equipment panel
│   │       ├── InventoryUI.js      # Renders inventory panel
│   │       ├── LogUI.js            # Manages game log
│   │       └── SkillsUI.js         # Renders skills panel
│   └── styles/
│       └── main.css          # All game styles
└── README.md                 # This file
```

## 🎮 How It Works

### Architecture Overview

The game follows a **modular, event-driven architecture**:

1. **Core Layer** (`core/`): Manages the central game state
2. **Systems Layer** (`systems/`): Contains game logic separated by domain
3. **Data Layer** (`data/`): Stores constants, configurations, and templates
4. **UI Layer** (`ui/`): Handles rendering and user interaction

### Event System

The modules communicate through **custom DOM events**:

- Systems dispatch events when important actions occur
- UI components listen to these events and update accordingly
- This keeps modules decoupled and easy to modify

Example event flow:
```
Player clicks "Chop Wood"
  → ActivitySystem.startGathering()
  → Dispatches 'gatheringTick' event
  → LogUI listens and logs the message
  → InventoryUI listens and updates display
```

## 🚀 Getting Started

### Running the Game

Since this uses ES6 modules, you need to serve it via HTTP (not `file://`):

```bash
# Option 1: Python 3
python -m http.server 8000

# Option 2: Node.js (if you have http-server installed)
npx http-server

# Option 3: PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## 🛠️ Adding New Features

### Adding a New Skill

1. **Update GameData.js**: Add skill to `ALL_SKILLS` array
2. **Update GameState.js**: Add to `initializePlayer()` if needed
3. **Update GameData.js**: Add actions to `ACTIONS` object
4. **Update ActionsUI.js**: Add render method for new skill
5. **Update index.html**: Add new collapsible section

### Adding a New Enemy

1. **Update GameData.js**: Add to `ENEMY_TEMPLATES`
2. **Update CombatSystem.js**: Add loot logic in `rollLoot()`
3. **Update GameData.js**: Add to `ACTIONS.combat`

### Adding New Items

1. **Update GameState.js**: Add to `initializeInventory()`
2. **Update GameData.js**: Add emoji to `ITEM_EMOJIS` or handle in `getItemEmoji()`
3. **Update GameData.js**: If equipable, add to `EQUIPMENT_STATS`
4. **Update GameData.js**: Add to relevant action definitions

### Adding a New Activity Type

1. **Create method in ActivitySystem.js**: e.g., `startFishing()`
2. **Add event dispatchers**: For logging and UI updates
3. **Update UIManager.js**: Add event listeners for new activity
4. **Update ActionsUI.js**: Add render method for new actions

## 📦 Key Modules

### GameState (`core/GameState.js`)
- **Purpose**: Single source of truth for all player data
- **Exports**: `gameState` singleton
- **Key Methods**: `getLevel()`, `addXP()`, `addInventoryItem()`

### SkillSystem (`systems/SkillSystem.js`)
- **Purpose**: Handles XP calculations and level progression
- **Exports**: `skillSystem` singleton
- **Key Methods**: `gainXp()`, `getMaxHealth()`, `getEffectiveStat()`

### ActivitySystem (`systems/ActivitySystem.js`)
- **Purpose**: Manages all player activities (gathering, production, combat)
- **Exports**: `activitySystem` singleton
- **Key Methods**: `startGathering()`, `startProduction()`, `startCombat()`, `stopActivity()`

### UIManager (`ui/UIManager.js`)
- **Purpose**: Coordinates all UI components and listens to game events
- **Exports**: `uiManager` singleton
- **Key Methods**: `initialize()`, `renderAll()`

## 🎨 Styling

All styles are in `src/styles/main.css`. The game uses:
- **Tailwind CSS** (via CDN) for utility classes
- **Custom CSS** for game-specific styles and scrollbars

## 🔄 Game Loop

Activities run on `setInterval`:
- **Gathering**: 2 seconds per action
- **Production**: 3 seconds per action
- **Combat**: 1 second per turn

These are configurable in `GameData.js` → `GAME_CONFIG`.

## 🧪 Debugging

Open browser console to see:
- Initialization messages
- Any error logs
- You can access game state via: `window` (events) or import modules in console

## 📝 Code Style

- **ES6 Modules**: All files use `import`/`export`
- **Event-Driven**: Systems communicate via CustomEvents
- **Singleton Pattern**: Most systems export a single instance
- **Pure Functions**: Where possible, functions don't mutate external state
- **JSDoc Comments**: Functions are documented with purpose and parameters

## 🎯 Benefits of This Architecture

1. **Modularity**: Each system is in its own file
2. **Separation of Concerns**: Logic, data, and UI are separated
3. **Scalability**: Easy to add new features without breaking existing code
4. **Maintainability**: Clear structure makes finding and fixing bugs easier
5. **Testability**: Individual modules can be tested in isolation
6. **Reusability**: Systems can be reused or extended

## 🚧 Future Improvements

- Add save/load system (localStorage)
- Add more enemies and combat mechanics
- Implement skill mastery bonuses
- Add quests system
- Implement achievements
- Add sound effects and music
- Create automated tests

## 📄 License

This is a personal project - feel free to learn from it and modify as you wish!
