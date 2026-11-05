const SYMBOLS = ["🍎", "🚀", "🎸", "🐱", "⚽", "🌙"];

const board = document.getElementById("board");
const movesEl = document.getElementById("moves");
const bestEl = document.getElementById("best");
const message = document.getElementById("message");

let cards, first, second, lock, moves, matches;
let best = Number(localStorage.getItem("memory-best")) || 0;
bestEl.textContent = best || "-";

function shuffle(list) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

function newGame() {
  board.innerHTML = "";
  message.textContent = "";
  first = second = null;
  lock = false;
  moves = 0;
  matches = 0;
  movesEl.textContent = 0;

  cards = shuffle([...SYMBOLS, ...SYMBOLS]);
  cards.forEach((symbol) => {
    const card = document.createElement("button");
    card.className = "card";
    card.dataset.symbol = symbol;
    card.innerHTML =
      '<div class="inner"><div class="face back"></div>' +
      '<div class="face front">' + symbol + "</div></div>";
    card.addEventListener("click", () => flip(card));
    board.appendChild(card);
  });
}

function flip(card) {
  if (lock || card === first || card.classList.contains("matched")) return;
  card.classList.add("open");

  if (!first) {
    first = card;
    return;
  }

  second = card;
  moves++;
  movesEl.textContent = moves;
  checkMatch();
}

function checkMatch() {
  if (first.dataset.symbol === second.dataset.symbol) {
    first.classList.add("matched");
    second.classList.add("matched");
    first = second = null;
    matches++;
    if (matches === SYMBOLS.length) win();
  } else {
    lock = true;
    setTimeout(() => {
      first.classList.remove("open");
      second.classList.remove("open");
      first = second = null;
      lock = false;
    }, 800);
  }
}

function win() {
  message.textContent = "You won in " + moves + " moves!";
  if (!best || moves < best) {
    best = moves;
    localStorage.setItem("memory-best", best);
    bestEl.textContent = best;
  }
}

document.getElementById("restart").addEventListener("click", newGame);
newGame();