# Project 1 | Shibuya Incident

## Introduction
Shibuya Incident is a fast-paced 2D shoot’em up built entirely with HTML, Canvas, and Vanilla JavaScript. This repository represents an improved and expanded version of my first browser game project, focusing on strong gameplay mechanics, robust architecture, and cross-platform mobile compatibility.

## Game Concept
The goal is simple: survive an endless wave of incoming enemies by dodging and shooting until the timer runs out. Collect power-ups, manage the screen space, and avoid being overwhelmed as the difficulty and spawn rates continuously escalate.

## Features
- Player movement
- Shooting
- Enemy types
- Score system
- Timer
- Music and sound effects
- Win and lose states
- Start screen
- Restart flow
- Easy mode and normal mode

## Controls
- **Keyboard & Mouse (Desktop):** Use `W, A, S, D` or `Arrow Keys` to move. `Mouse Click` anywhere on the game area to shoot in that direction.
- **Touch (Mobile):** Use the on-screen virtual D-Pad to move. Tap anywhere on the game area to shoot.

## Game Modes
- **Easy Mode:** Perfect for learning movement and shooting mechanics. Features a slower pace, basic enemies, and a safer environment.
- **Normal Mode:** The full game experience featuring all power-ups, all enemy variants, and a much stronger escalation of pressure over time.

## Backlog / Optional Systems

### Power-ups
- **Immunity:** Invulnerability to all damage for 5 seconds.
- **Normal shot:** Upgrades the weapon to a rapid spread-fire shot.
- **Atomic bomb:** Wipes all current enemies and projectiles from the screen.

### Enemy Types
- **Robot:** Slower, but has much more resistance.
- **Alien:** Capable of shooting projectiles back at the player.
- **Slime:** Actively follows the player's position.

### Audio Options
- Music on/off
- SFX on/off
- Music volume control

## Technical Stack
- HTML5
- Canvas
- Vanilla JavaScript
- CSS

## Game Flow
1. Start screen
2. Choose game mode
3. Play the match
4. Win or lose
5. Restart or return to start

## Improvements Over the First Version
This release improves upon the original project with:
- Better gameplay balance (using frame-rate independent deltaTime calculations).
- Better structure and code maintainability.
- Mobile support with touch controls and responsive layouts.
- Audio controls separating Music and SFX.
- More polished UI and visual scaling.
- More complete game systems, finally adding all intended backlog features.

## Notes
This project keeps the original arcade spirit of the game while being much more complete, balanced, and polished.