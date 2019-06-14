var url = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'; 
//var players = [[], []]; 
var p1 = document.querySelector("#player1 .hand");
var p2 = document.querySelector("#player2 .hand"); 
var s1 = document.querySelector("#player1 .score"); 
var s2 = document.querySelector("#player2 .score"); 

var fightButton = document.querySelector("#btnBattle"); 

var firstRun = true; 
var gameover = false; 
var players;
var player1; 
var player2;
var warTime = false;
//var pot = [];
//var card1;
//var card2;

//event listners
fightButton.addEventListener('click', battle); 

function outputMessage(message){
  document.getElementById("message").innerHTML = message; 
}

fetch(url, { method: 'get' })
  .then(function (response) {
    //pass the data as promise to next then block
    return response.json();
  })
  .then(function (data) {
    var deck_id = data.deck_id;
    //make a 2nd request and return a promise
    return fetch('https://deckofcardsapi.com/api/deck/' + deck_id + '/draw/?count=52');
  })
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
  //2nd request result



  // Data is not a global variable, it is here, passed to the .then callback
  // and it comes from here, from the response.json(), which is the response from deckofcardsapi.com/api
  // Then you just have to use "dealCards" function to create the decks for each player

  var cards = shuffle(data.cards);
  players = dealCards(cards);

  //console.log(players);
});

//deal cards to players. 
function dealCards(cards) {
  var players = [[], []];

  for (var i = 0; i < cards.length; i++) {
    players[i % 2].push(cards[i]);
  }

  return players;
}
//shuffle the cards returned by API 
function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

//initial function to start the batle between two players
function battle(){
  if (firstRun){
    firstRun = false; 
    console.log("first battle"); 
  }
  attack();
  warTime = false; 
}


function attack() {
  if(!gameover) {
    if(warTime) {
      console.log("i am in warTime chaning image"); 
      document.body.style.backgroundImage = "url('img/camoback.png')";
    }
    //This code splits our mult-dimensional array into two single arrays. 
    player1 = player1 ? player1 : players[0];
    player2 = player2 ? player2 : players[1];

    //{} these brackets add labels to your console log values. useful when debugging. 
    //console.log({ player1, player2 });
   

    var card1 = player1[0];
    var card2 = player2[0];

    var pot = [card1, card2];
    //the ${card.image} is called templating and it's how you add variable values to html
    p1.innerHTML = `<img src="${card1.image}" class="player11-card" />`; 
    p2.innerHTML = `<img src="${card2.image}" class="player21-card" />`; 
    checkWinner(card1,card2,pot);
    s1.innerHTML = player1.length; 
    s2.innerHTML = player2.length;  

  } else {
    outputMessage("Game over"); 
  }
}

var valuePoint ={
"2": 2,
"3": 3,
"4": 4,
"5": 5,
"6": 6,
"7": 7,
"8": 8,
"9": 9,
"10": 10,
"JACK": 11,
"QUEEN": 12,
"KING": 13,
"ACE": 14,
}
// input parameters are the data needed to run the function
function checkWinner(card1,card2,pot){

  if ((player1.length <= 4) || (player2.length <= 4)){
    gameover = true; 
    return; 
  }

  var card1Point = valuePoint[card1.value];
  var card2Point = valuePoint[card2.value];

  if(card1Point > card2Point){
      if (pot.length === 8) {
        player1.splice(0,4);
        player2.splice(0,4);
      }

      if (pot.length === 2) {
        player1.shift();
        player2.shift();
      }
      //using spread operator to push two arrays into a variable(player1)
        player1 = [ ...player1, ...pot]
        outputMessage('Player 1 wins');
    }
      else if(card1Point < card2Point) {
        if (pot.length === 8) {
          player1.splice(0,4);
          player2.splice(0,4);
      }
        if (pot.length === 2) {
          player1.shift()
          player2.shift()
        }

        player2 = [ ...player2, ...pot]
        outputMessage("Player 2 wins");

  } else {
    outputMessage("I declare war");
    war(pot);
  }
}

function war(pot){
  warTime = true;
  document.body.style.backgroundImage = "url('img/bomb.gif')";
  console.log("Starting War");
  if ((player1.length < 4) || (player2.length < 4)) {
    return;
  }else {
    var player1Pot = player1.slice(0,4);
    var player2Pot = player2.slice(0,4);

    for(var i=1; i<4;i++){
      p1.innerHTML += `<img src="${player1Pot[i].image}" class="player1-card" style="z-index: ${i}; left: ${40*i}px"/>`;
      p2.innerHTML += `<img src="${player2Pot[i].image}" class="player1-card" style="z-index: ${i}; left: ${40*i}px"/>`;
  } 

  checkWinner(player1Pot[3], player2Pot[3], [...player1Pot, ...player2Pot]);

  }
}

function resetGame(){
  location.reload()
}
