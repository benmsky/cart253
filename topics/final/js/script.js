"use strict";

// Game states
let intro = true;
let currentGame = null;

// Creates three bugs for the Bug Race.
let bug1, bug2, bug3;

// Rocks for obstacles
let rocks = [];

// Static grass patches for background detail
let grassPatches = [];

// Sets up the canvas.
function setup() {
    createCanvas(1200, 400); // Increased track length
    bug1 = createBug(0, 100, color(255, 0, 0));
    bug2 = createBug(0, 200, color(0, 0, 255));
    bug3 = createBug(0, 300, color(0, 255, 0));

    // Generate random rocks
    for (let i = 0; i < 10; i++) {
        rocks.push({
            x: random(200, width - 200),
            y: random(50, height - 50),
            size: random(20, 40)
        });
    }

    // Generate static grass patches
    for (let i = 0; i < 50; i++) {
        grassPatches.push({
            x: random(width),
            y: random(height),
            width: random(10, 30),
            height: random(5, 15),
            angle: random(TWO_PI)
        });
    }
}

// Creates a bug object with a given position and color.
function createBug(x, y, col) {
    return {
        x: x,
        y: y,
        speed: random(0.5, 1.0), // Increased speed
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
    drawRocks();
    drawBug(bug1);
    drawBug(bug2);
    drawBug(bug3);

    // Draw the Cheshire Cat at the top
    drawCat();

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
    background(50, 205, 50); // Grass color

    // Static grass patches (does not move)
    noStroke();
    for (let patch of grassPatches) {
        push();
        translate(patch.x, patch.y);
        rotate(patch.angle);
        fill(34, 139, 34); // Grass color
        rect(0, 0, patch.width, patch.height);
        pop();
    }

    // Finish line
    fill(0);
    rectMode(CORNER);
    rect(width - 10, 0, 10, height); // Finish line
}

// Draws the rocks on the track.
function drawRocks() {
    fill(100);
    noStroke();
    for (let rock of rocks) {
        ellipse(rock.x, rock.y, rock.size);
    }
}

// Draws a bug based on its current state.
function drawBug(bug) {
    if (!bug.isSquished) {
        stroke(0);

        // Detect and avoid rocks
        for (let rock of rocks) {
            let distance = dist(bug.x, bug.y, rock.x, rock.y);
            if (distance < rock.size / 2 + 10) {
                bug.y += (bug.y > rock.y ? 1 : -1) * 0.5; // Slight avoidance
            }
        }

        // Move bug
        bug.x += bug.speed;

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

// Draws the Cheshire Cat at the top of the screen.
let catLookingLeft = true;  // Flag for the cat's head direction

function drawCat() {
    // Cat's head position and size
    let headX = width / 2;
    let headY = 50;
    let headSize = 50;

    // Draw the cat's head
    fill(150, 150, 255); // Light purple for the cat
    ellipse(headX, headY, headSize, headSize);

    // Draw the eyes
    drawCatEyes(headX, headY, headSize);

    // Draw the cat's whiskers
    drawCatWhiskers(headX, headY, headSize);

    // Switch direction for looking left or right
    if (frameCount % 60 === 0) {
        catLookingLeft = !catLookingLeft;  // Toggle direction every second
    }
}

// Draws the cat's eyes.
function drawCatEyes(x, y, size) {
    let eyeSize = size / 8;

    // Left and right eye positions
    let leftEyeX = x - size / 6;
    let rightEyeX = x + size / 6;
    let eyeY = y - size / 8;

    // Eye color
    fill(0);

    // Draw left eye (looking left or right)
    ellipse(leftEyeX, eyeY, eyeSize, eyeSize);
    fill(255);
    ellipse(leftEyeX, eyeY, eyeSize / 2, eyeSize / 2);  // Pupil

    // Draw right eye (looking left or right)
    fill(0);
    ellipse(rightEyeX, eyeY, eyeSize, eyeSize);
    fill(255);
    ellipse(rightEyeX, eyeY, eyeSize / 2, eyeSize / 2);  // Pupil
}

// Draws the cat's whiskers.
function drawCatWhiskers(x, y, size) {
    let whiskerLength = size / 2;
    let whiskerAngle = PI / 6;

    // Left side whiskers
    line(x - size / 3, y, x - whiskerLength, y + whiskerAngle);
    line(x - size / 3, y, x - whiskerLength, y - whiskerAngle);

    // Right side whiskers
    line(x + size / 3, y, x + whiskerLength, y + whiskerAngle);
    line(x + size / 3, y, x + whiskerLength, y - whiskerAngle);
}
