numStrips = 5
numLedsPerStrip = 12
stripPins = [DigitalPin.P0,
    DigitalPin.P1,
    DigitalPin.P2,
    DigitalPin.P3,
    DigitalPin.P4]
np = []
for i in range(numStrips):
    np[i] = neopixel.create(stripPins[i], numLedsPerStrip, NeoPixelMode.RGB)
# Define the initial positions and velocities of the aliens and spaceship
alien_pos = [0, 11, 22, 33, 44]
alien_vel = [1, 1, 1, 1, 1]
spaceship_pos = 5
spaceship_vel = 0
# Define the colors of the aliens and spaceship
alien_color = neopixel.colors(NeoPixelColors.RED)
spaceship_color = neopixel.colors(NeoPixelColors.BLUE)
# Define the shooting variables
shoot_pos = -1
shoot_vel = -1
shoot_color = neopixel.colors(NeoPixelColors.WHITE)
# Define the game loop

def on_forever():
    global spaceship_pos, shoot_pos, shoot_vel, alien_pos, spaceship_vel
    # Clear the neopixels
    for j in range(numStrips):
        np[j].clear()
    # Move the aliens
    for k in range(len(alien_pos)):
        alien_pos[k] += alien_vel[k]
        if alien_pos[k] < 0 or alien_pos[k] >= numStrips * numLedsPerStrip:
            alien_vel[k] = -alien_vel[k]
        # Draw the alien
        stripIndex = Math.floor(alien_pos[k] / numLedsPerStrip)
        ledIndex = alien_pos[k] % numLedsPerStrip
        np[stripIndex].setPixelColor(ledIndex, alien_color)
    # Move the spaceship
    spaceship_pos += spaceship_vel
    if spaceship_pos < 0:
        spaceship_pos = 0
    elif spaceship_pos >= numStrips * numLedsPerStrip:
        spaceship_pos = numStrips * numLedsPerStrip - 1
    # Draw the spaceship
    stripIndex2 = Math.floor(spaceship_pos / numLedsPerStrip)
    ledIndex2 = spaceship_pos % numLedsPerStrip
    np[stripIndex2].setPixelColor(ledIndex2, spaceship_color)
    # Handle shooting
    if shoot_pos == -1 and input.buttonA.isPressed():
        # Start shooting from spaceship
        shoot_pos = spaceship_pos - 1
        shoot_vel = -1
    elif shoot_pos != -1:
        # Move the shoot
        shoot_pos += shoot_vel
        if shoot_pos < 0 or np[Math.floor(shoot_pos / numLedsPerStrip)].getPixelColor(shoot_pos % numLedsPerStrip) != neopixel.colors(NeoPixelColors.BLACK):
            # Stop shooting when hit the edge or an alien
            shoot_pos = -1
        else:
            # Draw the shoot
            stripIndex3 = Math.floor(shoot_pos / numLedsPerStrip)
            ledIndex3 = shoot_pos % numLedsPerStrip
            np[stripIndex3].setPixelColor(ledIndex3, shoot_color)
    # Handle alien hit by shoot
    if shoot_pos != -1:
        for l in range(len(alien_pos)):
            if alien_pos[l] == shoot_pos:
                alien_pos[l] = -1
                shoot_pos = -1
                stripIndex4 = Math.floor(alien_pos[l] / numLedsPerStrip)
                ledIndex4 = alien_pos[l] % numLedsPerStrip
                np[stripIndex4].setPixelColor(ledIndex4, neopixel.colors(NeoPixelColors.BLACK))
    # Remove hit aliens
    
    def on_filter(x):
        pass
    alien_pos = alien_pos.filter(on_filter)
    
    # Check for game over
    if len(alien_pos) == 0:
        for m in range(3):
            # Flash the neopixels three times when win
            for n in range(numStrips):
                np[n].showColor(neopixel.colors(NeoPixelColors.WHITE))
            basic.pause(500)
            for o in range(numStrips):
                np[o].clear()
            basic.pause(500)
        break
    # Display the neopixels
    for p in range(numStrips):
        np[p].show()
    # Handle user input
    if input.buttonB.isPressed():
        spaceship_vel = 1
    else:
        spaceship_vel = 0
    # Pause to control the speed of the game
    basic.pause(100)
basic.forever(on_forever)
