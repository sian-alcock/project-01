document.addEventListener('DOMContentLoaded', () => {

  const player1Grid = document.querySelector('.player1Grid')
  const player2Grid = document.querySelector('.player2Grid')
  const changeCrops = document.querySelector('#changeCrops')
  const startBtn = document.querySelector('#start')
  const scoreBoardPlayer1 = document.querySelector('.scoreBoardPlayer1 ul')
  const scoreBoardPlayer2 = document.querySelector('.scoreBoardPlayer2 ul')

  let validHorizontalStartCells = []
  let validVerticalStartCells = []
  const crops = {
    crop1: 5,
    crop2: 4,
    crop3: 3,
    crop4: 3,
    crop5: 2
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

  function resetGrid(player, gridCells) {
    // Create grids

    let arrayHits
    let cropsDestroyed
    let scoreBoard

    if(player === 1) {
      scoreBoard = scoreBoardPlayer1
      arrayHits = arrayHitsPlayer1
      cropsDestroyed = cropsDestroyedPlayer1
    } else if(player === 2){
      scoreBoard = scoreBoardPlayer2
      arrayHits = arrayHitsPlayer2
      cropsDestroyed = cropsDestroyedPlayer2
    }

    arrayHits = []
    cropsDestroyed = {}
    gridCells.forEach(cell => cell.className='empty')
    scoreBoard.innerHTML = '<ul></ul>'
    goCount = 0
  }


  function setUpGame() {
    resetGrid(1, player1GridCells)
    //Populate both grids and get the computer selections
    populateGrid(player1GridCells)
    // Check the grid for cells where there are two classes of crops in a single cell...if so, start again
    let gridCheck1 = player1GridCells.filter(cell => cell.classList.contains('planted')).length

    while(gridCheck1 !== 17) {
      resetGrid(1, player1GridCells)
      populateGrid(player1GridCells)
      gridCheck1 = player1GridCells.filter(cell => cell.classList.contains('planted')).length
    }

    resetGrid(2, player2GridCells)
    populateGrid(player2GridCells)
    // Check the grid for cells where there are two classes of crops in a single cell...if so, start again
    let gridCheck2 = player2GridCells.filter(cell => cell.classList.contains('planted')).length
    while(gridCheck2 !== 17) {
      resetGrid(2, player2GridCells)
      populateGrid(player2GridCells)
      gridCheck2 = player2GridCells.filter(cell => cell.classList.contains('planted')).length

    }
    getPlayer2Selection()
    // getPlayer2Goes() //This will replace the above function once it is working
  }


  const player1GridCells = Array.from(document.querySelectorAll('.player1Grid div'))
  const player2GridCells = Array.from(document.querySelectorAll('.player2Grid div'))



  //************Generate player grid content****************

  //   Let the computer choose either vertical or horizontal orientation for the crops at random.




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
      // console.log('This grid contains overwritten cells')
    } else {
      // console.log('This grid is pukka!!')
    }
  }

  //Test function below
  // plantCrops('horizontal', 5, 1)



  // console.log(validVerticalStartCells)


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


  // **********************************************
  let randomMode = true
  let cycleMode = false
  let orientationMode = false
  let direction = 1 // 1 is up/right -1 is down/left
  const hitsIndexArray = []
  let hitOrientation
  let adjacentCellArray = []
  let player2Goes = [] // This will replace the above variable if i get it working
  let lastGoIndex
  let startingOrientationIndex
  let startingRandomHitIndex
  let triedBothDirections = false

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
    let goCell
    let lastHitIndex = null

    for(let i = 0; i < gridWidth*gridWidth; i++) {
      // console.log({randomMode})
      // console.log({cycleMode})
      // console.log({orientationMode})

      if (randomMode === true) {
        const goIndex = getRandomCell()
        while (goIndex === undefined) {
          getRandomCell()
        }
        goCell = player1GridCells[goIndex]
        player2Goes.push(goCell)
        if(goCell.classList.contains('planted')) {
          //push the indices of all hits into the hitsIndexArray
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
          console.log(goCell)
          console.log(adjacentCellArray)
          randomMode = false
          cycleMode = true
          lastHitIndex = hitsIndexArray[hitsIndexArray.length-1]
        }
        lastGoIndex = goIndex
      }


      if(cycleMode === true) {
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
            // identify best starting direction - if last hit higher index then direction up/right (1)
            if(hitsIndexArray[hitsIndexArray.length-2] > hitsIndexArray[hitsIndexArray.length-1]) {
              direction = 1
            } else {
              direction = -1
            }
            cycleMode = false
            orientationMode = true
            startingRandomHitIndex = hitsIndexArray[hitsIndexArray.length-1]
            console.log({orientationMode})
            console.log(orientation)
            console.log({startingRandomHitIndex})
          }
        }
      }

      if(orientationMode === true) {

        // use new function checkCellInGrid(cellIndex)

        // need to include direction in the targeting of next cell to try eg

        // direction 1 - endcellUpRight

        lastHitIndex = hitsIndexArray[hitsIndexArray.length-1]
        // Identify the two cells to the right/left or top/bottom of the selection
        let nextCellIndex
        let nextCell2Index
        // determine next cell to try
        switch (true) {
          // initial direction is going up
          case orientation === 'vertical' && direction === 1:
            nextCellIndex = lastHitIndex - gridWidth
            nextCell2Index = startingRandomHitIndex + gridWidth
            break
          // initial direction is going down
          case orientation === 'vertical' && direction === -1:
            nextCellIndex = lastHitIndex + gridWidth
            nextCell2Index = startingRandomHitIndex - gridWidth
            break
          // initial direction is going right
          case orientation === 'horizontal' && direction === 1:
            nextCellIndex = lastHitIndex + 1
            nextCell2Index = startingRandomHitIndex - 1
            break
          // initial direction is going left
          case orientation === 'horizontal' && direction === -1:
            nextCellIndex = lastHitIndex - 1
            nextCell2Index = startingRandomHitIndex + 1
            break
        }

        // const nextCell = player1GridCells[nextCellIndex]

        // Sits in the grid and not already selected and not a hit
        if(!player2Goes.includes(player1GridCells[nextCellIndex])
        && (!player1GridCells[nextCellIndex].classList.contains('planted'))
        &&(direction === -1 && player1GridCells[nextCellIndex + 1] % gridWidth !== 0)
         &&(direction === 1 && player1GridCells[nextCellIndex-1] % gridWidth !== gridWidth - 1)
         && (direction === -1 && player1GridCells[nextCellIndex+gridWidth] < 99)
         && (direction === 1 && player1GridCells[nextCellIndex-gridWidth] > 0)) {
          //select the cell as player 2 go and then reverse
          goCell = player1GridCells[nextCellIndex]
          if(!triedBothDirections) {
            direction = -direction
            triedBothDirections = true
          }
          // else if the above ccontains a 'hit' then select the go but don't reverse
        } else if (player1GridCells[nextCellIndex].classList.contains('planted')) {
          goCell = player1GridCells[nextCellIndex]

          // else - since the computer is unable to go in the first direction, reverse direction and try nextCell2

        } else {
          if(!triedBothDirections) {
            direction = -direction
            triedBothDirections = true
          }

          if(!player2Goes.includes(player1GridCells[nextCell2Index])
              &&(direction === -1 && player1GridCells[nextCell2Index + 1] % gridWidth !== 0)
               &&(direction === 1 && player1GridCells[nextCell2Index-1] % gridWidth !== gridWidth - 1)
               && (direction === -1 && player1GridCells[nextCell2Index+gridWidth] < 99)
               && (direction === 1 && player1GridCells[nextCell2Index-gridWidth] > 0)) {
            goCell = player1GridCells[nextCell2Index]
          }
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

    }
    console.log(player2Goes)
    console.log(hitsIndexArray)

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

  function playerHitRoutine (targetCell, player) {
    // const targetGrid = `${player}GridCells`
    let arrayHits
    let cropsDestroyed
    let scoreBoard

    if(player === 'player1') {
      arrayHits = arrayHitsPlayer1
      cropsDestroyed = cropsDestroyedPlayer1
      scoreBoard = scoreBoardPlayer1
    } else if (player === 'player2'){
      arrayHits = arrayHitsPlayer2
      cropsDestroyed = cropsDestroyedPlayer2
      scoreBoard = scoreBoardPlayer2
    }
    targetCell.classList.add('hit')
    arrayHits.push(targetCell)
    // console.log(arrayHits)
    // check the crop
    const classList = Array.from(targetCell.classList)
    const hitCrop = classList.filter(crop => cropsArray.includes(crop))
    console.log(hitCrop)
    // check to see if this crop type has been completely destroyed
    if(arrayHits.filter(cell => cell.classList.contains(hitCrop)).length === crops[hitCrop]) {
      cropsDestroyed[hitCrop] = true
      console.log(`hurrah - you destroyed the whole of ${hitCrop}`)
      const cropReport = document.createElement('li')
      scoreBoard.appendChild(cropReport)
      cropReport.innerHTML = `${hitCrop}: Destroyed!${player}`
    }
    // check to see if all crops have been destroyed (end of game!!)
    if(cropsArray.every(crop => cropsDestroyed[crop])) {
      console.log('GAME OVER!!!!!  You win the GAME!!!!!@')
      scoreBoard.innerHTML ='GAME OVER!!!!!  You win the GAME!!!!!@'
    }

  }


  function userGo (e) {
    // check that player1 has not already clicked this cell
    if(!this.classList.contains('hit') && !this.classList.contains('miss')) {
      //hit loop starts here
      if(this.classList.contains('planted')) {
        const targetCell = e.target
        console.log(targetCell)
        playerHitRoutine(targetCell, 'player1')
        computerGo(goCount)
        goCount++
      } else {
        this.classList.add('miss')
        computerGo(goCount)
        goCount++
      }
    } // don't do anything if the user has already clicked the cells
  }


  function computerGo (goCount) {
    // console.log(player2SelectedCells)
    const targetCellIndex = player1GridCells.indexOf(player2SelectedCells[goCount])
    const targetCell = player1GridCells[targetCellIndex]
    if(!targetCell.classList.contains('planted')) {
      targetCell.classList.add('miss')
    } else {
      playerHitRoutine(targetCell, 'player2')
    }
  }



  // changeCrops.addEventListener('click', populateGrid.bind(player2GridCells))
  startBtn.addEventListener('click', setUpGame)
  player2GridCells.forEach(cell => cell.addEventListener('click', userGo))


}) //End of DOMContentLoaded
