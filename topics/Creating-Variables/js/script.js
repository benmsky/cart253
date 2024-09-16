/**
 * Creating Variables
 * Benjamin Macknofsky
 * 
 * Experimenting with creating variables
 */

"use strict";

/**
 * Creates the canvas
*/
function setup() {
    createCanvas(480, 480);
}

/**
 * draws a hole in a piece of cheese
*/
function draw() {
    // The cheese
    background(255, 255, 0);

    // the hole
    push();
    noStroke();
    fill(0);
    ellipse(140, 175, 180);
    pop();
}