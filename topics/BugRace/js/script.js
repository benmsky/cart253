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

// Creates three bugs.
let bug1, bug2, bug3;

// Sets up the canvas and initializes bugs with random speeds.
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

// Draws the grass background and bugs.
function draw() {
    drawGrass();
    drawBug(bug1);
    drawBug(bug2);
    drawBug(bug3);

    // Ends the program once a bug crosses the finish line.
    if (bug1.x >= width || bug2.x >= width || bug3.x >= width) {
        noLoop();
    }
}

// Draws the grass background.
function drawGrass() {
    background(50, 205, 50);
    fill(0);
    rect(width - 10, 0, 10, height);
}

// Draws a bug based on its current state.
function drawBug(bug) {
    if (!bug.isSquished) {
        // Applies a black stroke to the bug.
        stroke(0);
        // Speed boost based on position.
        let speedBoost = map(bug.x, 0, width, 0, 4);
        // Move the bug.
        bug.x += bug.speed + speedBoost;

        // Add slight vertical shake.
        let verticalShake = random(-1, 1);
        fill(bug.color);

        // Draw the bug's head, body, and tail.
        // Head
        ellipse(bug.x, bug.y + verticalShake, 10, 10);
        // Body
        ellipse(bug.x - 8, bug.y + verticalShake, 8, 8);
        // Tail
        ellipse(bug.x - 14, bug.y + verticalShake, 6, 6);

    } else {
        // Remove the stroke for the splat.
        noStroke();

        // Set seed for consistent splat shapes.
        randomSeed(bug.splatSeed);

        // Darker color for squished bug.
        fill(150, 50, 50);

        // Draw splat shapes.
        for (let i = 0; i < 5; i++) {
            ellipse(bug.x + random(-10, 10), bug.y + random(-10, 10), random(10, 30));
        }
    }
}

// Squishes a bug when clicked.
function mousePressed() {
    squishBug(bug1);
    squishBug(bug2);
    squishBug(bug3);
}

// Checks and squishes a bug based on mouse position.
function squishBug(bug) {
    if (dist(mouseX, mouseY, bug.x, bug.y) < 10 && !bug.isSquished) {
        bug.isSquished = true;
    }
}
