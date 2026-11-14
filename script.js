const MODEL_URL = "model/";
const EMOJI = { rock: "✊", paper: "✋", scissors: "✌️" };

let model, webcam;
let current = "nothing"; 
let myScore = 0;
let compScore = 0;

async function start() {
  model = await tmImage.load(MODEL_URL + "model.json", MODEL_URL + "metadata.json");

  // camera sizing
  webcam = new tmImage.Webcam(240, 240, true); 
  // asks for camera permission
  await webcam.setup(); 
  await webcam.play();
  document.getElementById("webcam").appendChild(webcam.canvas);

  document.getElementById("start").disabled = true;
  document.getElementById("play").disabled = false;
  loop();
}

async function loop() {
  webcam.update();
  await predict();
  requestAnimationFrame(loop);
}

async function predict() {
  const results = await model.predict(webcam.canvas);

  // find the class with the highest probability
  let best = results[0];
  for (const r of results) {
    if (r.probability > best.probability) best = r;
  }

  current = best.probability > 0.6 ? best.className : "nothing";
  document.getElementById("guess").textContent = current;
}

function winner(me, comp) {
  if (me === comp) return "tie";
  if (
    (me === "rock" && comp === "scissors") ||
    (me === "paper" && comp === "rock") ||
    (me === "scissors" && comp === "paper")
  ) {
    return "me";
  }
  return "comp";
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function playRound() {
  const playBtn = document.getElementById("play");
  const countdown = document.getElementById("countdown");
  const result = document.getElementById("result");

  playBtn.disabled = true;
  result.textContent = "";
  document.getElementById("computer").textContent = "?";

  for (const step of ["3", "2", "1", "Shoot!"]) {
    countdown.textContent = step;
    await wait(700);
  }

  const me = current;
  if (me === "nothing") {
    result.textContent = "Couldn't see your hand, try again";
    playBtn.disabled = false;
    return;
  }

  const choices = ["rock", "paper", "scissors"];
  const comp = choices[Math.floor(Math.random() * 3)];
  document.getElementById("computer").textContent = EMOJI[comp];

  const w = winner(me, comp);
  if (w === "me") {
    myScore++;
    result.textContent = `You win! ${me} beats ${comp}`;
  } else if (w === "comp") {
    compScore++;
    result.textContent = `Computer wins, ${comp} beats ${me}`;
  } else {
    result.textContent = "Tie!";
  }

  document.getElementById("my-score").textContent = myScore;
  document.getElementById("comp-score").textContent = compScore;
  playBtn.disabled = false;
  decideWinner();
}

function decideWinner() {
  const result = document.getElementById("result");

  if (myScore === 3) {
    result.textContent = "You won the game!";
  } else if (compScore === 3) {
    result.textContent = "The computer won the game!";
  } else {
    return; // nobody has 3 yet, keep playing
  }

  document.getElementById("play").disabled = true;
  document.getElementById("game-over").hidden = false;
}

function rematch() {
  myScore = 0;
  compScore = 0;
  document.getElementById("my-score").textContent = myScore;
  document.getElementById("comp-score").textContent = compScore;

  document.getElementById("result").textContent = "";
  document.getElementById("countdown").textContent = "";
  document.getElementById("computer").textContent = "?";

  document.getElementById("game-over").hidden = true;
  document.getElementById("play").disabled = false;
}

function noRematch() {
  document.getElementById("game-over").hidden = true;
  document.getElementById("result").textContent = "Thanks for playing!";
}

document.getElementById("start").addEventListener("click", start);
document.getElementById("play").addEventListener("click", playRound);
document.getElementById("yes").addEventListener("click", rematch);
document.getElementById("no").addEventListener("click", noRematch);