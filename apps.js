//? HTML IMAGE GRABS--------------------------------------------------------------------------------------------------------------
const dealersCardLeftImage = document.getElementById("dealers-card-left-image");
const dealersCardRightImage = document.getElementById(
  "dealers-card-right-image"
);
const playersCardLeftImage = document.getElementById("players-card-left-image");
const playersCardRightImage = document.getElementById(
  "players-card-right-image"
);
//? HTML DIV GRABS ---------------------------------------------------------------------------------------------------------------
const playersHand = document.getElementById("players-hand");
const dealersHand = document.getElementById("dealers-hand");
const playerText = document.getElementById("playersText");
const dealersText = document.getElementById("dealersText");
const playersCardLeft = document.getElementById("players-card-left");
const playersCardRight = document.getElementById("players-card-right");
const backOfCard = document.getElementById("backOfCard");
const resultLeft = document.getElementById("resultLeft");
const resultRight = document.getElementById("resultRight");
const scoreLeft = document.getElementById("scoreLeft");
const scoreRight = document.getElementById("scoreRight");
const betLeft = document.getElementById("betLeft");
const betRight = document.getElementById("betRight");
const score = document.getElementById("score");
const highScores = document.getElementById("highScores");
const potLeft = document.getElementById("potValueLeft");
const potRight = document.getElementById("potValueRight");
const gapP = document.getElementById("gapP");
//? BUTTON LINKS--------------------------------------------------------------------------------------------------------------
const restartButton = document.getElementById("restartButton");
const hitButton = document.getElementById("hitButton");
const standButton = document.getElementById("standButton");
const betButton = document.getElementById("betButton");
const splitButton = document.getElementById("splitButton");
const bet50Button = document.getElementById("bet50Button");
const bet100Button = document.getElementById("bet100Button");
const bet200Button = document.getElementById("bet200Button");
const doubleDownButton = document.getElementById("doubleDownButton");
//? EVENT LISTENERS----------------------------------------------------------------------------------------------------------
restartButton.addEventListener("click", loadGame);
hitButton.addEventListener("click", hit);
standButton.addEventListener("click", stand);
betButton.addEventListener("click", deal);
splitButton.addEventListener("click", split);
bet50Button.addEventListener("click", bet50);
bet100Button.addEventListener("click", bet100);
bet200Button.addEventListener("click", bet200);
doubleDownButton.addEventListener("click", doubleDown);
//? GLOBAL OBJECT------------------------------------------------------------------------------------------------------------
let obj = {
  currentCards: [],
  playersCards: [],
  playersSplitCards: [],
  dealersCards: []
};
//? SET SCREEN-------------------------------------------------------------------------------------------------------------
setScreen()
function setScreen() {
  if (document.documentElement.clientWidth < 800) {
    document
        .querySelector("meta[name=viewport]")
        .setAttribute('content', 'initial-scale=0.9', 'maximum-scale=0.9', 'width=800');
  }
  if (document.documentElement.clientWidth < 700) {
    document
        .querySelector("meta[name=viewport]")
        .setAttribute('content', 'initial-scale=0.4', 'maximum-scale=0.4', 'width=800');
  }
}
//? LOAD GAME-----------------------------------------------------------------------------------------------------------
loadGame();
//? LOAD AND START GAME-------------------------------------------------------------------------------------------------
function loadGame() {
  //localStorage.clear()
  getCardBackImage()
  getLocalHighScores()
  setHighScoresHTML()
  resetVariables()
  resetText();
  addBetButtons();
  removeAllPlayButtons()
  refreshStartOfGame()
  setBetButton(true)
  setScore();
  resetCards();
  setTimeout(getSetPlayerName,500);
}
function pageReload() {
  location.reload();
}
function getSetPlayerName() {
  if (playerText.innerHTML === "") {
    let playerName = prompt("Enter up to 3 initials.","");
    if (playerName) {
      //Makes initials upper case and limits to 3
      playerName = playerName.toUpperCase();
      playerName = playerName.substr(0, 3);
      playerText.innerHTML = playerName;
    } else {
      //Defaults name to --- if nothing is put
      playerText.innerHTML = "---";
    }
  }
}
function deal() {
  addAllPlayButtons();
  addBackOfCard()
  setPotRight()
  subtractBetFromScore()
  removeBetButtons()
  removeBetText()
  console.log('Score After Bet:'+score.innerText)
  startCards("players", "left");
  startCards("dealers", "left");
  startCards("players", "right");
  checkForSplit()
  if(startCards("dealers", "right")) {
    return;
  }
  playerRightHasEqualOrOver21();
  buttonDelay();
}
function startCards(who, where) {
  //Gets Dealer and Player cards, appends the images, sets the values, and checks for aces.
  setRandomCard();
  if (who === "dealers") {
    pushDealersNewCardToHand()
    if (where === "right") {
      dealersCardRightImage.src = setNewCardImageSRC(obj.newCard);
      //If Insurance is true, game ends
      if(insuranceCheck(obj.newCard, who)) {
        return true;
      }
    } else {
      dealersCardLeftImage.src = setNewCardImageSRC(obj.newCard);
      return;
    }
    getCardValueDigit()
    setCardValue(obj.newCardValue, "dealers");
    //Checks Dealers RIGHT card only for an Ace (so player doesn't know facedown left card is an Ace)
    checkForAce(obj.dealersCards[1], "dealers");
  } else {
    pushPlayersNewCardToHand()
    if (where === "right") {
      playersCardRightImage.src = setNewCardImageSRC(obj.newCard);
    } else {
      playersCardLeftImage.src = setNewCardImageSRC(obj.newCard);
    }
    getCardValueDigit()
    setCardValue(obj.newCardValue, "players");
    checkForAce(obj.playersCards, "players");
  }
}
function insuranceCheck(newCard, who) {
  //Checks to see if the RIGHT card is an ACE
  if (newCard.slice(0, -1) === "1") {
    //Checks to see if the LEFT card is a NON-10 value card
    if (+obj.dealersCards[0].slice(0, -1) > 0) {
      //If is IS a 10, Dealer has BJ and game is over
    } else {
      obj.dealersTotal = 11;
      updateTotalText(who)
      removeBackOfCard()
      removeAllPlayButtons()
      obj.aceD = 1;
      obj.dTurn = 1;
      checkForAce(obj.playersCards, "players");
      checkFinishRight(obj.playersTotal, obj.dealersTotal);
      return true;
    }
  }
}
function checkForSplit() {
  //Checks to see if the left and right card is the same card
  let x = obj.playersCards[0].slice(0, -1);
  let y = obj.playersCards[1].slice(0, -1);
  if (x === y) {
    splitButton.classList.add("show");
  }
}
//? RESET ALL VARIABLES/TEXTS-------------------------------------------------------------------------------------------
function setScore() {
  if (score.innerText === "") {
    score.innerText = 2000;
  }
}
function resetCards() {
  //Removes all the new cards (DIVS) from the previous game
  document.querySelectorAll(".newCard").forEach((a) => a.remove());
  let x = document.getElementsByClassName("cardImage");
  //Sets the starting cards to show the card back image
  for (let i = 0; i < x.length; i++) {
    x[i].src = "img/png/" + obj.cardBackImage + ".png";
  }
}
function resetText() {
  dealersText.dataset.value = "";
  scoreRight.innerText = "";
  scoreLeft.innerText = "";
  resultRight.innerText = "";
  resultLeft.innerText = "";
  betRight.innerText = "";
  betLeft.innerText = "";
  potRight.innerText = "";
  potLeft.innerText = "";
}
function resetVariables() {
  obj.currentCards = [];
  obj.playersCards = [];
  obj.playersSplitCards = [];
  obj.dealersCards = [];
  obj.playersTotal = 0;
  obj.dealersTotal = 0;
  obj.betLeft = 0;
  obj.split = 0;
  obj.hit = 0;
  obj.stand = 0;
  obj.doubleDown = 0;
  obj.aceD = 0;
  obj.dTurn = 0;
  obj.endRight = 0;
}
function removeBetText() {
  betRight.innerText = "";
  betLeft.innerText = "";
}
//? BETS/POT--------------------------------------------------------------------------------------------------------------
function bet50() {
  betRight.innerText = 50;
  obj.betRight = 50;
  setBetButton(false);
}
function bet100() {
  betRight.innerText = 100;
  obj.betRight = 100;
  setBetButton(false);
}
function bet200() {
  betRight.innerText = 200;
  obj.betRight = 200;
  setBetButton(false);
}
function setBetButton(bool) {
  //Disables bet button until a bet is chosen
  betButton.disabled = bool;
}
function addBetButtons() {
  betButton.classList.add("show");
  bet50Button.classList.add("show");
  bet100Button.classList.add("show");
  bet200Button.classList.add("show");
}
function removeBetButtons() {
  betButton.classList.remove("show");
  bet50Button.classList.remove("show");
  bet100Button.classList.remove("show");
  bet200Button.classList.remove("show");
}
function subtractBetFromScore() {
  score.innerText -= obj.betRight;
}
function setPotRight() {
  potRight.innerText = obj.betRight;
}
function setPotLeft() {
  potLeft.innerText = obj.betRight;
}
function addDoubleDownToBet() {
  //If SPLIT is on left hand and DD is pressed, left bet doubles
  if (obj.split === 1) {
    obj.betLeft *= 2
  //Else, right hand doubles
  } else {
    obj.betRight *= 2
  }
}
function addDoubleDownToPot() {
  if (obj.split === 1) {
    potLeft.innerText = +potLeft.innerText + obj.betLeft;
  } else {
    potRight.innerText = +potRight.innerText + obj.betRight;
  }
}
//? HIT/STAND------------------------------------------------------------------------------------------------------------
function hit() {
  if(hitSplitLeft()){
    return;
  }
  //Checks if SPLIT is current on RIGHT hand
  hitSplitRight()
  splitButton.classList.remove("show");
  doubleDownButton.classList.remove("show");
  createPlayersNewCardDivHTML();
  createPlayersNewCardImageHTML();
  appendPlayersNewCardDivAndImageHTML();
  createPlayersNewCard();
  pushPlayersNewCardToHand();
  getCardValueDigit()
  setCardValue(obj.newCardValue, "players");
  checkForAce(obj.playersCards, "players");
  checkBustButtonRemoval();
  if (playerRightHasEqualOrOver21()) {
    return;
  }
  buttonDelay();
  checkSplitDoubleBust();
  checkEndPlayerRight();
}
function stand() {
  //For Split: Checks if the first hand has been finished
  obj.stand = 1;
  //For Split: Resets hit for card drawing to be accurate
  obj.hit = 0;
  if (obj.split !== 1) {
    obj.dTurn = 1;
    removeAllPlayButtons()
    removeBackOfCard()
    AddFacedownCardToTotal()
    checkForAce(obj.playersCards, "players");
    checkEndPlayerRight();
  } 
  else {
    obj.split = 2;
    checkForAceSplit(obj.playersSplitCards)
    hit();
    if (obj.playersTotal < 21) {
      doubleDownButton.classList.add('show');
    }
    buttonDelay();
  }
}
//? SPLIT---------------------------------------------------------------------------------------------------------------
function split() {
  obj.split = 1;
  //Add split bet to pot
  setPotLeft()
  //Subtract split bet from score
  subtractBetFromScore()
  console.log('Score After Split:'+score.innerText)
  splitButton.classList.remove("show");
  //Add gap between cards
  gapP.classList.add("show");
  //Move left card to the splitCards array
  obj.playersSplitCards.push(obj.playersCards.shift());
  //Set totals to the value of one split card
  splitPlayerTotal()
  setSplitTextTotalAndBet()
  //Automatically Hit
  hitSplitLeft()
}
function hitSplitLeft() {
  if (obj.split === 1) {
    //After first hit, split the 'last hit' card in half when a new one is drawn
    if (obj.hit === 1) {
      obj.playersSplitCardDivHTML = document.getElementById("players-new-card");
      obj.playersSplitCardDivHTML.classList.add("splitCardImage", "noGap");
      obj.playersSplitCardDivHTML.removeAttribute("id");
      if (obj.doubleDown === 0) {
        doubleDownButton.classList.remove('show');
      }
    }
    obj.hit = 1;
    createPlayersNewCardDivHTML();
    createPlayersNewCardImageHTML();
    //Insert the new SPLIT card to the left of the "GAP"
    playersHand.insertBefore(obj.playersNewCardDivHTML, gapP);
    //Cuts the card left of the new card in half
    playersCardLeft.classList.add("splitCardImage", "noGap");
    //Append Image to Div
    obj.playersNewCardDivHTML.appendChild(obj.playersNewCardImageHTML);
    //Finds random card and sets it to the image
    createPlayersNewCard();
    //Adds SPLIT card to the SPLIT hand of cards
    obj.playersSplitCards.push(obj.newCard);
    //Gets value of card
    getCardValueDigit()
    //Sets value of card to split total
    setSplitCardValue(obj.newCardValue, "players");
    //Checks SPLIT hand for ACES
    checkForAceSplit(obj.playersSplitCards)
    //Check right hand for ACE to show 1 or 11 while SPLIT hand plays
    checkForAce(obj.playersCards, "players");
    buttonDelay();
    //If SPLIT hand is equal or over 21, automatically stand
    playerLeftHasEqualOrOver21()
    splitButton.classList.remove("show");
    return true;
  }
}
function hitSplitRight() {
  if (obj.split === 2) {
    obj.playersSplitCardDivHTML = document.getElementById("players-new-card");
    //After first hit, split the 'last hit' card in half when a new one is drawn
    if(obj.hit === 1) {
      obj.playersSplitCardDivHTML.classList.add("splitCardImage", "noGap");
    }
    obj.hit = 1;
    obj.playersSplitCardDivHTML.removeAttribute("id");
    playersCardRight.classList.add("splitCardImage", "noGap");
  }
}
function splitPlayerTotal() {
  obj.playersTotal /= 2;
}
function setSplitTextTotalAndBet() {
  obj.betLeft = obj.betRight
  scoreRight.innerText = obj.playersTotal;
  obj.playersSplitTotal = obj.playersTotal;
}
function checkSplitDoubleBust() {
  if (obj.split === 2) {
    if(obj.playersTotal > 21) {
      if(obj.playersSplitTotal > 21) {
      } else {
        stand();
      }
    }
  }
}
//? DOUBLEDOWN-----------------------------------------------------------------------------------------------------------
function doubleDown() {
  subtractBetFromScore();
  console.log('Score After DD:'+score.innerText)
  addDoubleDownToPot();
  addDoubleDownToBet();
  if (doubleDownLeft()) {
  } else {
    doubleDownRight();
  }
}
function doubleDownLeft() {
  if (obj.split === 1) {
    obj.doubleDown = 1;
    hit();
    //If player didn't BUST, auto stand:
    if (obj.playersSplitTotal < 21) {
      setTimeout(stand, 500)
    }
    return true;
  }
}
function doubleDownRight() {
  hit();
  removeAllPlayButtons();
  //If player didn't BUST, auto stand:
  if(obj.playersTotal < 21) {
    setTimeout(stand, 500)
  }
}
//? DEALER TURN---------------------------------------------------------------------------------------------------------
function AddFacedownCardToTotal() {
  //Adds value of Dealers facedown card to total, checking for ace
  obj.newCardValue = obj.dealersCards[0].slice(0, -1);
  setCardValue(obj.newCardValue, "dealers");
  checkForAce(obj.dealersCards, "dealers");
}
function dealersHit() {
  createDealersNewCardDivHTML();
  createDealersNewCardImageHTML();
  appendDealersNewCardDivAndImageHTML();
  createDealersNewCard();
  pushDealersNewCardToHand();
  getCardValueDigit();
  setCardValue(obj.newCardValue, "dealers");
  checkForAce(obj.dealersCards, "dealers");
  checkEndPlayerRight();
}
//? CREATE PLAYERS NEW CARDS-----------------------------------------------------------------------------------------------
function createPlayersNewCardDivHTML() {
  obj.playersNewCardDivHTML = document.createElement("div");
  obj.playersNewCardDivHTML.classList.add("pCard", "newCard");
  if (obj.split > 0) {
    obj.playersNewCardDivHTML.classList.add("noGap");
  }
  obj.playersNewCardDivHTML.id = "players-new-card";
}
function createPlayersNewCardImageHTML() {
  obj.playersNewCardImageHTML = document.createElement("img");
  obj.playersNewCardImageHTML.classList.add("cardImage", "newCardImage");
  obj.playersNewCardImageHTML.id = "players-new-card-image";
  obj.playersNewCardImageHTML.src = "";
}
function appendPlayersNewCardDivAndImageHTML() {
  playersHand.appendChild(obj.playersNewCardDivHTML);
  obj.playersNewCardDivHTML.appendChild(obj.playersNewCardImageHTML);
}
function createPlayersNewCard() {
  setRandomCard()
  obj.playersNewCardImageHTML.src = setNewCardImageSRC(obj.newCard);
}
function pushPlayersNewCardToHand() {
  obj.playersCards.push(obj.newCard);
}
//? CREATE DEALERS NEW CARDS-----------------------------------------------------------------------------------------------
function createDealersNewCardDivHTML() {
  obj.dealersNewCard = document.createElement("div");
  obj.dealersNewCard.classList.add("dCard", "newCard");
  obj.dealersNewCard.id = "dealers-new-card";
}
function createDealersNewCardImageHTML() {
  obj.dealersNewCardImage = document.createElement("img");
  obj.dealersNewCardImage.classList.add("cardImage", "newCardImage");
  obj.dealersNewCardImage.id = "dealers-new-card-image";
  obj.dealersNewCardImage.src = "";
}
function appendDealersNewCardDivAndImageHTML() {
  dealersHand.appendChild(obj.dealersNewCard);
  obj.dealersNewCard.appendChild(obj.dealersNewCardImage);
}
function createDealersNewCard() {
  setRandomCard()
  obj.dealersNewCardImage.src = setNewCardImageSRC(obj.newCard);
}
function pushDealersNewCardToHand() {
  obj.dealersCards.push(obj.newCard);
}
//? GET AND SET RANDOM CARDS-----------------------------------------------------------------------------------------------
function getRandomCard() {
  // set a random card to newCard variable
  const valueSet = "1234567890JQK";
  const suitSet = "CDSH";
  const value = valueSet[Math.floor(Math.random() * valueSet.length)];
  const suit = suitSet[Math.floor(Math.random() * suitSet.length)];
  const newCardValueSuit = value + suit;
  // If the new card is already out, this repeats the function
  if (obj.currentCards.indexOf(newCardValueSuit) != -1) {
    return getRandomCard();
  }
  // Add new card to the currentCard array
  obj.currentCards.push(newCardValueSuit);
  return newCardValueSuit;
}
function setRandomCard() {
  obj.newCard = getRandomCard();
}
function setNewCardImageSRC(newCard) {
  return "img/png/" + newCard + ".png" 
}
//? GET AND SET CARD VALUES------------------------------------------------------------------------------------------------
function getCardValueDigit() {
  obj.newCardValue = obj.newCard.slice(0, -1);
}
function setCardValue(newCardValue, who) {
  if (who === "players") {
    if (newCardValue > 0) {
      return (obj.playersTotal += +newCardValue);
    } else {
      return (obj.playersTotal += 10);
    }
  } else if (newCardValue > 0) {
    return (obj.dealersTotal += +newCardValue);
  } else {
    return (obj.dealersTotal += 10);
  }
}
function setSplitCardValue(newCardValue, who) {
  if (who === "players") {
    if (newCardValue > 0) {
      return (obj.playersSplitTotal += +newCardValue);
    } else {
      return (obj.playersSplitTotal += 10);
    }
  } else if (newCardValue > 0) {
    return (obj.dealersTotal += +newCardValue);
  } else {
    return (obj.dealersTotal += 10);
  }
}
//? CHECK/UPDATE TOTALS----------------------------------------------------------------------------------------------------
function checkForAce(arr, who) {
  let regex = RegExp("1");
  for (let i = 0; i < arr.length; i++) {
    if (who === "players") {
      if (regex.test(arr[i])) {
        // CHECK IF PLAYERS TOTAL IS FINAL
        if (standButton.classList.contains("show")) {
          // CHECK IF PLAYER WOULD BE BUST
          if (obj.playersTotal + 10 > 21) {
            updateTotalText(who)
            // Check if Player has a CHOICE for ACE total
          } else if (obj.playersTotal + 10 < 21) {
            scoreRight.innerText =
              obj.playersTotal + " or " + (obj.playersTotal + 10);
            // Check if Player HAS 21 with ACE, if so USE IT!
          } else {
            obj.playersTotal += 10;
            updateTotalText(who)
          }
          return;
          // After STAND, check if could use +10, if so USE IT!
        } else if (obj.playersTotal + 10 <= 21) {
          obj.playersTotal += 10;
          updateTotalText(who)
          // After STAND, if not, don't
        } else {
          updateTotalText(who)
        }
        return;
        // Player DOES NOT have ACE
      } else {
        updateTotalText(who)
      }
    } else {
      if (regex.test(arr[i])) {
        obj.aceD = 1;
        // Check if Dealer would BUST
        if (obj.dealersTotal + 10 > 21) {
          updateTotalText(who)
          // If not, show the Dealers options for the ACE
        } else {
          dealersText.dataset.value =
            obj.dealersTotal + " or " + (obj.dealersTotal + 10); 
        }
        return;
        // Dealer DOES NOT have ACE
      } else {
        updateTotalText(who)
      }
    }
  }
}
function checkForAceSplit(arr) {
  let regex = RegExp("1");
  for (let i = 0; i < arr.length; i++) {
    if (regex.test(arr[i])) {
      // CHECK IF PLAYERS TOTAL IS FINAL
      if (obj.stand === 0) {
        // CHECK IF PLAYER WOULD BE BUST
        if (obj.playersSplitTotal + 10 > 21) {
          updateSplitTotalText()
          // Check if Player has a CHOICE for ACE total
        } else if (obj.playersSplitTotal + 10 < 21) {
          scoreLeft.innerText =
            obj.playersSplitTotal + " or " + (obj.playersSplitTotal + 10);
          // Check if Player HAS 21 with ACE, if so USE IT!
        } else {
          obj.playersSplitTotal += 10;
          updateSplitTotalText()
        }
        return;
        // After STAND, check if could use +10, if so USE IT!
      } else if (obj.playersSplitTotal + 10 <= 21) {
        obj.playersSplitTotal += 10;
        updateSplitTotalText()
        // After STAND, if not, don't
      } else {
        updateSplitTotalText()
      }
      return;
      // Player DOES NOT have ACE
    } else {
      updateSplitTotalText()
    }
  }
}
function updateDealerTotalWithAce() {
  obj.dealersTotal += 10;
  dealersText.dataset.value = obj.dealersTotal;
}
function updateTotalText(who) {
  if (who === "players") {
    scoreRight.innerText = obj.playersTotal;

  } else {
    dealersText.dataset.value = obj.dealersTotal;
  }
}
function updateSplitTotalText() {
    scoreLeft.innerText = obj.playersSplitTotal;
}
//? BUTTON/ETC: SHOW/HIDE/REMOVE/ETC-------------------------------------------------------------------------------------------
function buttonDelay() {
  //Delays the buttons so a double click doesn't happen
  standButton.disabled = true;
  hitButton.disabled = true;
  doubleDownButton.disabled = true;
  splitButton.disabled = true;
  setTimeout(() => {
    standButton.disabled = false;
    hitButton.disabled = false;
    doubleDownButton.disabled = false;
    splitButton.disabled = false;
  }, 500);
}
function checkBustButtonRemoval() {
  if (obj.playersTotal > 21) {
    hitButton.classList.remove("show");
    standButton.classList.remove("show");
  }
}
function addAllPlayButtons() {
  hitButton.classList.add("show");
  standButton.classList.add("show");
  doubleDownButton.classList.add("show");
}
function removeAllPlayButtons() {
  hitButton.classList.remove('show');
  standButton.classList.remove('show');
  doubleDownButton.classList.remove("show");
  splitButton.classList.remove("show");
}
function removeBackOfCard() {
  backOfCard.classList.remove("show");
}
function addBackOfCard() {
  backOfCard.classList.add("show");
}
function refreshStartOfGame() {
  gapP.classList.remove("show");
  restartButton.classList.remove("show");
  playersCardLeft.classList.remove("splitCardImage", "noGap");
  playersCardRight.classList.remove("splitCardImage", "noGap");
}
//? HIGH SCORES------------------------------------------------------------------------------------------------------------
function setHighScoresHTML() {
  //Check to see if there is even a high score list
  if(obj.highScores) {
    //Show the TOP 5 high scores on the page
    for (let i = 0; i < 5; i++) {
      //If there are NOT 5 scores, stop at last one
      if (obj.highScores[i]) {
        highScores.innerHTML = highScores.innerHTML + "<br>" + obj.highScores[i];
      }
    }
  }
}
function getLocalHighScores() {
  highScores.innerHTML = "Top 5 High Scores:";
  //If High scores array is not created, create it
  if (localStorage.getItem("High Scores") === null) {
    obj.highScores = [];
    //If is it, populate it with the current high scores.
  } else {
    obj.highScores = JSON.parse(localStorage.getItem("High Scores"));
  }
}
function saveLocalHighScore(playerName, playerScore) {
  //If current player has a high score that is more than current score, pass on function
  if (removeLowerHighScore(playerName, playerScore)) {
    //Possible object way to do high scores:
    //obj.highScores.push({'playerName': playerName, 'highScore': +playerScore})
    sortHighScores(playerName, playerScore)
    localStorage.setItem("High Scores", JSON.stringify(obj.highScores));
  }
}
function removeLowerHighScore(playerName, playerScore) {
  //If Player has a high score in the array
  let playerInLocalStorage = obj.highScores.find(highScoresArray =>highScoresArray.includes(playerName));
  //If Players current score is more than previous high score
  if (playerInLocalStorage){
    if (+(playerInLocalStorage.slice(-4)) < playerScore) {
      let index = obj.highScores.indexOf(playerInLocalStorage);
      //Splice previous high score
      obj.highScores.splice(index, 1);
      return true;
    }
    return false;
  }
  return true;
}
function sortHighScores(playerName, playerScore) {
  //Find index of the highest score that is below the current score
  indexOfScoreGreater = obj.highScores.findIndex(function(highScore) {
    return +(highScore.slice(-4)) < playerScore
  });
  //If there is NO score high, make this the HIGH score
  if (indexOfScoreGreater === -1) {
    obj.highScores.push((playerName + ": " + playerScore))
  //Else, place the current score at the index of the score under it
  } else {
    obj.highScores.splice((indexOfScoreGreater), 0, (playerName + ": " + playerScore));
  }
}
function resetHighScores() {
  let reset = prompt("Type 'RESET' to reset the high scores list.");
  if (reset === "RESET") {
    localStorage.removeItem("High Scores")
    pageReload();
  }
}
//? DECK STYLE OPTIONS-----------------------------------------------------------------------------------------------------
function getCardBackImage() {
  //If High scores array is not created, create it
  if (localStorage.getItem("Card Back Image") === null) {
    obj.cardBackImage = 'back';
    //If is it, populate it with the current high scores.
  } else {
    obj.cardBackImage = localStorage.getItem("Card Back Image");
  }
}
function setCardBackImage() {
  localStorage.removeItem("Card Back Image");
  localStorage.setItem("Card Back Image", obj.cardBackImage)
  loadGame();
}
function blueCardBackImage() {
  obj.cardBackImage = "blueback"
  setCardBackImage();
}
function defaultCardBackImage() {
  obj.cardBackImage = "back"
  setCardBackImage();
}
function redCardBackImage() {
  obj.cardBackImage = "redback"
  setCardBackImage();
}
function rainbowCardBackImage() {
  obj.cardBackImage = "rainbowback"
  setCardBackImage();
}
function mountainCardBackImage() {
  obj.cardBackImage = "mountainback"
  setCardBackImage();
}
function newYorkCardBackImage() {
  obj.cardBackImage = "newyorkback"
  setCardBackImage();
}
function waterfallCardBackImage() {
  obj.cardBackImage = "waterfallback"
  setCardBackImage();
}
//? CHECK FINISHES---------------------------------------------------------------------------------------------------------
function checkFinishRight(p, d) {
  if (lostRight(p, d)) {
    return;
  } else if (checkBlackjackRight(p, d)) {
    return;
  } else if (wonRight(p, d)) {
    return;
  } else if (pushRight(p, d)) {
    return;
  } else if (obj.dTurn === 1) {
    setTimeout(dealersHit(), 1000);
  }
}
function checkFinishLeft(p, d) {
  if (lostLeft(p, d)) {
    return;
  } else if (checkBlackjackLeft(p, d)) {
    return;
  } else if (wonLeft(p, d)) {
    return;
  } else if (pushLeft(p, d)) {
    return;
  } else if (obj.dTurn === 1) {
    setTimeout(dealersHit(), 1000);
  }
}
function checkEndPlayerRight() {
  setTimeout(function () {
    checkFinishRight(obj.playersTotal, obj.dealersTotal);
  }, 500);
}
function checkEndPlayerLeft() {
  if (obj.playerTotal > 21) {
    setTimeout(function () {
      checkFinishLeft(obj.playersSplitTotal, obj.dealersTotal);
    }, 500);
  } else {
    checkFinishLeft(obj.playersSplitTotal, obj.dealersTotal)
  }
}
function playerRightHasEqualOrOver21() {
  //If player has 21, automatically stand
  if (obj.playersTotal === 21) {
    stand();
    return true;
  }
}
function playerLeftHasEqualOrOver21() {
  //If player has over 21, automatically stand
  if (obj.playersSplitTotal >= 21) {
    stand();
    return true;
  }
}
//? FINISH OPTIONS---------------------------------------------------------------------------------------------------------
function lostRight(p, d) {
  if (checkLostCondition(p, d)) {
    if (obj.endRight === 0) {
      splitRightLoss()
      obj.dTurn = 1;
    }
    if (obj.split === 2) {
      checkEndPlayerLeft()
    }
    saveLocalHighScore(playerText.innerHTML, score.innerText);
    removeAllPlayButtons()
    restartButton.classList.add("show");
    return true;
  }
}
function lostLeft(p, d) {
  if (checkLostCondition(p, d)) {
    splitLeftLoss()
    saveLocalHighScore(playerText.innerHTML, score.innerText);
    return true;
  }
}
function checkBlackjackRight(p, d) {
  if (checkBlackjackRightCondition(p, d)) {
    if (obj.endRight === 0) {
      splitRightBlackjack()
    }
    if (obj.split === 2) {
      checkEndPlayerLeft()
    }
    saveLocalHighScore(playerText.innerHTML, score.innerText);
    removeAllPlayButtons()
    restartButton.classList.add("show");
    return true;
  }
}
function checkBlackjackLeft(p, d) {
  if (checkBlackjackLeftCondition(p, d)) {
    splitLeftBlackjack()
    saveLocalHighScore(playerText.innerHTML, score.innerText);
    return true;
  }
}
function wonRight(p, d) {
  // If dealer busts || player > dealer with 17+ || player > dealer with ace and 18+
  if (checkWinCondition(p, d)) {
    if (obj.endRight === 0) {
      splitRightWin()
    }
    if (obj.split === 2) {
      checkEndPlayerLeft()
    }
    saveLocalHighScore(playerText.innerHTML, score.innerText);
    removeAllPlayButtons()
    restartButton.classList.add("show");
    return true;
  }
}
function wonLeft(p, d) {
  // If dealer busts || player > dealer with 17+ || player > dealer with ace and 18+
  if (checkWinCondition(p, d)) {
    splitLeftWin()
    restartButton.classList.add("show");
    saveLocalHighScore(playerText.innerHTML, score.innerText);
    return true;
  }
}
function pushRight(p, d) {
  // If dealer with 17+ ties player || dealer with ace and 18+ ties player
  if (checkPushCondition(p, d)) {
    if (obj.endRight === 0) {
      splitRightPush()
    }
    if (obj.split === 2) {
      checkEndPlayerLeft()
    }
    saveLocalHighScore(playerText.innerHTML, score.innerText);
    removeAllPlayButtons()
    restartButton.classList.add("show");
    return true;
  }
}
function pushLeft(p, d) {
  // If dealer with 17+ ties player || dealer with ace and 18+ ties player
  if (checkPushCondition(p, d)) {
    splitLeftPush()
    saveLocalHighScore(playerText.innerHTML, score.innerText);
    return true;
  }
}
//? CHECK FINISH CONDITIONS------------------------------------------------------------------------------------------------
function checkLostCondition(p, d) {
  //If Player is Bust
  if (p > 21) {
    return true;
  } 
  //If Dealers Turn:
  else if (obj.dTurn === 1) {
    //If Dealer is not bust:
    if (d <= 21 && d > p && d > 16) {
      //If Dealer is more than player:
      if (d > p) {
        //If Dealer is more than 16 without +10:
        if (d > 16) {
          return true;
        }
      }
    } 
    //If Dealer has Ace:
    else if (obj.aceD === 1) {
      //If Dealer with Ace is not bust:
      if (d + 10 <= 21) {
        //If Dealer with Ace is more than Player:
        if (d + 10 > p) {
          //If Dealer with Ace is more than 17
          if (d + 10 > 17) {
            updateDealerTotalWithAce()
            return true;
          }
        }
      }
    }
  }
  return false;
}
function checkBlackjackRightCondition(p, d) {
  //If Player has 21
  if (p === 21){
    //If Players hand has exactly 2 cards
    if (obj.playersCards.length === 2) {
      //If Dealer has more than 16
      if (d > 16) {
        //If Dealer does not have 21
        if (d !== p) {
          return true;
        }
      }
      //If Dealer has an Ace
      else if (obj.aceD !== 0) {
        //If Dealer with Ace has more than 17
        if (d + 10 > 17) {
          //If Dealer with Ace does not have 21
          if (d + 10 < 21) {
            updateDealerTotalWithAce()
            return true;
          }
        }
      }
    }
  }
  return false;
}
function checkBlackjackLeftCondition(p, d) {
  //If Player has 21
  if (p === 21){
    //If Players hand has exactly 2 cards
    if (obj.playersSplitCards.length === 2) {
      //If Dealer has more than 16
      if (d > 16) {
        //If Dealer does not have 21
        if (d !== p) {
          return true;
        }
      }
      //If Dealer has an Ace
      else if (obj.aceD !== 0) {
        //If Dealer with Ace has more than 17
        if (d + 10 > 17) {
          //If Dealer with Ace does not have 21
          if (d + 10 < 21) {
            updateDealerTotalWithAce()
            return true;
          }
        }
      }
    }
  }
  return false;
}
function checkWinCondition(p, d) {
  //If Dealer Busts
  if (d > 21) {
    return true;
  }
  //If Dealer is over 16:
  else if (d > 16) {
    //If Dealer has less than Player:
    if (p > d) {
      return true;
    }
  }
  //If Dealer has Ace:
  else if (obj.aceD !== 0) {
    //If Dealer has more than 17
    if (d + 10 > 17) {
      //If Dealer with Ace is less than Player:
      if (d + 10 < p) {
        updateDealerTotalWithAce()
        return true;
      }
    }
  }
  return false;
}
function checkPushCondition(p, d) {
  //If Dealer is tied with Player
  if (d === p) {
    //If Dealer has more than 16
    if (d > 16) {
      return true;
    }
    
  }
  //If Dealer (with ace) is tied with Player
  else if (d + 10 === p) {
    //If Dealer has an Ace
    if (obj.aceD !== 0) {
      //If Dealer with ace is more than 17
      if (d + 10 > 17) {
      updateDealerTotalWithAce()
      return true;
      }
    }
  }
  return false;
}
//? END GAME BET WINNING AND TEXT UPDATES----------------------------------------------------------------------------------
function splitRightLoss() {
  console.log('RightLoss: '+score.innerText)
  scoreRight.innerText = obj.playersTotal;
  resultRight.innerText = "Lost!";
  betRight.innerText = "+" + 0;
  console.log('RightLoss: '+score.innerText)
  obj.endRight = 1;
}
function splitRightBlackjack() {
  console.log('RightBJ: '+score.innerText)
  resultRight.innerText = "Blackjack!";
  let betTotal = obj.betRight + (3 / 2) * obj.betRight;
  score.innerText = +score.innerText + betTotal;
  betRight.innerText = "+" + betTotal;
  console.log('RightBJ: '+score.innerText)
  obj.endRight = 1;
}
function splitRightWin() {
  console.log('RightWin: '+score.innerText)
  scoreRight.innerText = obj.playersTotal;
  resultRight.innerText = "Won!";
  let betTotal = obj.betRight * 2;
  score.innerText = +score.innerText + betTotal;
  betRight.innerText = "+" + betTotal;
  console.log('RightWin: '+score.innerText)
  obj.endRight = 1;
}
function splitRightPush() {
  console.log('RightPush: '+score.innerText)
  resultRight.innerText = "Push!";
  score.innerText = +score.innerText + obj.betRight;
  betRight.innerText = "+" + obj.betRight;
  console.log('RightPush: '+score.innerText)
  obj.endRight = 1;
}
function splitLeftLoss() {
  console.log('LeftLoss: '+score.innerText)
  scoreLeft.innerText = obj.playersSplitTotal;
  resultLeft.innerText = "Lost!";
  betLeft.innerText = "+" + 0;
  console.log('LeftLoss: '+score.innerText)
}
function splitLeftBlackjack() {
  console.log('LeftBJ: '+score.innerText)
  resultLeft.innerText = "Blackjack!";
  let betTotal = obj.betLeft + (3 / 2) * obj.betLeft;
  score.innerText = +score.innerText + betTotal;
  betLeft.innerText = "+" + betTotal;
  console.log('LeftBJ: '+score.innerText)
}
function splitLeftWin() {
  console.log('LeftWin: '+score.innerText)
  scoreLeft.innerText = obj.playersSplitTotal;
  resultLeft.innerText = "Won!";
  let betTotal = obj.betLeft * 2;
  score.innerText = +score.innerText + betTotal;
  betLeft.innerText = "+" + betTotal;
  console.log('LeftWin: '+score.innerText)
}
function splitLeftPush() {
  console.log('LeftPush: '+score.innerText)
  resultLeft.innerText = "Push!";
  score.innerText = +score.innerText + obj.betLeft;
  betLeft.innerText = "+" + obj.betLeft;
  console.log('LeftPush: '+score.innerText)
}
