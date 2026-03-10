# Nutrition Adventures Workspace



## Current Status
- Phaser project boots from `index.html` and `src/main.js`.
- Tilemap pipeline is wired:
  - Map key: `campus-map`
  - Tiles key: `tiles`
  - Tileset name in Tiled: `tile-set`
  - Layer name in Tiled: `Tile Layer 1`

## Workspace Structure
- `src/scenes`: scene flow (`Boot`, `Start`, `Game`)
- `src/entities`: player/NPC classes
- `src/systems`: collision, dialogue, quest, inventory systems
- `src/ui`: HUD and menus
- `src/data`: JSON or JS game data (items, quests, nutrition facts)
- `src/config`: shared constants and tuning values
- `assets/maps`: Tiled maps
- `assets/tiles`: tilesets
- `assets/audio`: music and SFX
- `assets/ui`: icons and UI art
- `docs`: planning docs and design notes

## What I Need From You Next
1. Player sprite sheet path, frame size, and animation names.
2. Collision layer name in your Tiled map (or confirmation to add one).
3. Interaction/object layer names for NPCs, items, and doors.
4. First gameplay loop to implement (example: collect healthy foods and avoid junk food).
5. Win/lose condition for milestone 1.
6. Input target: keyboard only or keyboard + controller.
7. Preferred resolution if not `1280x720`.

## Recommended Next Build Order
1. Add controllable player + camera follow.
2. Add collision layer + blocked movement.
3. Add one interaction system (pickup or dialogue).
4. Add HUD (score, health/energy, objective text).
5. Add one complete level objective and restart flow.
