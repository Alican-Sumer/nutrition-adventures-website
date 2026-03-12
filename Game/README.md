# Nutrition Adventures

Phaser-based 2D game prototype with:
- custom campus map background (`demoMap_V3_3_08_26_json.json`)
- WASD player movement
- collision zones + trigger zones from Tiled object layers
- Twine scenario integration - scenarios will launch based on trigger object layer in tile (place_name)_door_trigger...

## Prerequisites
- Python 3.x (recommended run method)
- Node.js 18+ (optional run method)
- VS Code or terminal access

## Project Folder
```powershell
cd "c:\Users\Junia\OneDrive\Desktop\SeniorDesignProject\SeniorDesignExp_V1\Game"
```

## Run The Game (Recommended)
Use Python server (most reliable in this setup):

```powershell
python -m http.server 8090
```

Then open:
- `http://localhost:8090`

## Run The Game (Node Alternative)
```powershell
npm start
```
Then open:
- `http://localhost:8080`

If your PowerShell blocks npm scripts, use:
```powershell
npm.cmd start
```

## Controls
- `W` `A` `S` `D`: move player
  - `W` = up sprite
  - `S` = down sprite
  - `A` = left sprite
  - `D` = right sprite
- `1` = open Twine Scenario 1
- `2` = open Twine Scenario 2
- `3` = open Twine Scenario 3
- `4` = open Twine Scenario 4
- `Esc` = close scenario overlay
- `Complete Scenario` button = mark scenario complete (increments progress internally)

## Current Map Assets
- Map JSON: `assets/maps/demoMap_V3_3_08_26_json.json`
- Background image: `assets/maps/NCSU_map_forDEMO_V2.png`
- Player sprite sheets:
  - `assets/sprite/idle_up.png`
  - `assets/sprite/idle_down.png`
  - `assets/sprite/idle_left.png`
  - `assets/sprite/idle_right.png`

## Main Source Files
- `index.html`
- `src/main.js`
- `src/scenes/Start.js`
- `src/entities/StudentPlayer.js`
- `src/systems/TwineOverlay.js`
- `scripts/dev-server.mjs`

