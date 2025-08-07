const boatSideText = document.getElementById('boatSideText');

let startTime = null;
let timerInterval = null;
function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const timerDisplay = document.getElementById('timer');
timerDisplay.textContent = `Time: ${elapsed} sec`;

  }, 1000);
}


  // Game state variables
  let goodLeft = 0;
  let badLeft = 0;
  let goodRight = 3;
  let badRight = 3;
  let boatOnRight = true; // boat starts on right bank

  // What people are currently on the boat
  let boatGood = 0;
  let boatBad = 0;

  // DOM elements
  // const goodLeftSpan = document.getElementById('goodLeft');
  // const badLeftSpan = document.getElementById('badLeft');
  // const goodRightSpan = document.getElementById('goodRight');
  // const badRightSpan = document.getElementById('badRight');
  // const boatSideText = document.getElementById('boatSideText');

  
  const messageDiv = document.getElementById('message');

  const boatDiv = document.getElementById('boat');
  const boatCharactersDiv = document.getElementById('boatCharacters');
  const leftCharactersDiv = document.getElementById('leftCharacters');
  const rightCharactersDiv = document.getElementById('rightCharacters');

  function createCharacter(type) {
    const el = document.createElement('div');
    el.classList.add('character');
    if (type === 'good') el.classList.add('missionary');
    else el.classList.add('cannibal');
    // el.textContent = type === 'good' ? 'M' : 'C';
    el.setAttribute('data-type', type);

  const img = document.createElement('img');
  img.src = type === 'good' ? '/static/images/missionary.png' : '/static/images/cannibal.png';
  img.alt = type === 'good' ? 'Missionary' : 'Cannibal';
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.borderRadius = '50%';
      el.appendChild(img);

    return el;
  }

  // Update characters shown on banks and boat
  function updateDisplay() {
    // goodLeftSpan.textContent = goodLeft;
    // badLeftSpan.textContent = badLeft;
    // goodRightSpan.textContent = goodRight;
    // badRightSpan.textContent = badRight;
    boatSideText.textContent = boatOnRight ? 'RIGHT' : 'LEFT';

    // Clear containers
    leftCharactersDiv.innerHTML = '';
    rightCharactersDiv.innerHTML = '';
    boatCharactersDiv.innerHTML = '';
    messageDiv.textContent = '';

    // Add bank characters who are NOT on boat
    const boatLocationGood = boatOnRight ? goodRight : goodLeft;
    const boatLocationBad = boatOnRight ? badRight : badLeft;
  
    // Calculate how many available on current bank excluding those in boat
    const availableGood = boatLocationGood - boatGood;
    const availableBad = boatLocationBad - boatBad;

    if (boatOnRight) {
      for (let i = 0; i < availableGood; i++) {
        const mc = createCharacter('good');
        mc.addEventListener('click', () => selectCharacter('good'));
        rightCharactersDiv.appendChild(mc);
      }
      for (let i = 0; i < availableBad; i++) {
        const cc = createCharacter('bad');
        cc.addEventListener('click', () => selectCharacter('bad'));
        rightCharactersDiv.appendChild(cc);
      }

      // Left bank shows all (all already there)
      for (let i = 0; i < goodLeft; i++) {
        const mc = createCharacter('good');
        leftCharactersDiv.appendChild(mc);
      }
      for (let i = 0; i < badLeft; i++) {
        const cc = createCharacter('bad');
        leftCharactersDiv.appendChild(cc);
      }
    } else {
      // Boat on left
      for (let i = 0; i < availableGood; i++) {
        const mc = createCharacter('good');
        mc.addEventListener('click', () => selectCharacter('good'));
        leftCharactersDiv.appendChild(mc);
      }

      for (let i = 0; i < availableBad; i++) {
        const cc = createCharacter('bad');
        cc.addEventListener('click', () => selectCharacter('bad'));
        leftCharactersDiv.appendChild(cc);
      }
      // Right bank counts all (no boat characters here)
      for (let i = 0; i < goodRight; i++) {
        const mc = createCharacter('good');
        rightCharactersDiv.appendChild(mc);
      }
      for (let i = 0; i < badRight; i++) {
        const cc = createCharacter('bad');
        rightCharactersDiv.appendChild(cc);
      }
    }

    // Add characters onboard boat with highlight
    for (let i = 0; i < boatGood; i++) {
      const mc = createCharacter('good');
      mc.classList.add('in-boat');
      // Clicking character in boat removes them
      mc.addEventListener('click', (e) => {
           e.stopPropagation();
           deselectCharacter('good')});
      boatCharactersDiv.appendChild(mc);
    }

    for (let i = 0; i < boatBad; i++) {
      const cc = createCharacter('bad');
      cc.classList.add('in-boat');
      cc.addEventListener('click', (e) => {
         e.stopPropagation();
         deselectCharacter('bad')});
      boatCharactersDiv.appendChild(cc);
    }

    // Position boat left or right
    if (boatOnRight) {
      boatDiv.classList.remove('left');
      boatDiv.classList.add('right');
    } else {
      boatDiv.classList.remove('right');
      boatDiv.classList.add('left');
    }
    console.log("Display e-Rendered!");


    
  }

  // Select character to board boat
  function selectCharacter(type) {
    const totalOnBoat = boatGood + boatBad;
    if (totalOnBoat >= 2) {
      messageDiv.textContent = 'Boat capacity is max 2!';
      return;
    }
    // Check availability on current bank
    if (boatOnRight) {
      if (type === 'good' && boatGood >= goodRight) {
        messageDiv.textContent = 'No more missionaries available on right bank.';
        return;
      }
      if (type === 'bad' && boatBad >= badRight) {
        messageDiv.textContent = 'No more cannibals available on right bank.';
        return;
      }
    } else {
      if (type === 'good' && boatGood >= goodLeft) {
        messageDiv.textContent = 'No more missionaries available on left bank.';
        return;
      }
      if (type === 'bad' && boatBad >= badLeft) {
        messageDiv.textContent = 'No more cannibals available on left bank.';
        return;
      }
    }

    // Add character to boat if available on bank
    // But in updateDisplay, we subtract those on boat from the bank to show availability, so no double-check here needed

    if (type === 'good') boatGood++;
    else if (type === 'bad') boatBad++;

    messageDiv.textContent = '';
    updateDisplay();
  }

  // Remove character from boat back to bank
  function deselectCharacter(type) {
    if (type === 'good' && boatGood > 0) boatGood--;
    else if (type === 'bad' && boatBad > 0) boatBad--;
    messageDiv.textContent = '';
    updateDisplay();
  }

function checkGameOver() {
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);

  //Win condition
  if (goodLeft === 3 && badLeft === 3) {
    clearInterval(timerInterval);
    messageDiv.style.color = 'green';
    messageDiv.textContent = 'You WON!';
    const playerName = prompt("You won! Enter your name:");

    if (playerName) {
      fetch('/gameover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          result: 'win',
          name: playerName,
          time: elapsedTime
        })
      });
    }

    return true;
  }

  // Loss condition on left bank
  if (goodLeft > 0 && badLeft > goodLeft) {
    clearInterval(timerInterval);
    messageDiv.style.color = '#c12e2e';
    messageDiv.textContent = ' Cannibals ate the Missionaries on LEFT bank!';
    const playerName = prompt(" You lost! Enter your name:");

    if (playerName) {
      fetch('/gameover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          result: 'lose',
          name: playerName,
          time: elapsedTime
        })
      });
    }

    return true;
  }

  // Loss condition on right bank
  if (goodRight > 0 && badRight > goodRight) {
    clearInterval(timerInterval);
    messageDiv.style.color = '#c12e2e';
    messageDiv.textContent = ' Cannibals ate the Missionaries on RIGHT bank!';
    const playerName = prompt("You lost! Enter your name:");

    if (playerName) {
      fetch('/gameover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          result: 'lose',
          name: playerName,
          time: elapsedTime
        })
      });
    }

    return true;
  }

  return false;
}



  function animateBoatCrossing() {
    return new Promise(resolve => {
      // Boat moves to other side visually by toggling class
      if (boatOnRight) {
        boatDiv.classList.remove('right');
        boatDiv.classList.add('left');
      } else {
        boatDiv.classList.remove('left');
        boatDiv.classList.add('right');
      }

      setTimeout(() => {
        resolve();
      }, 1500); // match CSS transition duration
    });
  }

  // Clicking the boat moves it with whatever characters onboard
  boatDiv.addEventListener('click', async () => {
    if (!startTime) startTimer(); // Start timer on first boat click
    if (boatGood + boatBad === 0) {
      messageDiv.textContent = 'Boat must carry at least one person!';
      // console.log("I am Boat");
      
      return;
    }
  
    // Validate availability: The boat characters can't exceed people on the current bank
    const bankGood = boatOnRight ? goodRight : goodLeft;
    const bankBad = boatOnRight ? badRight : badLeft;

    // if (boatGood > bankGood || boatBad > bankBad) {
    //   messageDiv.textContent = 'Invalid selection: not enough people on the bank!';
    //   return;
    // }

    // messageDiv.textContent = '';
    boatDiv.style.pointerEvents = 'none'; // disable clicks during animation

    await animateBoatCrossing();
    
    // Update game state after crossing
    if (boatOnRight) {
      goodRight -= boatGood;
      badRight -= boatBad;
      goodLeft += boatGood;
      badLeft += boatBad;
    } else {
      goodRight += boatGood;
      badRight += boatBad;
      goodLeft -= boatGood;
      badLeft -= boatBad;
    }
    
    boatOnRight = !boatOnRight;
  
    // Boat is now empty after move
    boatGood = 0;
    boatBad = 0;

    updateDisplay();

    if (checkGameOver()) {
      // Disable further boat moves by disabling click on boat
      boatDiv.style.pointerEvents = 'none';
    } else {
      boatDiv.style.pointerEvents = 'auto';
    }
  });

  // Initialize game
  updateDisplay();
// console.log("Iam");
