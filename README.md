# SimTankECS

## This is a second version of the SimTank, this time I tried using ECS-pattern. The game is not finished at the momement, due to the limits of extending the game using the current file structure. 
I am in the progress of generating a new version of the similar thing, which have taken into account the limitations of this project.
The first version was just a single html file with a flying plane and even homing missiles, radars etc (even an ESP32 controlled joystick for flight and physical buttons for weapons), but obviously that was not scalable in any way.
So this iteration is obviously more improved, but still, as I keep understanding more and more about the possibilites of using AI-tools and also the limitations of it, and the issues with game logic system, I am in progress of creating a more improved version at the moment.

## Run
```bash
npm install
npx vite --open
```

## Test
```bash
npm test
npm run coverage
```
