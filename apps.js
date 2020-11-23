// const for every card (52) or const values (13) and const suits (4)
//? IMAGE LINKS---------------------------------------------------------
const dealersCardLeftImage = document.getElementById("dealers-card-left-image");
const dealersCardRightImage = document.getElementById(
  "dealers-card-right-image"
);
const playersCardLeftImage = document.getElementById("players-card-left-image");
const playersCardRightImage = document.getElementById(
  "players-card-right-image"
);
const playersHand = document.getElementById("players-hand");
const dealersHand = document.getElementById("dealers-hand");

//? HTML GRABS -----------------------------------------------------------
const playerText = document.getElementById("playersText");
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
const pot = document.getElementById("potValue");
const gapP = document.getElementById("gapP");



//? BUTTON LINKS-----------------------------------------------------------
const dealersText = document.getElementById("dealersText");
const restartButton = document.getElementById("restartButton");
const hitButton = document.getElementById("hitButton");
const standButton = document.getElementById("standButton");
const betButton = document.getElementById("betButton");
const splitButton = document.getElementById("splitButton");
const bet50Button = document.getElementById("bet50Button");
const bet100Button = document.getElementById("bet100Button");
const bet200Button = document.getElementById("bet200Button");
const doubleDownButton = document.getElementById("doubleDownButton");
//? EVENT LISTENERS--------------------------------------------------------
restartButton.addEventListener("click", loadGame);
hitButton.addEventListener("click", hit);
standButton.addEventListener("click", stand);
betButton.addEventListener("click", deal);
//splitButton.addEventListener("click", split);
bet50Button.addEventListener("click", bet50);
bet100Button.addEventListener("click", bet100);
bet200Button.addEventListener("click", bet200);
doubleDownButton.addEventListener("click", doubleDown);
//? GLOBAL OBJECT--------------------------------------------------------
let obj = {
  currentCards: [],
  playersCards: [],
  dealersCards: []
};
//? LOAD GAME
loadGame();
//? FUNCTIONS
function sleep(miliseconds) {
  var currentTime = new Date().getTime();

  while (currentTime + miliseconds >= new Date().getTime()) {
  }
}

function saveLocalHighScore(playerName, playerScore) {
  if (localStorage.getItem("High Scores") === null) {
    obj.highScores = [];
  } else {
    obj.highScores = JSON.parse(localStorage.getItem("High Scores"));
  }
  if (removeLowerHighScore(playerName, playerScore)) {
    //obj.highScores.push({'playerName': playerName, 'highScore': +playerScore})
    obj.highScores.push((playerName + ": " + playerScore))
    localStorage.setItem("High Scores", JSON.stringify(obj.highScores));
  }
}

function removeLowerHighScore(playerName, playerScore) {
  //If Player has a high score in the array
  let playerInLocalStorage = obj.highScores.find(highScore =>highScore.includes(playerName));
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





//? LOAD AND START GAME--------------------------------------------------------
function loadGame() {
  //localStorage.clear()
  resetVariables()
  resetText();
  addBetButtons();
  removeAllPlayButtons()
  //gapP.classList.remove("show");
  restartButton.classList.remove("show");
  setBetButton(true)
  setScore();
  resetCards();
  setTimeout(getSetPlayerName,100);
}
function getSetPlayerName() {
  if (playerText.innerHTML === "") {
    let playerName = prompt("Enter your 3 initials","");
    playerName = playerName.substr(0, 3);
    if (playerName !== null) {
      playerText.innerHTML = playerName;
    }
  }
}
function deal() {
  addAllPlayButtons();
  addBackOfCard()
  setPot()
  subtractBetFromScore()
  removeBetButtons()
  startCards("players", "left");
  startCards("dealers", "left");
  startCards("players", "right");
  //checkForSplit()
  if(startCards("dealers", "right")) {
    return;
  }
  playerHas21();
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
    //insurance();
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
      checkFinish(obj.playersTotal, obj.dealersTotal);
      return true;
    }
  }
}
function checkForSplit() {
  let x = obj.playersCards[0].slice(0, -1);
  let y = obj.playersCards[1].slice(0, -1);
  if (x === y) {
    splitButton.classList.add("show");
  }
}
//? RESET ALL VARIABLES/TEXTS------------------------------------------------
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
    x[i].src = "/png/back.png";
  }
}
function resetText() {
  dealersText.dataset.value = "";
  scoreRight.innerText = "";
  resultRight.innerText = "";
  betRight.innerText = "";
  pot.innerText = "";
}
function resetVariables() {
  obj.currentCards = [];
  obj.playersCards = [];
  obj.dealersCards = [];
  obj.playersTotal = 0;
  obj.dealersTotal = 0;
  obj.aceD = 0;
  obj.dTurn = 0;
  obj.gameEnd = 0;
}
//? BETS/POT-------------------------------------------------------------------
function bet50() {
  betRight.innerText = 50;
  obj.bet = 50;
  setBetButton(false);
}
function bet100() {
  betRight.innerText = 100;
  obj.bet = 100;
  setBetButton(false);
}
function bet200() {
  betRight.innerText = 200;
  obj.bet = 200;
  setBetButton(false);
}
function setBetButton(x) {
  //Disables bet button until a bet is chosen
  betButton.disabled = x;
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
  betRight.innerText = "";
}
function subtractBetFromScore() {
  score.innerText -= obj.bet;
}
//function doubleBet() {
 // betRight.innerText = +betRight.innerText * 2;
//}
function setPot() {
  pot.innerText = obj.bet;
}
function addDoubleDownToPot() {
  pot.innerText = +pot.innerText + obj.bet;
}
//? HIT/STAND/ETC-------------------------------------------------------------
function hit() {
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
  buttonDelay();
  if(playerHas21()) {
    return;
  }
  checkEndPlayerRight();
}
function stand() {
  removeAllPlayButtons()
  removeBackOfCard()
  obj.dTurn = 1;
  AddFacedownCardToTotal()
  checkForAce(obj.playersCards, "players");
  checkEndPlayerRight();
}
function doubleDown() {
  subtractBetFromScore();
  //doubleBet();
  addDoubleDownToPot();
  removeAllPlayButtons();
  hit();
  if (obj.playersTotal < 21) {
    setTimeout(stand, 500)
  }
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
function AddFacedownCardToTotal() {
  //Adds value of Dealers facedown card to total, checking for ace
  obj.newCardValue = obj.dealersCards[0].slice(0, -1);
  setCardValue(obj.newCardValue, "dealers");
  checkForAce(obj.dealersCards, "dealers");
}
//? CREATE PLAYERS NEW CARDS----------------------------------------------------
function createPlayersNewCardDivHTML() {
  obj.playersNewCardDivHTML = document.createElement("div");
  obj.playersNewCardDivHTML.classList.add("card", "newCard");
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
//? CREATE DEALERS NEW CARDS----------------------------------------------------
function createDealersNewCardDivHTML() {
  obj.dealersNewCard = document.createElement("div");
  obj.dealersNewCard.classList.add("card", "newCard");
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
//? GET AND SET RANDOM CARDS----------------------------------------------------
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
  return "/png/" + newCard + ".png" 
}
//? GET AND SET CARD VALUES-----------------------------------------------------
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
//? CHECK/UPDATE TOTALS---------------------------------------------------------
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
//? BUTTON: SHOW/HIDE/REMOVE/ETC------------------------------------------------
function buttonDelay() {
  standButton.disabled = true;
  hitButton.disabled = true;
  doubleDownButton.disabled = true;
  setTimeout(() => {
    standButton.disabled = false;
    hitButton.disabled = false;
    doubleDownButton.disabled = false;
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
  //splitButton.classList.add("show");
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
//? CHECK FINISHES--------------------------------------------------------------
function checkFinish(p, d) {
  if (lost(p, d)) {
    return;
  } else if (checkBlackjack(p, d)) {
    return;
  } else if (won(p, d)) {
    return;
  } else if (push(p, d)) {
    return;
  } else if (obj.dTurn === 1) {
    setTimeout(dealersHit(), 1000);
  }
}
function checkEndPlayerRight() {
  setTimeout(function () {
    checkFinish(obj.playersTotal, obj.dealersTotal);
  }, 500);
}
function playerHas21() {
  if (obj.playersTotal === 21) {
    stand();
    return true;
  }
}
//? FINISH OPTIONS--------------------------------------------------------------
function lost(p, d) {
  if (checkLostCondition(p, d)) {
    splitRightLoss()
    restartButton.classList.add("show");
    saveLocalHighScore(playerText.innerHTML, score.innerText);
    return true;
  }
}
function checkBlackjack(p, d) {
  if (checkBlackjackCondition(p, d)) {
    splitRightBlackjack()
    restartButton.classList.add("show");
    saveLocalHighScore(playerText.innerHTML, score.innerText);
    return true;
  }
}
function won(p, d) {
  // If dealer busts || player > dealer with 17+ || player > dealer with ace and 18+
  if (checkWinCondition(p, d)) {
    splitRightWin()
    restartButton.classList.add("show");
    saveLocalHighScore(playerText.innerHTML, score.innerText);
    return true;
  }
}
function push(p, d) {
  // If dealer with 17+ ties player || dealer with ace and 18+ ties player
  if (checkPushCondition(p, d)) {
    splitRightPush()
    restartButton.classList.add("show");
    saveLocalHighScore(playerText.innerHTML, score.innerText);
    return true;
  }
}
//? CHECK FINISH CONDITIONS-----------------------------------------------------
function checkLostCondition(p, d) {
  //If Player is Bust
  if (p > 21) {
    return true;
  } 
  //If Dealers Turn:
  else if (obj.dTurn === 1) {
    //If Dealer is not bust and has more than Player:
    if (d > p && d <= 21) {
      return true;
    } 
    //If Dealer has Ace:
    else if (obj.aceD !== 0) {
      //If Dealer with Ace is not bust:
      if (d + 10 <= 21) {
        //If Dealer with Ace is more than Player:
        if (d + 10 > p) {
          updateDealerTotalWithAce()
          return true;
        }
      }
    }
  }
  return false;
}
function checkBlackjackCondition(p, d) {
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
//? END GAME BET WINNING AND TEXT UPDATES
function splitRightLoss() {
  scoreRight.innerText = obj.playersTotal;
  resultRight.innerText = "Lost!";
  betRight.innerText = "+" + 0;
}
function splitRightBlackjack() {
  resultRight.innerText = "Blackjack!";
  let betTotal = obj.bet + (3 / 2) * obj.bet;
  score.innerText = +score.innerText + betTotal;
  betRight.innerText = "+" + betTotal;
}
function splitRightWin() {
  scoreRight.innerText = obj.playersTotal;
  resultRight.innerText = "Won!";
  let betTotal = obj.bet * 2;
  score.innerText = +score.innerText + betTotal;
  betRight.innerText = "+" + betTotal;
}
function splitRightPush() {
  resultRight.innerText = "Push!";
  score.innerText = +score.innerText + obj.bet;
  betRight.innerText = "+" + obj.bet;
}