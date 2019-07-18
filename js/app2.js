document.addEventListener('DOMContentLoaded', () => {

  
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
