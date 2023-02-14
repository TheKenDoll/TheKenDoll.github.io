let guessWord = '';
let actualWord = '';
let hint = '';
let listWords = [];
let guessNum = 0;
let lastPressed = 0;

let disHint = true;
let disInfo = true;
let dark = false;

async function getDictionary(CB){
    const res = await fetch("https://api.masoudkf.com/v1/wordle", {
    headers: {
    "x-api-key": "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv",
    },
    })

    .then(res => res.text());
    data = JSON.parse(res);
    listWords = data['dictionary'];
    CB(listWords);

    return listWords;
}

function loadPage() {
    let temp = getDictionary(function(lw) {
        document.getElementById('startOver').disabled = false;
        document.getElementById('startOver').innerText = 'Start Over';
        listWords = lw;
        setWord();
    })
}

function setWord() {
    let randIndex = Number.parseInt(Math.random() * listWords.length);
    actualWord = listWords[randIndex]['word'].toLowerCase();
    hint = listWords[randIndex]['hint'];
    document.getElementById('content').innerHTML = '<table id="game"><tr><td id="01"></td><td id="02"></td><td id="03"></td><td id="04"></td></tr><tr><td id="11"></td><td id="12"></td><td id="13"></td><td id="14"></td></tr><tr><td id="21"></td><td id="22"></td><td id="23"></td><td id="24"></td></tr><tr><td id="31"></td><td id="32"></td><td id="33"></td><td id="34"></td></tr></table>'
    document.getElementById('bottom-content').innerHTML = '<div id="footer"><footer>&#169; Kenzie Fjestad</footer></div>';
    document.getElementById('startOver').blur();
}

function darkMode() {
    let root = document.querySelector(":root");
    let style = getComputedStyle(root);
    if(dark == false){
        root.style.setProperty('--main','#1a1a1a');
        root.style.setProperty('--text','white');
        dark = true;
    }
    else if(dark == true){
        root.style.setProperty('--main','white');
        root.style.setProperty('--text','black');
        dark = false;
    }
    document.getElementById('buttons1').blur();
}

function getHint() {
    if (disHint == true) {
        // display hint
        document.getElementById('bottom-content').innerHTML = '<div id="hint-text">Hint: '+ hint + '</div><div id="footer"><footer>&#169; Kenzie Fjestad</footer></div>';
        disHint = false;
    } else {
        // remove hint
        document.getElementById('bottom-content').innerHTML = '<div id="footer"><footer>&#169; Kenzie Fjestad</footer></div>';
        disHint = true;
    }
    document.getElementById('buttons2').blur();
}

function getInfo() {
    console.log(disInfo);
    if (disInfo == true) {
        // display hint
        document.getElementById('content').innerHTML += '<div id="help-text"><h1>How To Play</h1><ul><li>Start typing. The letters will appear in the boxes</li><li>Remove letters with backspace</li><li>Hit Enter to submit an answer</li><li>Green letters are in the correct spot</li><li>Yellow letters are correct, but in the wrong position</li><li>Grey letters are incorrect</li><li>Press the &#63; icon for a hint</li></ul></div>';
        disInfo = false;
    } else {
        // remove hint
        let element = document.getElementById('help-text');
        element.remove();
        disInfo = true;
    }
    document.getElementById('buttons3').blur();
}

function addLetter(letter) {
    if (guessWord.length <= 3 && checkAlpha(letter)) {
        guessWord += letter;
        const boxLetter = document.createTextNode(letter.toUpperCase());
        const boxLoc = guessNum.toString() + guessWord.length.toString();
        if (guessWord.length == 1) {
            const box = document.getElementById(boxLoc);
            box.appendChild(boxLetter);
        } else if (guessWord.length == 2) {
            const box = document.getElementById(boxLoc);
            box.appendChild(boxLetter);
        } else if (guessWord.length == 3) {
            const box = document.getElementById(boxLoc);
            box.appendChild(boxLetter);
        } else if (guessWord.length == 4) {
            const box = document.getElementById(boxLoc);
            box.appendChild(boxLetter);
        }
    }
}

function delLetter() {
    const letterLoc = guessNum.toString() + guessWord.length.toString();
    for (let i = 1; i <= 4; i++) {
        if (guessWord.length == i) {
            document.getElementById(letterLoc).innerHTML = '';
            document.getElementById(letterLoc).style.backgroundColor = 'white';
        }
    }
    guessWord = guessWord.substring(0, guessWord.length - 1);
}

function checkWord() {
    if (guessWord == actualWord) {
        winScreen();
    } else {
        checkLetters();
    }
}

function checkLen() {
    if (guessWord.length == 4) {
        return true;
    } else {
        return false;
    }
}

document.addEventListener('keydown', (event) => {
    let name = event.key.toLowerCase();
    displayInput(name);
    if (name === 'enter') {
        if (checkLen()) {
            checkWord();
            guessWord = '';
            guessNum++;
            if (guessNum == 4) {
                loseScreen();
            }
        } else {
            alert('first complete the word');
        }
    } else if (name === 'backspace') {
        delLetter();
    } else {
        addLetter(name);
    }
}, false);

function winScreen() {
    document.getElementById('bottom-content').innerHTML = '<div id="footer"><footer>&#169; Kenzie Fjestad</footer></div>';
    document.getElementById('content').innerHTML = '<div class="win"><img id="gif" src="https://res.cloudinary.com/mkf/image/upload/v1675467141/ENSF-381/labs/congrats_fkscna.gif"></img></div>'
}

function loseScreen() {
    document.getElementById('bottom-content').innerHTML = '<div id="lose">You missed the word ' + actualWord.toUpperCase() + ' and lost!</div><div id="footer"><footer>&#169; Kenzie Fjestad</footer></div>';
}

function checkLetters() {
    let wordCode = '';  // 0 = incorrect, 1 = wrong spot, 2 = correct
    for (let i = 0; i < 4; i++) {
        if (guessWord[i] == actualWord[i]) {
            wordCode += 2;
        } else if (actualWord.includes(guessWord[i])) {
            wordCode += 1;
        } else {
            wordCode += 0;
        }
    }
    changeSquare(wordCode);
}

function checkAlpha(letter) {
    return /^[a-z]+$/.test(letter);
}

function changeSquare(code) {

    for (let i = 1; i <= 4; i++) {
        const boxLoc = guessNum.toString() + i.toString();
        const box = document.getElementById(boxLoc);
        if (code[i-1] == '0') {
            box.style.backgroundColor = 'grey';
        } else if (code[i-1] == '1') {
            box.style.backgroundColor = 'yellow';
        } else {
            box.style.backgroundColor = 'green';
        }
    }
}

function startOver() {
    guessWord = '';
    guessNum = 0;
    disInfo = true;
    disHint = true;
    setWord();
}

async function displayInput(input) {
    if (input == 'backspace') {
        input = 'bs';
    } else if (input == 'enter') {
        input = 'en'
    } else if (!checkAlpha(input) || input.length > 1) {
        return;
    }
    document.getElementById('input-display').style.backgroundColor = 'var(--accent)';
    document.getElementById('input-display').style.opacity = 1;
    document.getElementById('input-display').innerHTML = '<div id="input-letter">' + input.toUpperCase() + '</div>';

    lastPressed = 10;
    await sleep(2000);
    lastPressed--;

    while (lastPressed < 10 && lastPressed >= 0) {
        document.getElementById('input-display').style.opacity = lastPressed/10;
        await sleep(10);
        lastPressed--;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


window.onload = function(){loadPage();};