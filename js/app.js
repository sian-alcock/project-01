document.addEventListener('DOMContentLoaded', () => {

  const player1Grid = document.querySelector('.player1Grid')
  const player2Grid = document.querySelector('.player2Grid')
  const changeCropsSpace = document.querySelector('.rePlant')
  const changeCrops = document.querySelector('#changeCrops')
  const readyToPlay = document.querySelector('#readyToPlay')
  const startBtn = document.querySelector('#start')
  const resetBtn = document.querySelector('#reset')
  const scoreBoardPlayer1Images = Array.from(document.querySelectorAll('.scoreBoardPlayer1 img'))
  const scoreBoardPlayer2Images = Array.from(document.querySelectorAll('.scoreBoardPlayer2 img'))
  const billBoard = document.querySelector('.billBoard')
  const gameOverText = document.querySelector('.gameOver')
  const player1Space = document.querySelector('.player1Space')
  const player2Space = document.querySelector('.player2Space')
  const startBoard = document.querySelector('.startBoard')
  const video = document.querySelector('video')
  const startBoardText = document.querySelector('.startBoard p')
  const gameArea = document.querySelector('.game')
  const body = document.querySelector('body')
  const header = document.querySelector('header')


  const missSound = new Audio('sounds/miss.wav')
  const hitSound = new Audio('sounds/hit.wav')
  const music = new Audio('sounds/background-music.mp3')
  const gameOverSound = new Audio('sounds/applause.wav')

  let validHorizontalStartCells = []
  let validVerticalStartCells = []
  const crops = {
    'crop1-lime': 5,
    'crop2-peach': 4,
    'crop3-seedling': 3,
    'crop4-hot-pepper': 3,
    'crop5-carrot': 2
  }
  const gridWidth = 10
  let orientation = null
  let player2SelectedCells
  let goCount = 0
  let arrayHitsPlayer1 = []
  let arrayHitsPlayer2 = []
  let cropsDestroyedPlayer1 = {}
  let cropsDestroyedPlayer2 = {}
  const cropsArray = Object.keys(crops)

  //Create player grid(s)

  function createPlayerGrid (playerNumber, grid) {
  // Create a code of p1-grid and p2-grid to include in the data-id to distinguish between player1's grid and player2's grid
    const shortCode = `p${playerNumber}-grid`
    for(let i = 1; i <= (gridWidth * gridWidth); i++) {
      const gridDiv = document.createElement('div')
      grid.appendChild(gridDiv)
      gridDiv.setAttribute('class', 'empty')
      gridDiv.setAttribute('data-id', `${shortCode}-${i}`)
    }
  }

  createPlayerGrid(1, player1Grid)
  createPlayerGrid(2, player2Grid)

  function reset() {
    gameOverText.textContent = ''

    scoreBoardPlayer1Images.forEach(crop => crop.src=`images/${crop.className}-score.png`)
    scoreBoardPlayer2Images.forEach(crop => crop.src=`images/${crop.className}-score.png`)

    arrayHitsPlayer1 = []
    arrayHitsPlayer2 = []
    cropsDestroyedPlayer1 =[]
    cropsDestroyedPlayer2 =[]

    player1GridCells.forEach(cell => cell.className='empty')
    player2GridCells.forEach(cell => cell.className='empty')
    goCount = 0

    //Populate both grids and get the computer selections
    populateGrid(player1GridCells)
    // Check the grid - if overlaps, go again
    let gridCheck1 = player1GridCells.filter(cell => cell.classList.contains('planted')).length

    while(gridCheck1 !== 17) {
      player1GridCells.forEach(cell => cell.className='empty')
      populateGrid(player1GridCells)
      gridCheck1 = player1GridCells.filter(cell => cell.classList.contains('planted')).length
    }

    player2GridCells.forEach(cell => cell.className='empty')
    populateGrid(player2GridCells)
    // Check the grid - if overlaps, go again
    let gridCheck2 = player2GridCells.filter(cell => cell.classList.contains('planted')).length
    while(gridCheck2 !== 17) {
      player2GridCells.forEach(cell => cell.className='empty')
      populateGrid(player2GridCells)
      gridCheck2 = player2GridCells.filter(cell => cell.classList.contains('planted')).length

    }
    getPlayer2Selection()
    // getPlayer2Goes() //This will replace the above function once it is working
    // getPlayer2Goes()
    // console.log(player2Goes)
  }


  const player1GridCells = Array.from(document.querySelectorAll('.player1Grid div'))
  const player2GridCells = Array.from(document.querySelectorAll('.player2Grid div'))
  function playMusic() {
    music.play()
  }

  function start(){
    startBoardText.style.display = 'none'
    startBtn.style.display = 'none'
    video.style.width = '100%'
    video.style.height = '100%'
    video.play()
    setTimeout(goToChangeCrops, 7000)
    setTimeout(playMusic, 7000)
  }

  function goToChangeCrops() {
    player1Space.style.display = 'flex'
    changeCropsSpace.style.display = 'flex'
    // player1Space.style.order = 1
    // changeCropsSpace.style.order = 2
    startBoard.style.display = 'none'
    billBoard.style.display = 'none'
    body.style.backgroundImage = 'url(\'images/background.png\')'
    header.style.display = 'flex'
    gameArea.style.border = '1px solid grey'
    gameArea.style.boxShadow ='0px 3px 15px rgba(0,0,0,0.2)'
    gameArea.style.backgroundColor = 'white'
    reset()
  }

  function goToGame () {
    player2Space.style.display = 'flex'
    resetBtn.style.display = 'unset'
    changeCropsSpace.style.display = 'none'
  }

  function startAgain() {
    player1Space.style.display = 'flex'
    player2Space.style.display = 'flex'
    startBoard.style.display = 'none'
    billBoard.style.display = 'none'
    reset()
  }

  function setCropOrientation() {
  // use a random number between 0 and 1 to assign the orientation of the crop (ie vertical or horizontal) at random

    const randomNumber = Math.floor(Math.random()*2)
    if(randomNumber === 1){
      orientation = 'vertical'
    } else {
      orientation = 'horizontal'
    }
    return orientation
  }

  function getValidStartingCells(orientation, crop, cropLength, gridCells) {
    validHorizontalStartCells = []
    validVerticalStartCells = []
    gridCells.forEach((cell, i) => {
      if(orientation === 'horizontal') {
        // if the cells fall within the grid and are empty (ie do not contain the class of empty, then push into the validStartCells array)

        const checksArray = []

        //Check the current cell to make sure it is not 'planted'
        if(i % gridWidth <= cropLength && !gridCells[i].classList.contains('planted')) {
          checksArray.push(i)
        }

        //Check the adjacent cells to make sure they are on the grid and not already 'planted'
        let counter = 1
        while (counter < cropLength && i < gridCells.length-1) {
          if(!gridCells[i].classList.contains('planted')) {
            checksArray.push(i+counter)
          } else {
            console.log('some of these cells fall outside the grid')
          }
          counter++
        }
        if(checksArray.length === cropLength) {
          validHorizontalStartCells.push(cell)
          return validHorizontalStartCells
        }
      }

      if(orientation === 'vertical') {
        // if the cells fall within the grid and are empty (ie do not contain the class of empty, then push into the validStartCells array)

        const checksArray = []

        //Check the current cell to make sure it is not 'planted'
        if(i + (gridWidth*(cropLength-1)) <= 99 && !gridCells[i].classList.contains('planted')) {
          checksArray.push(i)
        }

        //Check the cells below to make sure they are on the grid and not already 'planted'
        let counter = 1

        while (counter < cropLength) {
          if((i+9+counter) + (gridWidth*(cropLength-1)) <= 99 && !gridCells[i+9+counter].classList.contains('planted')) {
            checksArray.push(i+9+counter)
          }
          counter++
        }
        if(checksArray.length === cropLength) {
          validVerticalStartCells.push(cell)
          return validVerticalStartCells
        }
      }
    }
    )
  }

  function populateGrid(gridCells) {

    for (const crop in crops) {
      // get crop length
      const cropLength = crops[crop]
      // set crop orientation
      const cropOrientation = setCropOrientation()
      // get valid cells
      getValidStartingCells(cropOrientation, crop, cropLength, gridCells)

      // choose a random cell in which to plant the plantCrops
      if(cropOrientation === 'horizontal') {
        const randomCellIndex = Math.floor(Math.random()*validHorizontalStartCells.length)
        const randomCellDataId = validHorizontalStartCells[randomCellIndex].getAttribute('data-id')
        plantCrops(cropOrientation, crop, cropLength, randomCellDataId, gridCells)

      }
      if(cropOrientation === 'vertical') {
        const randomCellIndex = Math.floor(Math.random()*validVerticalStartCells.length)
        const randomCellDataId = validVerticalStartCells[randomCellIndex].getAttribute('data-id')
        plantCrops(cropOrientation, crop, cropLength, randomCellDataId, gridCells)

      }
      // plant the crops!
    } // end of for loop

  } //end of function



  function plantCrops(orientation, crop, cropLength, randomCellDataId, gridCells) {
    const randomCellIndex = gridCells.findIndex(div => div.dataset.id === randomCellDataId)

    if(orientation === 'horizontal') {
      let i = 0
      while (i < cropLength) {
        gridCells[randomCellIndex+i].className = `planted ${crop}`
        i++
      }
    }
    if(orientation === 'vertical') {
      let i = 0
      while (i < cropLength) {
        gridCells[randomCellIndex+(i*gridWidth)].className = `planted ${crop}`
        i++
      }
    }
  }

  // **********************Play the Game ******************************

  function getPlayer2Selection () {
    // This function is run at setup - it contains the cells that the computer will select
    // For MVP - simply shuffle the cells into a random order by putting each element in object with random sort key, then sorting using the random key then unmap to get the original objects
    player2SelectedCells = player1GridCells
      .map((a) => ({sort: Math.random(), value: a}))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value)
    return player2SelectedCells
  }

  function playerHitRoutine (targetCell, player) {
    let arrayHits
    let cropsDestroyed
    let scoreBoardImages

    if(player === 'player1') {
      arrayHits = arrayHitsPlayer1
      cropsDestroyed = cropsDestroyedPlayer1
      scoreBoardImages = scoreBoardPlayer1Images
    } else if (player === 'player2'){
      arrayHits = arrayHitsPlayer2
      cropsDestroyed = cropsDestroyedPlayer2
      scoreBoardImages = scoreBoardPlayer2Images
    }
    targetCell.classList.add('hit')
    arrayHits.push(targetCell)
    // check the crop
    const classList = Array.from(targetCell.classList)
    const hitCrop = classList.filter(crop => cropsArray.includes(crop))
    console.log(hitCrop)
    // check to see if this crop type has been completely destroyed
    if(arrayHits.filter(cell => cell.classList.contains(hitCrop)).length === crops[hitCrop]) {
      cropsDestroyed[hitCrop] = true

      const targetScoreBoardImage = scoreBoardImages.filter(image => image.classList.contains(`${hitCrop}`))
      targetScoreBoardImage[0].setAttribute('src', `images/${hitCrop}-score-hit.png`)


    }
    // check to see if all crops have been destroyed (end of game!!)
    if(cropsArray.every(crop => cropsDestroyed[crop])) {
      if(player === 'player1'){
        gameOverText.textContent='GAME OVER!!!  You got all Farmer Giles\' crops!'
      } else {
        gameOverText.textContent='GAME OVER!!!  Farmer Giles was too quick for you.  Better luck next time!'
      }
      gameOverSound.play()
      billBoard.style.order = 1
      billBoard.style.display = 'unset'
      player1Space.style.display = 'none'
      player2Space.style.display = 'none'
    }

  }


  function userGo (e) {
    // check that player1 has not already clicked this cell
    if(!this.classList.contains('hit') && !this.classList.contains('miss')) {
      //hit loop starts here
      if(this.classList.contains('planted')) {
        hitSound.play()
        const targetCell = e.target
        console.log(targetCell)
        playerHitRoutine(targetCell, 'player1')
        computerGo(goCount)
        goCount++
      } else {
        this.classList.add('miss')
        missSound.play()
        computerGo(goCount)
        goCount++
      }
    } // don't do anything if the user has already clicked the cells
  }


  function computerGo (goCount) {
    console.log(player2SelectedCells)
    const targetCellIndex = player1GridCells.indexOf(player2SelectedCells[goCount])
    const targetCell = player1GridCells[targetCellIndex]
    if(!targetCell.classList.contains('planted')) {
      targetCell.classList.add('miss')
    } else {
      playerHitRoutine(targetCell, 'player2')
    }
  }

  // changeCrops.addEventListener('click', populateGrid.bind(player2GridCells))
  startBtn.addEventListener('click', start)
  resetBtn.addEventListener('click', startAgain)
  changeCrops.addEventListener('click', reset)
  readyToPlay.addEventListener('click', goToGame)

  player2GridCells.forEach(cell => cell.addEventListener('click', userGo))





  // ***************************ATTEMPT AT GETTING INTELLIGENT P2 GOES*******************
  let randomMode = true
  // let cycleMode = false
  let orientationMode = false
  let direction = 1 // 1 is up/right -1 is down/left
  const hitsIndexArray = []
  let adjacentCellArray = []
  let player2Goes = [] // This will replace the above variable if i get it working
  let lastGoIndex
  let triedBothDirections = false
  let goCell
  let lastHitIndex = null
  // let startingRandomHitIndex = null

  function getRandomCell () {
    // Filter player1GridCells to only those that haven't already been picked
    const remainingCells = player1GridCells.filter(cell => !player2Goes.includes(cell))
    // pick a cell at random from remaining cells and get its data Id
    const goCellDataId = remainingCells[Math.floor(Math.random()*(remainingCells.length))].getAttribute('data-id')
    // set goIndex to the matching data Id in player1GridCells
    const goIndex = player1GridCells.findIndex(div => div.dataset.id === goCellDataId)
    return goIndex
  }

  function getPlayer2Goes() {
    player2Goes = []
    randomMode = true
    for(let i = 0; i < gridWidth*gridWidth; i++) {
      randomMode()
    }
  }

  function handleRandomMode() {
    const goIndex = getRandomCell()
    while (goIndex === undefined) {
      getRandomCell()
    }
    goCell = player1GridCells[goIndex]
    player2Goes.push(goCell)
    // If the random selection gets a hit create array of adjacent cells and start cycleMode
    if(goCell.classList.contains('planted')) {
      //push the indices of all hits into the hitsIndexArray
      startingRandomHitIndex = goIndex
      hitsIndexArray.push(goIndex)
      //clear any previous adjacentCellArray
      adjacentCellArray = []
      // check cell to right is in grid and not already tried
      if((goIndex + 1)%gridWidth <=9 && !player2Goes.includes(player1GridCells[goIndex + 1])) {
        adjacentCellArray.push(player1GridCells[goIndex + 1])
      }
      // check cell below is in grid and not already tried
      if((goIndex + gridWidth)<=99  && !player2Goes.includes(player1GridCells[goIndex + gridWidth])) {
        adjacentCellArray.push(player1GridCells[goIndex + gridWidth])
      }
      // check cell to left is in grid and not already tried
      if((goIndex - 1)%gridWidth >=0 && !player2Goes.includes(player1GridCells[goIndex - 1])) {
        adjacentCellArray.push(player1GridCells[goIndex - 1])
      }
      // check cell above is in grid and not already tried
      if((goIndex - gridWidth) > 0  && !player2Goes.includes(player1GridCells[goIndex - gridWidth])) {
        adjacentCellArray.push(player1GridCells[goIndex - gridWidth])
      }
      randomMode = false
      cycleMode = true
    }
  }

  function handleCycleMode(startingRandomHitIndex) {
    // if array is empty - pick a cell at random and return to random mode
    if(adjacentCellArray && adjacentCellArray.length){
      goCell = adjacentCellArray[adjacentCellArray.length-1]
      adjacentCellArray.pop()
      player2Goes.push(goCell)
      const goIndex = player1GridCells.indexOf(goCell)

      if(goCell.classList.contains('planted')) {
        //push the indices of all hits into the hitsIndexArray
        hitsIndexArray.push(goIndex)
        console.log('In cycle mode and hit')
        console.log({goIndex})
        //compare last hit index with current index to identify orientation
        if(hitsIndexArray[hitsIndexArray.length-2] % gridWidth === hitsIndexArray[hitsIndexArray.length-1] % gridWidth) {
          orientation = 'vertical'
        } else if (hitsIndexArray[hitsIndexArray.length-2] % gridWidth === hitsIndexArray[hitsIndexArray.length-1] % gridWidth - 1 || lastHitIndex === goIndex + 1) {
          orientation = 'horizontal'
        }
        // identify best starting direction - if last hit higher index then direction down/right (1)
        if(hitsIndexArray[hitsIndexArray.length-2] > hitsIndexArray[hitsIndexArray.length-1]) {
          direction = 1
        } else {
          direction = -1
        }

        cycleMode = false
        orientationMode = true
        lastGoIndex = hitsIndexArray[hitsIndexArray.length-1]
        orientationMode(startingRandomHitIndex, orientation, direction, lastGoIndex)
      }
    }
  }

  function handleOrientationMode(startingRandomHitIndex, orientation, direction, lastGoIndex) {

    lastHitIndex = hitsIndexArray[hitsIndexArray.length-1]
    // Identify the two cells at each end of tried Cells
    let nextTryIndex
    let otherEndIndex
    let goCell

    // determine next cell to try
    switch (true) {
      case orientation === 'vertical':
        nextTryIndex = lastGoIndex + direction * gridWidth
        otherEndIndex = startingRandomHitIndex + direction * gridWidth
        break
      case orientation === 'horizontal':
        nextTryIndex = lastGoIndex + direction
        otherEndIndex = startingRandomHitIndex + direction * gridWidth
        break
    }

    // Sits in the grid and not already selected and not a hit
    if(!player2Goes.includes(player1GridCells[nextTryIndex])
    && (!player1GridCells[nextTryIndex].classList.contains('planted'))
    &&checkCellInGrid(nextTryIndex)) {
      //select the cell as player 2 go and then reverse
      goCell = player1GridCells[nextTryIndex]
      if(!triedBothDirections) {
        direction = -direction
        triedBothDirections = true
      }
      // else if the above contains a 'hit' then select the go but don't reverse
    } else if (player1GridCells[nextTryIndex].classList.contains('planted')) {
      goCell = player1GridCells[nextTryIndex]

      // else - since the computer is unable to go in the first direction, reverse direction and try nextCell2

    } else if(!player2Goes.includes(player1GridCells[otherEndIndex])
    &&checkCellInGrid(otherEndIndex)) {
      goCell = player1GridCells[otherEndIndex]
    } else {
      if(!triedBothDirections) {
        direction = -direction
        triedBothDirections = true
      }

      // if the above conditions do not produce a valid go, then set the mode back to randomMode
      if(goCell === undefined) {
        orientationMode = false
        randomMode = true
        triedBothDirections = false
      }


      const goIndex = player1GridCells.indexOf(goCell)
      player2Goes.push(goCell)
      if(goCell.classList.contains('planted')) {
        //push the indices of all hits into the hitsIndexArray
        hitsIndexArray.push(goIndex)
      }
    }
    //Check that the player2Goes array includes all the cells from player1GridCells
    if(player1GridCells.every(goCell => player2Goes.includes(goCell))) {
      console.log('Yup all the cells are present')
    }
  }

  function checkCellInGrid(cellIndex) {
    if(cellIndex % gridWidth > 0 && cellIndex % gridWidth < gridWidth && cellIndex < (gridWidth*gridWidth-1) && cellIndex > 0) {
      return true
    }
  }

}) //End of DOMContentLoaded
