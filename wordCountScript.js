//TEXT BOX
const TEXTBOX = document.querySelector("#userText");

//BUTTONS
const BUT_ANALYZE = document.querySelector("#analyze");
const BUT_RESET = document.querySelector("#reset");
const BUT_FORWARD = document.querySelector("#forward");
const BUT_BACKWARDS = document.querySelector("#backwards");

//ANALYTICS
const CHARS = document.querySelector("#characters");
const WORDS = document.querySelector("#words");
const SENTENCES = document.querySelector("#sentences");
const PARAGRAPHS = document.querySelector("#paragraphs");
const UNIQUEWORDS = document.querySelector("#uniqueWords");
const UNIQUE_WORDCHANGE = document.querySelector("#wordChange");
const UNIQUE_WORDCOUNT = document.querySelector("#wordCount");

var text;
var symbolList = [
  "/",
  "[",
  "-",
  "!",
  "$",
  "%",
  "^",
  "*",
  "()",
  "(",
  ")",
  "|",
  "+",
  "~",
  "=",
  "`",
  "{}",
  "{",
  "}",
  "/",
  "\\",
  "[]",
  "[",
  "]",
  ":",
  '"',
  ";",
  ",",
  "?",
  "'",
  "#",
  "@",
  "&",
  ".",
];

let unique = new Map();
let uniqueKeys = [];
let forward = false;
let backwards = false;

/*
  Function: getText()
  Paramters: N/A
  Return Value: boolean
  Purpose: Get text from textarea. 
           If the default text is there or no text is there alert user.
*/
function getText() {
  if (
    TEXTBOX.value != "" &&
    TEXTBOX.value !=
      "Remember to remove all white spaces from the end of the text! Enter text..."
  ) {
    text = TEXTBOX.value;
    return true;
  } else {
    alert("Please enter text!");
    return false;
  }
}

/*
  Function: getCharacters()
  Paramters: N/A
  Return Value: N/A
  Purpose: Count characters in text.
           Spaces count!
           Splits text by newline and counts characters (returns array)
           Checks if strings is empty and removes it from array
           Updates appropriate tag in html
*/
function getCharacters() {
  var charlist = text.split("\n");
  let amountChar = 0;
  for (let i = 0; i < charlist.length; i++) {
    if (charlist[i] == "s") {
      continue;
    } else {
      console.log(charlist[i]);
      amountChar += charlist[i].length;
    }
  }
  CHARS.innerHTML = amountChar;
}

/*
  Function: getWords()
  Paramters: N/A
  Return Value: N/A
  Purpose: Count words in text.
           Splits text by spaces (returns array)
           Length of array should be amount of words
           Updates appropriate tag in html
*/
function getWords() {
  var wordList = text.split(" ");
  var wordAmount = wordList.length;
  WORDS.innerHTML = wordAmount;
}

/*
  Function: getSentence()
  Paramters: N/A
  Return Value: N/A
  Purpose: Count sentences in text.
           Splits text by spaces to get a list of words (returns array)
           If last index of word is a ?, ., or !, sentence count goes up
           Updates appropriate tag in html
*/
function getSentence() {
  var sentenceList = text.split(" ");
  let count = 0;
  for (let i = 0; i < sentenceList.length; i++) {
    let word = sentenceList[i];
    if (
      word.charAt(word.length - 1) == "?" ||
      word.charAt(word.length - 1) == "." ||
      word.charAt(word.length - 1) == "!"
    ) {
      count++;
    }
  }
  SENTENCES.innerHTML = count;
}

/*
  Function: getParagraphs()
  Paramters: N/A
  Return Value: N/A
  Purpose: Count paragraphs in text.
           Splits text by newline (returns array)
           Checks if strings is empty and removes it from array
           Length of array should be the amount of paragraphs
           Updates appropriate tag in html
*/
function getParagraphs() {
  var paragraphList = text.split("\n");
  for (let i = 0; i < paragraphList.length; i++) {
    if (paragraphList[i] === "") {
      console.log(paragraphList[i]);
      paragraphList.splice(i, 1);
    }
  }
  var paragraphAmount = paragraphList.length;
  PARAGRAPHS.innerHTML = paragraphAmount;
}

/*
  Function: calculateUnique()
  Paramters: N/A
  Return Value: N/A
  Purpose: Count all words in text.
           Splits text by newline to get a list of words (returns array)
           Pass word to trimWord() to get rid of ambiguity
           Store word and count in Map
           Size of Map should be the amount of unique words
           Sort unique words
           Updates appropriate tag in html
*/
function calculateUnique() {
  let index = 0;
  var wordList = text.split(" ");
  for (let i = 0; i < wordList.length; i++) {
    let word = trimWord(wordList[i].toLowerCase().trim());
    if (unique.has(word)) {
      unique.set(word, unique.get(word) + 1);
    } else {
      unique.set(word, 1);
      uniqueKeys[index] = word;
      index++;
    }
  }

  uniqueKeys.sort();
  UNIQUEWORDS.innerHTML = unique.size;
  UNIQUE_WORDCHANGE.innerHTML = uniqueKeys[0];
  UNIQUE_WORDCOUNT.innerHTML = unique.get(uniqueKeys[0]);
}

/*
  Function: trimWord()
  Paramters: String word
  Return Value: String final
  Purpose: Remove ambiguity from word
           Turn word into an array to access every characater (returns array)
           Pass word to trimWord() to get rid of ambiguity
           If the word contains any symnbol from symbolList remove it
           Turn word back into string and return it
*/
function trimWord(word) {
  let wordIndex = word.split("");
  for (let i = 0; i < symbolList.length; i++) {
    if (word.includes(symbolList[i])) {
      let remove = word.indexOf(symbolList[i]);
      wordIndex.splice(remove, 1);
    }
  }
  let final = wordIndex.join("");
  return final;
}

/*
  Function: updateUniqueWordsDisplay()
  Paramters: String word
  Return Value: N/A
  Purpose: Update display for unique words
           Find the index of the word in uniqueKeys
           If moving forward: check if the next value exists if not return to beginning of list
                              if exists add one to index and update appropiate HTML.
                              Set forward to false. 
           If moving backwards: check if the previous value exists if not return to end of list
                              if exists subtract one to index and update appropiate HTML 
                              Set backwards to false. 
*/
function updateUniqueWordsDisplay(word) {
  let start = uniqueKeys.indexOf(word);
  if (forward) {
    if (uniqueKeys[start + 1] == undefined) {
      UNIQUE_WORDCHANGE.innerHTML = uniqueKeys[0];
      UNIQUE_WORDCOUNT.innerHTML = unique.get(uniqueKeys[0]);
    } else {
      UNIQUE_WORDCHANGE.innerHTML = uniqueKeys[start + 1];
      UNIQUE_WORDCOUNT.innerHTML = unique.get(uniqueKeys[start + 1]);
    }
    forward = false;
  } else if (backwards) {
    if (uniqueKeys[start - 1] == undefined) {
      UNIQUE_WORDCHANGE.innerHTML = uniqueKeys[uniqueKeys.length - 1];
      UNIQUE_WORDCOUNT.innerHTML = unique.get(
        uniqueKeys[uniqueKeys.length - 1]
      );
    } else {
      UNIQUE_WORDCHANGE.innerHTML = uniqueKeys[start - 1];
      UNIQUE_WORDCOUNT.innerHTML = unique.get(uniqueKeys[start - 1]);
    }
    backwards = false;
  }
}

//EVENT LISTENERS
/*
  Event Listener on: Analyze Button
  Event: click
  Purpose: Update analytics for text
           Diasables textarea
           Enables forward and backwards buttons
*/
BUT_ANALYZE.addEventListener("click", function () {
  if (getText()) {
    TEXTBOX.disabled = true;
    TEXTBOX.style.borderColor = "#4c956c";
    BUT_FORWARD.removeAttribute("disabled");
    BUT_BACKWARDS.removeAttribute("disabled");

    getCharacters();
    getWords();
    getSentence();
    getParagraphs();
    calculateUnique();
  }
});

/*
  Event Listener on: Reset Button
  Event: click
  Purpose: Clear all data
           Set default text
           Enable textarea
           Disable foward and backwards buttons
*/
BUT_RESET.addEventListener("click", function () {
  if (getText()) {
    TEXTBOX.removeAttribute("disabled");
    TEXTBOX.style.borderColor = "#d62839";

    BUT_FORWARD.disabled = true;
    BUT_BACKWARDS.disabled = true;

    CHARS.innerHTML = "-";
    WORDS.innerHTML = "-";
    SENTENCES.innerHTML = "-";
    PARAGRAPHS.innerHTML = "-";
    UNIQUEWORDS.innerHTML = "-";

    TEXTBOX.value =
      "Remember to remove all white spaces from the end of the text! Enter text...";

    unique.clear();
    uniqueKeys = [];
    forward = false;
    backwards = false;

    UNIQUE_WORDCHANGE.innerHTML = "-";
    UNIQUE_WORDCOUNT.innerHTML = "-";
  }
});

/*
  Event Listener on: Forward Button
  Event: click
  Purpose: Calls updateUniqueWordsDisplay() to move to the 
           next unique word (default: passes in the first unique word).
           Set forward to true and backwards to false
*/
BUT_FORWARD.addEventListener("click", function () {
  forward = true;
  backwards = false;
  let word = UNIQUE_WORDCHANGE.innerHTML;
  updateUniqueWordsDisplay(word);
});

/*
  Event Listener on: Backwards Button
  Event: click
  Purpose: Calls updateUniqueWordsDisplay() to move to the 
           previous unique word (default: passes in the first unique word).
           Set backwards to true and forward to false
*/
BUT_BACKWARDS.addEventListener("click", function () {
  forward = false;
  backwards = true;
  let word = UNIQUE_WORDCHANGE.innerHTML;
  updateUniqueWordsDisplay(word);
});
