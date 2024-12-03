/**
 * Bug Race
 * Benjamin Macknofsky
 *
 * In this bug race of chance, three colorful bugs race across a grassy field,
 * each moving at random speeds like a roll of the dice. You can sabotage their
 * progress by clicking to squish one—or all—of the bugs, leaving splats behind.
 * Once a bug is squished, the remaining ones stop shaking, adding tension.
 * The race ends when a bug reaches the finish line.
 */

"use strict";

// Game states
let intro = true;
let currentGame = null;

// Creates three bugs for the Bug Race.
let bug1, bug2, bug3;

// Sets up the canvas.
function setup() {
    createCanvas(800, 400);
    bug1 = createBug(0, 100, color(255, 0, 0));
    bug2 = createBug(0, 200, color(0, 0, 255));
    bug3 = createBug(0, 300, color(0, 255, 0));
}

// Creates a bug object with a given position and color.
function createBug(x, y, col) {
    return {
        x: x,
        y: y,
        speed: random(0.5, 1.5),
        color: col,
        isSquished: false,
        splatSeed: random(0, 100)
    };
}

// Draws the screen based on the current game state.
function draw() {
    if (intro) {
        drawIntro();
    } else if (currentGame === "Bug Race") {
        drawBugRace();
    } else {
        drawPlaceholder();
    }
}

// Draws the intro screen with three slots.
function drawIntro() {
    background(0);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(24);
    text("Welcome! Select a game to play:", width / 2, height / 5);

    // Draw three slots for game selection.
    textSize(18);
    drawSlot("Bug Race", width / 2, height / 3, color(255, 100, 100));
    drawSlot("Game 2 (Coming Soon)", width / 2, height / 2, color(100, 255, 100));
    drawSlot("Game 3 (Coming Soon)", width / 2, (2 * height) / 3, color(100, 100, 255));
}

// Draws a clickable slot for game selection.
function drawSlot(label, x, y, bgColor) {
    fill(bgColor);
    rectMode(CENTER);
    rect(x, y, 300, 50, 10);
    fill(0);
    text(label, x, y);
}

// Draws the Bug Race game.
function drawBugRace() {
    drawGrass();
    drawBug(bug1);
    drawBug(bug2);
    drawBug(bug3);

    // Ends the program once a bug crosses the finish line.
    if (bug1.x >= width || bug2.x >= width || bug3.x >= width) {
        noLoop();
    }
}

// Draws a placeholder screen for other games.
function drawPlaceholder() {
    background(50);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(24);
    text("This game is coming soon!", width / 2, height / 2);
}

// Draws the grass background for the Bug Race.
function drawGrass() {
    background(50, 205, 50);
    fill(0);
    rectMode(CORNER); // Ensure the finish line is drawn correctly
    rect(width - 10, 0, 10, height); // Finish line
}

// Draws a bug based on its current state.
function drawBug(bug) {
    if (!bug.isSquished) {
        stroke(0);
        let speedBoost = map(bug.x, 0, width, 0, 4);
        bug.x += bug.speed + speedBoost;

        let verticalShake = random(-1, 1);
        fill(bug.color);

        ellipse(bug.x, bug.y + verticalShake, 10, 10);
        ellipse(bug.x - 8, bug.y + verticalShake, 8, 8);
        ellipse(bug.x - 14, bug.y + verticalShake, 6, 6);
    } else {
        noStroke();
        randomSeed(bug.splatSeed);
        fill(150, 50, 50);
        for (let i = 0; i < 5; i++) {
            ellipse(bug.x + random(-10, 10), bug.y + random(-10, 10), random(10, 30));
        }
    }
}

// Handles mouse clicks for selecting a game or squishing bugs.
function mousePressed() {
    if (intro) {
        if (isMouseOverSlot(width / 2, height / 3, 300, 50)) {
            currentGame = "Bug Race";
            intro = false;
        } else if (isMouseOverSlot(width / 2, height / 2, 300, 50)) {
            currentGame = "Game 2";
            intro = false;
        } else if (isMouseOverSlot(width / 2, (2 * height) / 3, 300, 50)) {
            currentGame = "Game 3";
            intro = false;
        }
    } else if (currentGame === "Bug Race") {
        squishBug(bug1);
        squishBug(bug2);
        squishBug(bug3);
    }
}

// Checks if the mouse is over a slot.
function isMouseOverSlot(x, y, w, h) {
    return mouseX > x - w / 2 && mouseX < x + w / 2 && mouseY > y - h / 2 && mouseY < y + h / 2;
}

// Checks and squishes a bug based on mouse position.
function squishBug(bug) {
    if (dist(mouseX, mouseY, bug.x, bug.y) < 10 && !bug.isSquished) {
        bug.isSquished = true;
    }
}
