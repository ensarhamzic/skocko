// Array of symbols
const symbols = [
  '<i class="fas fa-heart"></i>',
  '<i class="fas fa-star"></i>',
  '<i class="fas fa-bell"></i>',
  '<i class="fas fa-cloud"></i>',
  '<i class="fas fa-home"></i>',
  '<i class="fas fa-leaf"></i>',
];

// Generating random combination
function generateCombination() {
  const arr = [];
  for (let i = 0; i < 4; i++) {
    let random = Math.floor(Math.random() * 6) + 1;
    arr.push(random);
  }
  return arr;
}

// Random combination array (winning combination)
const combination = generateCombination();

let currRow = 1; // Current row player is on
let numGuess = 0; // Number of filled fields
let isOnceFull = false; // Were all the fields in a row full once in the past (used to prevent adding event listeners more than once)

// Adding focus class to the first field in the whole game (starting the game)
let firstEl = document.querySelector(`#row1 .g1`);
firstEl.classList.add("focus");

// Removes focus from all elements in row and adds to first (This is used when user deletes choice from some field)
function removeAndAddFocus(items) {
  for (let i = 0; i < items.length; i++) {
    items[i].classList.remove("focus");
  }
  for (let i = 0; i < items.length; i++) {
    if (!items[i].textContent) {
      items[i].classList.add("focus");
      break;
    }
  }
  // If present, removes the arr class from arrow (removes style)
  let arrow = document.querySelector(`#arrow${currRow}`);
  arrow.classList.remove("arr");
}

// Function that calculates number of correct fields and goes to second row and removes event listeners on elements before
function round() {
  if (numGuess !== 4) return;
  let comb = [];
  comb.push(...combination);
  let numCorrect = 0; // Number of correct places
  let numSemiCorrect = 0; // Number of correct symbols that are on on its place

  let choices = [
    ...document.querySelectorAll(`#row${currRow} .guessDiv div[class*='g']`),
  ];
  for (let i = 0; i < choices.length; i++) {
    // Converting symbols to numbers to be able to compare them to the correct combination easier
    let currSym = choices[i].innerHTML.trim(); // Trimming it because it had some spaces before and after
    currSym = symbols.indexOf(currSym) + 1;
    choices[i] = currSym; // Making array to compare to winning combination

    // Calculating number of correct symbols on correct places, and then replacing that place with 0, to be able to skip that later when calculating number of semi correct symbols
    if (choices[i] == comb[i]) {
      numCorrect++;
      choices[i] = 0;
      comb[i] = 0;
    }
  }

  // Calculating number of symbols that are guessed but not on the right place
  for (let i = 0; i < choices.length; i++) {
    if (choices[i] === 0) continue;
    for (let j = 0; j < choices.length; j++) {
      if (comb[j] === 0 || i === j) continue;
      if (choices[i] === comb[j]) {
        numSemiCorrect++;
        choices[i] = 0;
        comb[j] = 0;
        break;
      }
    }
  }

  // Coloring the divs
  const answerDivs = document.querySelectorAll(
    `#row${currRow} .answerDiv div[class*='a']`
  );
  for (let i = 0; i < numCorrect; i++) {
    answerDivs[i].classList.add("correct");
  }
  for (let i = 0; i < numSemiCorrect; i++) {
    answerDivs[i + numCorrect].classList.add("semiCorrect");
  }
  // Putting x at remaining places
  for (i = 0; i < answerDivs.length; i++) {
    if (i + numCorrect + numSemiCorrect < 4) {
      answerDivs[i + numCorrect + numSemiCorrect].innerHTML = "&times;";
    }
  }

  // Reseting stuff
  if (currRow < 7 && currRow > 0) {
    let arrow = document.querySelector(`#arrow${currRow}`);
    arrow.classList.remove("arr");
  }
  currRow++;
  // if user wins, disable him to continue playing
  if (numCorrect === 4) {
    currRow = 0;
    return;
  }
  numGuess = 0;
  isOnceFull = false;
  // Add focus to first element (start over)
  if (currRow < 7 && currRow > 0) {
    let firstEl = document.querySelector(`#row${currRow} .g1`);
    firstEl.classList.add("focus");
  }
}

// Adds new item on its place
function addItem(item) {
  if (!(currRow < 7 && currRow > 0)) return;
  // Selects all fields in that row
  let fields = [
    ...document.querySelectorAll(`#row${currRow} .guessDiv div[class*='g']`),
  ];
  for (let i = 0; i < fields.length; i++) {
    // If field content is empty then place clicked item there
    if (!fields[i].textContent) {
      fields[i].innerHTML = item.innerHTML;
      numGuess++;
      // Event listener to be able to delete choice inside field
      fields[i].addEventListener("click", () => {
        if (fields[i].innerHTML) {
          numGuess--;
          fields[i].innerHTML = "";
          removeAndAddFocus(fields);
        }
      });
      // Removes focus from current field (because it is filled now)
      fields[i].classList.remove("focus");
      // Iterating to end to put focus on next empty space
      for (let j = i + 1; j < fields.length; j++) {
        if (!fields[j].textContent) {
          fields[j].classList.add("focus");
          break;
        }
      }
      break;
    }
  }
  // If number of full fields is 4 and if was never 4 (this prevents adding click event more than once)
  if (numGuess === 4) {
    let arrow = document.querySelector(`#arrow${currRow}`);
    arrow.classList.add("arr");
  }
  if (numGuess === 4 && isOnceFull === false) {
    let arrow = document.querySelector(`#arrow${currRow}`);
    arrow.classList.add("arr");
    arrow.addEventListener("click", () => {
      round();
    });
    isOnceFull = true;
  }
}

// All fields where are symbols
let heart = document.querySelector("#heart");
let star = document.querySelector("#star");
let bell = document.querySelector("#bell");
let cloud = document.querySelector("#cloud");
let home = document.querySelector("#home");
let leaf = document.querySelector("#leaf");

// Adding onclick on every item
heart.addEventListener("click", () => {
  addItem(heart);
});

star.addEventListener("click", () => {
  addItem(star);
});

bell.addEventListener("click", () => {
  addItem(bell);
});

cloud.addEventListener("click", () => {
  addItem(cloud);
});

home.addEventListener("click", () => {
  addItem(home);
});

leaf.addEventListener("click", () => {
  addItem(leaf);
});

const reset = document.querySelector("#resetGame");
reset.addEventListener("click", () => {
  let fieldsInCurrRow = document.querySelectorAll(
    `div[id*="row"] .guessDiv div[class*="g"]`
  );
  for (let field of fieldsInCurrRow) {
    field.classList.remove("focus");
    field.innerHTML = "";
  }
  let answerDivs = document.querySelectorAll(
    `div[id*="row"] .answerDiv div[class*='a']`
  );
  for (let answer of answerDivs) {
    answer.classList.remove("correct");
    answer.classList.remove("semiCorrect");
    answer.innerHTML = "";
  }
  combination.length = 0;
  combination.push(...generateCombination());
  currRow = 1;
  numGuess = 0;
  isOnceFull = false;
  document.querySelector("#row1 .g1").classList.add("focus");
});
