var height = 6; //number of guesses
var width = 5; //number of word

var row = 0; //current guess or attempt number
var col = 0; //current letter for the attempt

var gameOver = false;
var word = "GUESS";


async function getRandomWord() {
    const response = await fetch("https://raw.githubusercontent.com/rtalabong/verble/main/verbs.csv");
    const text = await response.text();

    // Convert CSV into an array, assuming each line contains a single word
    const words = text.split("\n").map(word => word.trim()).filter(word => word.length === 5);

    // Select a random word and return it in uppercase
    return words[Math.floor(Math.random() * words.length)].toUpperCase();
}

var wordList = [];  // Store valid words

async function loadWords() {
    const response = await fetch("https://raw.githubusercontent.com/rtalabong/verble/main/verbs.csv");
    const text = await response.text();
    
    wordList = text.split("\n").map(word => word.trim().toUpperCase()).filter(word => word.length === 5);
}

window.onload = async function() {
    await loadWords();  // Load words before the game starts
    word = await getRandomWord();  // Pick a random word from the list
    console.log("The correct word is:", word);
    initialize();
};



async function getDefinition(word) {
    try {
        console.log(`Fetching definition for: ${word}`); // Logs the word being queried

        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await response.json();

        console.log("API Response:", data); // Logs the entire response

        if (data && Array.isArray(data) && data.length > 0 && data[0].meanings) {
            return data[0].meanings[0].definitions[0].definition;
        } else {
            return "Definition not found.";
        }
    } catch (error) {
        console.error("Error fetching definition:", error);
        return "Definition not available.";
    }
}



window.onload = async function() {
    word = await getRandomWord(); // Fetch a random word from GitHub
    console.log("The correct word is:", word); // Debugging, remove in production
    initialize();
};


function initialize() {
    //Function to create tiles and event listeners

    // Create the board
    for (let r = 0; r < height; r++) {
        for(let c = 0; c < width; c++) {
            // creates the <span></span>
            let tile = document.createElement("span");
            // adds the id ----> <span id="0-0" class = "tile"></span>
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            // adds the P ---> <span id="0-0" class = "tile">empty string</span>
            tile.innerText = "";
            // it adds the tile to the board
            document.getElementById("board").appendChild(tile);
        }
    }

    // Listen for Key Press
    document.addEventListener("keyup", (e) => {
        if (gameOver) return;

        // alert(e.code)
        if (/^Key[A-Z]$/.test(e.code)) {
            if (col < width) {
                let currTile = document.getElementById(row.toString() + "-" + col.toString());
                if (currTile.innerText == "") {
                    currTile.innerText = e.code[3];
                    col += 1;
                }
            }
        }

        else if (e.code == "Backspace") {
            //if where you are is more than 0 or less than 5 or the width, you can use this key
            if (0 < col && col <= width) {
                col -=1;
            }
            let currTile = document.getElementById(row.toString() + "-" + col.toString());
            currTile.innerText = "";
        }

        else if (e.code == "Enter") {
            update();
            row +=1; // start new row
            col = 0; // start at 0 for new row
        }

        if (!gameOver && row == height){
            gameOver = true;
            document.getElementById("answer").innerText = word;

            // Fetch and display definition
             getDefinition(word).then(definition => {
                document.getElementById("definition").innerText = definition;
    });
    }
});

function update() {
    let correct = 0;
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currTile.innerText;
        
        // Is it in the correct position?
        if (word[c] == letter) {
            currTile.classList.add("correct");
            correct += 1;
        }
        // Is it in the word then?
        else if (word.includes(letter)) {
            currTile.classList.add("present");
        }
        // Not in the word?
        else {
            currTile.classList.add("absent");
        }

        if(correct==width) {
            gameOver = true;
            document.getElementById("answer").innerText = word;

            getDefinition(word).then(definition => {
                document.getElementById("definition").innerText = definition;
            });
        }
    }
}
}