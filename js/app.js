document.addEventListener('DOMContentLoaded', () => {

  const player1Grid = document.querySelector('.player1Grid')
  const player2Grid = document.querySelector('.player2Grid')
  const changeCrops = document.querySelector('#changeCrops')
  const startBtn = document.querySelector('#start')

  const gridWidth = 10
  let orientation = null

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

  function setUpGame() {

    //Populate both grids and get the computer selections
    populateGrid(player1GridCells)
    populateGrid(player2GridCells)
    getPlayer2Selection()
  }


  const player1GridCells = Array.from(document.querySelectorAll('.player1Grid div'))
  const player2GridCells = Array.from(document.querySelectorAll('.player2Grid div'))



  //************Generate player grid content****************

  //   Let the computer choose either vertical or horizontal orientation for the crops at random.

  let validHorizontalStartCells = []
  let validVerticalStartCells = []

  const crops = {
    crop1: 5,
    crop2: 4,
    crop3: 3,
    crop4: 3,
    crop5: 2
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

  // console.log(player1GridCells)

  function getValidStartingCells(orientation, crop, cropLength, gridCells) {
    validHorizontalStartCells = []
    validVerticalStartCells = []
    gridCells.forEach((cell, i) => {
      if(orientation === 'horizontal') {
        // if the cells fall within the grid and are empty (ie do not contain the class of empty, then push into the validStartCells array)

        // I cut this code (i+counter) % gridWidth <= cropLength &&

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
  } // end of forEach loop
  // TESTING FOR ABOVE FUNCTION - DON'T DELETE ********



  // console.log(validStartCells.length)
  // const randomIndex = Math.floor(Math.random()* validStartCells.length)
  // console.log(randomIndex)
  // console.log(validStartCells[randomIndex])


  function populateGrid(gridCells) {

    for (const crop in crops) {
      // get crop length
      const cropLength = crops[crop]
      // set crop orientation
      const cropOrientation = setCropOrientation()
      // get valid cells (ie ones in which crops can be planted without falling out of the grid or overlaying existing crops)
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

    // Check the grid for cells where there are two classes of crops in a single cell...if so, start again
      // const gridCheck = gridCells.filter(cell => cell.classList.contains('planted'))
        // console.log('is this code running?')

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
    const plantedCells = gridCells.filter(cell => cell.classList.contains('planted'))
    if(plantedCells.length < 17) {
      console.log('This grid contains overwritten cells')
    } else {
      console.log('This grid is pukka!!')
    }
  }

  //Test function below
  // plantCrops('horizontal', 5, 1)



  // console.log(validVerticalStartCells)


  // **********************Play the Game ********************************

  const player2SelectedCells = player1GridCells

  function getPlayer2Selection () {
    // This function is run at setup - it contains the cells that the computer will select
    // For MVP - simply shuffle the cells into a random order by putting each element in object with random sort key, then sorting using the random key then unmap to get the original objects

    player2SelectedCells
      .map((a) => ({sort: Math.random(), value: a}))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value)
    // console.log(player2SelectedCells)
  }


  // Play the game!! Player 1 picks a cell, then computer has a turn and so on...

  let goCount = 0
  const arrayHits = []
  const cropsDestroyedPlayer1 = {}
  const cropsDestroyedPlayer2 = {}

  function userGo () {

    const cropsArray = Object.keys(crops)

    if(!this.classList.contains('hit') && !this.classList.contains('miss')) {

      //hit loop starts here
      if(this.classList.contains('planted')) {
        this.classList.add('hit')
        arrayHits.push(this)
        console.log(arrayHits)

        // check the crop

        const classList = Array.from(this.classList)
        const hitCrop = classList.filter(crop => cropsArray.includes(crop))
        console.log(hitCrop)
        // check to see if this crop type has been completely destroyed
        if(arrayHits.filter(cell => cell.classList.contains(hitCrop)).length === crops[hitCrop]) {
          cropsDestroyedPlayer1[hitCrop] = true
          console.log(cropsDestroyedPlayer1)
          console.log(`hurrah - you destroyed the whole of ${hitCrop}`)
        }

        // check to see if all crops have been destroyed (end of game!!)

        if(cropsArray.every(crop => cropsDestroyedPlayer1[crop])) {
          console.log('GAME OVER!!!!!  You win the GAME!!!!!@')
        }

        computerGo()
        goCount++
        // hit loop ends here ...
      } else {
        this.classList.add('miss')
        computerGo()
        goCount++
      }
    }
  } // don't do anything if the user has already clicked the cell



  function computerGo () {
    if(player2SelectedCells[goCount].classList.contains('planted')) {
      player2SelectedCells[goCount].classList.add('hit')
    } else {
      player2SelectedCells[goCount].classList.add('miss')
    }
  }

  // changeCrops.addEventListener('click', populateGrid.bind(player2GridCells))
  startBtn.addEventListener('click', setUpGame)
  player2GridCells.forEach(cell => cell.addEventListener('click', userGo))









}) //End of DOMContentLoaded
