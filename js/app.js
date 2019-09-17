document.addEventListener('DOMContentLoaded', () => {

  const player1Grid = document.querySelector('.player1Grid')
  const player2Grid = document.querySelector('.player2Grid')
  const player1Text = document.querySelector('.player1Text')
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
  const welcome = document.querySelector('.welcome')


  const missSound = new Audio('sounds/miss.wav')
  const hitSound = new Audio('sounds/hit.wav')
  const music = new Audio('sounds/background-music.mp3')
  const gameOverSound = new Audio('sounds/applause.wav')
  const cropDestroyedSound = new Audio('sounds/Ding-ding-ding.mp3')
  const gameOverLostSound = new Audio('sounds/aah.wav')

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
  let goCount = 0
  let arrayHitsPlayer1 = []
  let arrayHitsPlayer2 = []
  let cropsDestroyedPlayer1 = {}
  let cropsDestroyedPlayer2 = {}
  const cropsArray = Object.keys(crops)

  let attackMode = 'random'
  const hitsIndexArray = []
  let adjacentCellArray = []
  let player2Goes = []

  //Create player grid(s)

  function createPlayerGrid (playerNumber, grid) {
  // Create a code of p1-grid and p2-grid to include in the data-id to distinguish between player1's grid and player2's grid
    const shortCode = `p${playerNumber}-grid`
    for(let i = 0; i <= (gridWidth * gridWidth)-1; i++) {
      const gridDiv = document.createElement('div')
      grid.appendChild(gridDiv)
      gridDiv.setAttribute('class', 'empty')
      gridDiv.setAttribute('data-id', `${shortCode}-${i}`)
    }
  }

  createPlayerGrid(1, player1Grid)
  createPlayerGrid(2, player2Grid)

  function reset() {
    player1Text.textContent = 'Your crops are planted.'
    gameOverText.textContent = ''
    // remove the pulse class
    scoreBoardPlayer1Images.forEach(crop => crop.classList.remove('pulse'))
    scoreBoardPlayer2Images.forEach(crop => crop.classList.remove('pulse'))

    // set the images back to non-strikethrough
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
    // Check the grid - if crops overlap, go again
    let gridCheck1 = player1GridCells.filter(cell => cell.classList.contains('planted')).length

    //Calculate how many cells should be planted
    const numOfCropCells = Object.keys(crops).reduce((sum,key)=>sum+parseFloat(crops[key]||0),0)

    while(gridCheck1 !== numOfCropCells) {
      player1GridCells.forEach(cell => cell.className='empty')
      populateGrid(player1GridCells)
      gridCheck1 = player1GridCells.filter(cell => cell.classList.contains('planted')).length
    }

    player2GridCells.forEach(cell => cell.className='empty')
    populateGrid(player2GridCells)
    // Check the grid - if crops overlap, go again
    let gridCheck2 = player2GridCells.filter(cell => cell.classList.contains('planted')).length
    while(gridCheck2 !== numOfCropCells) {
      player2GridCells.forEach(cell => cell.className='empty')
      populateGrid(player2GridCells)
      gridCheck2 = player2GridCells.filter(cell => cell.classList.contains('planted')).length

    }
    // getPlayer2Selection()
    player2Goes = []
    attackMode = 'random'
    getPlayer2GoCells()
    if(player2Goes.length === 100) {
      console.log('All is well')
    } else {
      console.log('Uh-oh...')
    }

    // sets the player2Grid to pulse to highlight where the player needs to click

    player2Grid.classList.add('pulse')
  }


  const player1GridCells = Array.from(document.querySelectorAll('.player1Grid div'))
  const player2GridCells = Array.from(document.querySelectorAll('.player2Grid div'))
  function playMusic() {
    music.play()
  }

  function start(){
    startBoardText.style.display = 'none'
    welcome.style.backgroundColor = 'black'
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
    changeCropsSpace.style.justifyContents = 'center'
    changeCropsSpace.style.alignItems = 'center'
    player1Space.style.width = '50%'
    changeCropsSpace.style.width = '50%'
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
    gameArea.style.backgroundColor = 'white'
    reset()
  }

  function rePlantCrops() {
    reset()
  }

  function setCropOrientation() {
  // Use a random number to assign the orientation of the crop (ie vertical or horizontal)

    const randomNumber = Math.floor(Math.random()*2)
    if(randomNumber === 1){
      orientation = 'vertical'
    } else {
      orientation = 'horizontal'
    }
    return orientation
  }

  function getValidStartingCells(orientation, crop, cropLength, gridCells) {
    // Creates array of 'valid' cells in which the first crop can be placed and all its associate crop items can fit in the grid
    validHorizontalStartCells = []
    validVerticalStartCells = []
    gridCells.forEach((cell, i) => {
      if(orientation === 'horizontal') {
        // if the cells fall within the grid and are empty, then push into the validStartCells array

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
            // console.log('some of these cells fall outside the grid')
          }
          counter++
        }
        if(checksArray.length === cropLength) {
          validHorizontalStartCells.push(cell)
          return validHorizontalStartCells
        }
      }

      if(orientation === 'vertical') {
        // if the cells fall within the grid and are empty, then push into the validStartCells array)

        const checksArray = []

        //Check the current cell to make sure it is not 'planted'
        if(i + (gridWidth*(cropLength-1)) <= (gridWidth*gridWidth-1) && !gridCells[i].classList.contains('planted')) {
          checksArray.push(i)
        }

        //Check the cells below to make sure they are on the grid and not already 'planted'
        let counter = 1

        while (counter < cropLength) {
          if((i+ gridWidth - 1 + counter) + (gridWidth*(cropLength-1)) <= (gridWidth*gridWidth-1) && !gridCells[i+gridWidth - 1+counter].classList.contains('planted')) {
            checksArray.push(i+gridWidth - 1+counter)
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
    }
  }



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

  function playerHitRoutine (targetCell, player) {
    // Manages the actions on 'go' for both players
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
    // check to see if this crop type has been completely destroyed
    if(arrayHits.filter(cell => cell.classList.contains(hitCrop)).length === crops[hitCrop]) {
      cropsDestroyed[hitCrop] = true
      //Stop the 'hit sound'
      hitSound.pause()
      hitSound.currentTime = 0
      cropDestroyedSound.play()
      const targetScoreBoardImage = scoreBoardImages.filter(image => image.classList.contains(`${hitCrop}`))
      // console.log(`this crop has been destroyed ${hitCrop}`)
      targetScoreBoardImage[0].setAttribute('src', `images/${hitCrop}-score-hit.png`)
      targetScoreBoardImage[0].classList.add('pulse')

    }

    // check to see if all crops have been destroyed (end of game!!)
    if(cropsArray.every(crop => cropsDestroyed[crop])) {
      if(player === 'player1'){
        gameOverText.textContent='GAME OVER!!!  You got all Farmer Giles\' crops!'
        gameOverSound.play()
      } else {
        gameOverText.textContent='GAME OVER!!!  Farmer Giles was too quick for you.  Better luck next time!'
        gameOverLostSound.play()
      }

      gameArea.style.backgroundColor = 'gold'
      billBoard.style.order = 1
      billBoard.style.display = 'unset'
      player1Space.style.display = 'none'
      player2Space.style.display = 'none'
    }
  }


  function userGo (e) {
    // stop the grid pulsing when the user starts playing
    player2Grid.classList.remove('pulse')
    // check that player1 has not already clicked this cell
    if(!this.classList.contains('hit') && !this.classList.contains('miss')) {
      //hit loop starts here
      if(this.classList.contains('planted')) {
        hitSound.play()
        const targetCell = e.target
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
    // console.log(player2GoCells)
    player1Text.textContent = 'Uh-oh!  Your crops are under attack!'
    const targetCellIndex = player1GridCells.indexOf(player2Goes[goCount])
    const targetCell = player1GridCells[targetCellIndex]
    if(!targetCell.classList.contains('planted')) {
      targetCell.classList.add('miss')
    } else {
      playerHitRoutine(targetCell, 'player2')
    }
  }


  // ***************************GET THE COMPUTER TO PLAY LIKE A HUMAN *******************

  function getPlayer2GoCells() {

    // Create an array called 'Player2Goes' which contains all the goes the computer will make
    player2Goes = []
    attackMode = 'random'
    while(player2Goes.length <= gridWidth*gridWidth) {
      handleRandomMode()
    }
    player2Goes = [...new Set(player2Goes)]
    const difference = player1GridCells.filter(cell => !player2Goes.includes(cell))
    player2Goes.push(...difference)
    console.log(player2Goes)
    return player2Goes
  }

  function getRandomCell () {
    // Filter player1GridCells to only those that haven't already been picked
    const remainingCells = player1GridCells.filter(cell => !player2Goes.includes(cell))
    // pick a cell at random from remaining cells and get its data Id
    const goCell = remainingCells[Math.floor(Math.random()*(remainingCells.length))]
    // set goIndex to the matching data Id in player1GridCells

    if(goCell) {
      const goCellDataId = goCell.getAttribute('data-id')
      const goIndex = player1GridCells.findIndex(div => div.dataset.id === goCellDataId)
      return goIndex
    }
  }


  function handleRandomMode() {
    while(attackMode === 'random') {
      const goIndex = getRandomCell()

      // Make sure goIndex is truthy (ie not undefined)
      if(goIndex) {

        const goCell = player1GridCells[goIndex]
        player2Goes.push(goCell)

        // If the random selection gets a hit create array of adjacent cells and start cycleMode
        if(goCell.classList.contains('planted')) {
          //push the indices of all hits into the hitsIndexArray
          const startingRandomHitIndex = goIndex
          hitsIndexArray.push(goIndex)
          //clear any previous adjacentCellArray
          adjacentCellArray = []
          // check cell to right is in grid and not already tried
          if(checkCellInGrid(goIndex + 1) && ((goIndex + 1) % gridWidth > goIndex % gridWidth) && !player2Goes.includes(player1GridCells[goIndex + 1])) {
            adjacentCellArray.push(player1GridCells[goIndex + 1])
          }
          // check cell below is in grid and not already tried
          if(checkCellInGrid(goIndex + gridWidth) && !player2Goes.includes(player1GridCells[goIndex + gridWidth])) {
            adjacentCellArray.push(player1GridCells[goIndex + gridWidth])
          }
          // check cell to left is in grid and not already tried
          if(checkCellInGrid(goIndex - 1) && ((goIndex - 1) % gridWidth < goIndex % gridWidth) &&  !player2Goes.includes(player1GridCells[goIndex - 1])) {
            adjacentCellArray.push(player1GridCells[goIndex - 1])
          }
          // check cell above is in grid and not already tried
          if(checkCellInGrid(goIndex - gridWidth) && !player2Goes.includes(player1GridCells[goIndex - gridWidth])) {
            adjacentCellArray.push(player1GridCells[goIndex - gridWidth])
          }
          // Providing the adjacentcellarray contains at least one cell, then go to cycle mode
          if(adjacentCellArray.length > 0){
            attackMode = 'cycle'
            handleCycleMode(startingRandomHitIndex, adjacentCellArray)
          }
        }
      } else {
        // if goIndex is undefined stop
        attackMode = null
      }
    }
  } // End of handleRandomMode

  function handleCycleMode(startingRandomHitIndex, adjacentCellArray) {
    // While the array has elements keep trying for a hit

    while(adjacentCellArray && adjacentCellArray.length) {

      //try the element at end of array as next go
      const goCell = adjacentCellArray[adjacentCellArray.length-1]
      //remove the go element from array
      adjacentCellArray.pop()
      // push the gocell into the player2Goes array
      player2Goes.push(goCell)

      const goIndex = player1GridCells.indexOf(goCell)

      //if goCell is a hit
      if(goCell.classList.contains('planted')) {
        //push the indices of all hits into the hitsIndexArray
        hitsIndexArray.push(goIndex)
        //compare last hit index with current index to identify orientation
        if(hitsIndexArray[hitsIndexArray.length-2] % gridWidth === hitsIndexArray[hitsIndexArray.length-1] % gridWidth) {
          orientation = 'vertical'
        } else {
          orientation = 'horizontal'
        }

        attackMode = 'target'
        const lastGoIndex = hitsIndexArray[hitsIndexArray.length-1]
        handleTargetMode(startingRandomHitIndex, orientation, lastGoIndex)
      }
    }
    //Once the adjacentCellArray is empty and no hit, back to random
    attackMode = 'random'
    handleRandomMode()
  }

  function handleTargetMode(startingRandomHitIndex, orientation, lastGoIndex) {

    let startRowIndex = 0
    let endRowIndex = 0

    if(orientation === 'horizontal') {

      startRowIndex = Math.floor(startingRandomHitIndex/gridWidth)* gridWidth
      endRowIndex = startRowIndex + gridWidth - 1

      console.log({startingRandomHitIndex}, {lastGoIndex}, {startRowIndex}, {endRowIndex})

      //try cells to the right until end of row
      let i = Math.max(lastGoIndex, startingRandomHitIndex) + 1
      while(i !== isNaN && i <= endRowIndex) {
        console.log({i}, player1GridCells[i])
        player2Goes.push(player1GridCells[i])

        if(player1GridCells[i].classList.contains('planted')) {
          i++
        } else {
          break
        }
      }

      //try cells to the left until start of row
      let j = Math.min(lastGoIndex, startingRandomHitIndex) - 1
      while(j !== isNaN && j >= startRowIndex) {
        console.log({j}, player1GridCells[j])
        player2Goes.push(player1GridCells[j])

        if(player1GridCells[j].classList.contains('planted')) {
          j--
        } else {
          break
        }
      }

    }

    if(orientation === 'vertical') {

      //try cells below until end of column
      let i = Math.max(lastGoIndex, startingRandomHitIndex) + gridWidth
      while(i !== isNaN && i <= (gridWidth*gridWidth) - 1) {
        console.log({i}, player1GridCells[i])
        player2Goes.push(player1GridCells[i])
        if(player1GridCells[i].classList.contains('planted')) {
          i+=10
        } else {
          break
        }
      }

      //try cells above until start of column
      let j = Math.min(lastGoIndex, startingRandomHitIndex) - gridWidth
      while(j !== isNaN && j >= 0) {
        console.log({j}, player1GridCells[j])
        player2Goes.push(player1GridCells[j])
        if(player1GridCells[j].classList.contains('planted')) {
          j-=10
        } else {
          break
        }
      }
    }

    attackMode = 'random'
    handleRandomMode()
  }

  function checkCellInGrid(cellIndex) {
    if(cellIndex % gridWidth >= 0 && cellIndex % gridWidth < gridWidth && cellIndex < (gridWidth*gridWidth-1) && cellIndex > 0) {
      return true
    }
  }


  startBtn.addEventListener('click', start)
  resetBtn.addEventListener('click', startAgain)
  changeCrops.addEventListener('click', rePlantCrops)
  readyToPlay.addEventListener('click', goToGame)

  player2GridCells.forEach(cell => cell.addEventListener('click', userGo))

}) //End of DOMContentLoaded
