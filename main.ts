let numStrips = 5;
let numLedsPerStrip = 12;
let stripPins = [DigitalPin.P0, DigitalPin.P1, DigitalPin.P2, DigitalPin.P3, DigitalPin.P4];
let np: number[] = [];

for (let i = 0; i < numStrips; i++) {
    np[i] = neopixel.create(stripPins[i], numLedsPerStrip, NeoPixelMode.RGB);
}

// Define the initial positions and velocities of the aliens and spaceship
let alien_pos = [0, 11, 22, 33, 44];
let alien_vel = [1, 1, 1, 1, 1];
let spaceship_pos = 5;
let spaceship_vel = 0;

// Define the colors of the aliens and spaceship
let alien_color = neopixel.colors(NeoPixelColors.Red);
let spaceship_color = neopixel.colors(NeoPixelColors.Blue);

// Define the shooting variables
let shoot_pos = -1;
let shoot_vel = -1;
let shoot_color = neopixel.colors(NeoPixelColors.White);

// Define the game loop
basic.forever(function () {
    // Clear the neopixels
    for (let i = 0; i < numStrips; i++) {
        np[i].clear();
    }

    // Move the aliens
    for (let i = 0; i < alien_pos.length; i++) {
        alien_pos[i] += alien_vel[i];
        if (alien_pos[i] < 0 || alien_pos[i] >= numStrips * numLedsPerStrip) {
            alien_vel[i] = -alien_vel[i];
        }
        // Draw the alien
        let stripIndex = Math.floor(alien_pos[i] / numLedsPerStrip);
        let ledIndex = alien_pos[i] % numLedsPerStrip;
        np[stripIndex].setPixelColor(ledIndex, alien_color);
    }

    // Move the spaceship
    spaceship_pos += spaceship_vel;
    if (spaceship_pos < 0) {
        spaceship_pos = 0;
    } else if (spaceship_pos >= numStrips * numLedsPerStrip) {
        spaceship_pos = numStrips * numLedsPerStrip - 1;
    }
    // Draw the spaceship
    let stripIndex = Math.floor(spaceship_pos / numLedsPerStrip);
    let ledIndex = spaceship_pos % numLedsPerStrip;
    np[stripIndex].setPixelColor(ledIndex, spaceship_color);

    // Handle shooting
    if (shoot_pos == -1 && input.buttonA.isPressed()) {
        // Start shooting from spaceship
        shoot_pos = spaceship_pos - 1;
        shoot_vel = -1;
    } else if (shoot_pos != -1) {
        // Move the shoot
        shoot_pos += shoot_vel;
        if (shoot_pos < 0 || np[Math.floor(shoot_pos / numLedsPerStrip)].getPixelColor(shoot_pos % numLedsPerStrip) != neopixel.colors(NeoPixelColors.Black)) {
            // Stop shooting when hit the edge or an alien
            shoot_pos = -1;
        } else {
            // Draw the shoot
            let stripIndex = Math.floor(shoot_pos / numLedsPerStrip);
            let ledIndex = shoot_pos % numLedsPerStrip;
            np[stripIndex].setPixelColor(ledIndex, shoot_color);
        }
    }

    // Handle alien hit by shoot
    if (shoot_pos != -1) {
        for (let i = 0; i < alien_pos.length; i++) {
            if (alien_pos[i] == shoot_pos) {
                alien_pos[i] = -1;
                shoot_pos = -1;
                let stripIndex = Math.floor(alien_pos[i] / numLedsPerStrip);
                let ledIndex = alien_pos[i] % numLedsPerStrip;
                np[stripIndex].setPixelColor(ledIndex, neopixel.colors(NeoPixelColors.Black));
            }
        }
    }

    // Remove hit aliens
    alien_pos = alien_pos.filter(x => x != -1);

    // Check for game over
    if (alien_pos.length == 0) {
        for (let i = 0; i < 3; i++) {
            // Flash the neopixels three times when win
            for (let j = 0; j < numStrips; j++) {
                np[j].showColor(neopixel.colors(NeoPixelColors.White));
            }
            basic.pause(500);
            for (let j = 0; j < numStrips; j++) {
                np[j].clear();
            }
            basic.pause(500);
        }
        break;
    }

    // Display the neopixels
    for (let i = 0; i < numStrips; i++) {
        np[i].show();
    }

    // Handle user input
    if (input.buttonB.isPressed()) {
        spaceship_vel = 1;
    } else {
        spaceship_vel = 0;
    }

    // Pause to control the speed of the game
    basic.pause(100);
});