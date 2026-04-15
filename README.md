![logo_ironhack_blue 7](https://user-images.githubusercontent.com/23629340/40541063-a07a0a8a-601a-11e8-91b5-2f13e4e6b441.png)

# Project 1 | Shibuya incident

![BEHIND THE CODE](https://cdn-images.welcometothejungle.com/vyBWq6qP0gz3z9ctHYGMcMYE5jgPf3qJRsA37wkwhOk/rs:auto:1500::/q:85/czM6Ly93dHRqLXByb2R1Y3Rpb24vdXBsb2Fkcy9jYXRlZ29yeS9jb3Zlci8yNjYwLzE1NDg4My9jb2xsZWN0aW9uX2NhdGVnb3J5X2JlaGluZF90aGVfY29kZS5qcGc)

## Introduction

For this project, despite being able to use libraries, we used Canvas, in order to have a better application of the learned code, and also to improve it. To do this, we created [This game](https://4epic.github.io/Project-1-Shibuya-incident/), in order to visually see what the Canvas format is capable of.

On this occasion, we thought about implementing a simple game with different logics that was updated following the player's value with the collision value. Finally, this idea was discarded, due to its apparent simplicity - Considering what we have seen, it was not going to be very simple either -, and a new "shoot'em up 2D" format was considered.

This game is thought to have the **next caracteristics**.

## Player

- 2D diagonal and vertical movement.
- Shoot energy.
- Power up.

## Enemies

- three versions:

```bash
$ Roboto
- More resistance.
- Power up Inmunity 5s.
$ Slime
- Follows player.
- Power up Random.
$ Alien
- Can shoot.
- Power up de weapon.
```
- Appear from any wall of the Canvas.

## Game

- Time Max. 60'.
- Ground space.
- Music & sounds.
- Score.

## Instructions

```bash
$ Move
- Should not go off the edge.
- Control with AWSD or ARROWS.
$ Shoot
- Hard to control.
- More fast or more slow.
- Control with Mouse & click.
```

# Shoot Energy Game 
Shoot energy in this game it's not easy! You need to use shooting to survive in this game. When you click near the Player, the shoots gonna be more slow, and when you click so far the player, the shoots gonna be more fast. Practice!

## How does it work?
The game screen contains a Canvas where a Player dotch and shoot enemies to win score and survive 60s. Last, the player can see "Game Over" when die or "You Win" and his Score when survive.

All enemies appear randomly in canvas with diferent velocity.

* * *
## MVP
### Technique
HTML5, DOM, **Canvas** and Vanilla **Javascript**

### Game states
* __Start Screen__
  * Title
  * Start Game button
  * Player's name input field
* __Game Screen__
  * Time
  * Score
  * Canvas
  * Music
* __Game Over Screen__
  * Sound Lost
  * Play again button
  * Go to start screen button
* __Win Game Screen__
  * Sound Win
  * Score
  * Play again button
  * Go to start screen button

### Game
* Create interface
* Create player
* Create enemies
* Move player
  * Press arrow keys to move the player around the Canvas.
* Create enemies
  * Each enemy with diferent caracteristics
* Create shoots
  * Define a diferent shoot mode
* Check collision
  * If enemy is a collision with a shoot => +Score 
  * If plsyer is a collision with an enemy => player die => Show Game Over Screen
* * *

### User stories
- User can see the Start Screen
- User can see the logo
- User can see a Start Game button
- User can click on the "Start Game" button
- User can see a readme file with all the game instructions
- User can see the Game Screen
- User can see the Canvas
- User can hear the music
- User can see the Player
- User can see a Canvas background image
- User can see an enemies in the canvas
- User can move the Player left and right
- User can move the Player up and down
- User can click to Shoot
- User can hear sound shoot
- User can kill enemies with shoot
- User can hear sound for kill
- User can see its points/score increasing
- User can die with colision enemies
- User can see the Game Over Screen
- User can see the Win Game Screen
- User can see its total score
- User can see a Play again button
- User can click on Play again button

## BACK LOG
### Music
* Add music on/off button to setup
* Add sound effects to diferents situations
### Power Up
* Add diferent Power Up
  * Inmunity for 5 sec
  * Normal Shoot
  * Atomic Bomb
### Enemies
* Implement diferent types
  * Robot more resistance
  * Alien can shoot
  * Slime follows the Player

## Data structure
__index.js__
````
buildSplashScreen(buildDom);
buildGameScreen(buildDom);
buildGameOver(buildDom);
buildYouWin(buildDom);
addEventListener();
````
__game.js__
````
Class Game (constructor){};
start();
printTime();
startLoop();
CheckCollisions();
````
__player.js__
````
Class Player (constructor){};
update();
setDirection();
checkScreen();
draw();
didCollide(obstacle);
````
__obstacles.js__
````
Class Obstacle (constructor){};
kill();
calculateInits();
draw();
move();
````  