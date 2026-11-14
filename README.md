# Rock Paper Scissors vs AI

Play rock paper scissors against the computer using your webcam. Show your hand, the AI figures out if it's rock, paper or scissors, and the computer picks randomly. First to 3 wins.

**Play it here:** https://faran-saharan.github.io/rock-paper-scissors/

![Playing a round against the computer](images/gameplay.png)
![End of a game with the rematch option](images/gameover.png)

## How it works

I trained an image model with Google's Teachable Machine using 4 classes: rock, paper, scissors and nothing. The "nothing" class is so it doesn't guess a hand when there isn't one.

The game runs the model on every webcam frame. It only counts a guess if the model is more than 60% sure. When you hit "Play round" there's a 3-2-1 countdown, and whatever it sees at "Shoot!" is your move.

## Built with

- HTML, CSS, JavaScript
- Teachable Machine + TensorFlow.js

## Problems I ran into

- The model kept showing NaN for its predictions. It turned out the newest versions of the libraries didn't work with my exported model, so I had to use older versions.
- At first the model only ever guessed "rock". Retraining with more photos at different angles and distances fixed it.
- The page needs to run on a local server (I used Live Server in VS Code). Opening the HTML file directly doesn't allow camera access.

## Run it yourself

1. Download or clone this repo
2. Open the folder in VS Code
3. Right-click `index.html` and choose "Open with Live Server"
4. Click "Start camera" and allow camera access