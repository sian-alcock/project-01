document.addEventListener('DOMContentLoaded', () => {

  const player1Grid = document.querySelector('.player1Grid')
  const player2Grid = document.querySelector('.player2Grid')


  const gridWidth = 10
  let orientation = null

  //Create player grid(s)

  function createPlayerGrid (player) {

    for(let i = 1; i <= (gridWidth * gridWidth); i++) {
      const gridDiv = document.createElement('div')
      player.appendChild(gridDiv)
      gridDiv.setAttribute('class', 'empty')
    }
  }

  createPlayerGrid(player1Grid)
  createPlayerGrid(player2Grid)

  const player1GridCells = Array.from(document.querySelectorAll('.player1Grid div'))
  const player2GridCells = Array.from(document.querySelectorAll('.player2Grid div'))

  //************Generate player grid content****************

  //   Let the computer choose either vertical or horizontal orientation for the crops at random.

  let validStartCells = []

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
      orientation = 'horizontal'
    } else {
      orientation = 'vertical'
    }
    return orientation
  }

  // console.log(player1GridCells)

  function getValidStartingCells(orientation, cropLength) {
    player1GridCells.forEach((cell, i) => {
      if(orientation === 'horizontal') {
        // if the cells fall within the grid and are empty (ie do not contain the class of empty, then push into the validStartCells array)
        let counter = 1
        let cellValidCheck = false
        while (counter < cropLength) {
          if(i % gridWidth <= cropLength && !player1GridCells[i].classList.contains('planted')) {
            cellValidCheck = true
            // console.log('these cells are in the grid AND are empty')
          } else {
            // console.log('some of these cells fall outside the grid')
          }
          counter++
        }
        if(cellValidCheck === true) {
          validStartCells.push(cell)
          return validStartCells
        }
      }

      if(orientation === 'vertical') {
        // if the cells fall within the grid and are empty (ie do not contain the class of empty, then push into the validStartCells array)
        let counter = 1
        let cellValidCheck = false
        while (counter < cropLength) {
          if(i + (gridWidth*(cropLength-1)) <= 99 && !player1GridCells[i].classList.contains('planted')) {
            cellValidCheck = true
            // console.log('these cells are in the grid AND are empty')
          } else {
            // console.log('some of these cells fall outside the grid')
          }
          counter++
        }
        if(cellValidCheck === true) {
          validStartCells.push(cell)
          return validStartCells
        }
      }
    }
    )
  } // end of forEach loop
  // TESTING FOR ABOVE FUNCTION - DON'T DELETE ********
  // console.log({validStartCells})
  // getValidStartingCells('vertical', 5)
  // console.log(validStartCells.length)
  // const randomIndex = Math.floor(Math.random()* validStartCells.length)
  // console.log(randomIndex)
  // console.log(validStartCells[randomIndex])


  function populateGrid() {
    for (const length in crops) {
      // get crop length
      const cropLength = (crops[length])
      // set crop orientation
      const cropOrientation = setCropOrientation()
      // get valid cells (ie ones in which crops can be planted without falling out of the grid or overlaying existing crops)
      getValidStartingCells(cropOrientation, cropLength)
      console.log(validStartCells)
      // choose a random cell in which to plant the plantCrops
      const randomCellIndex = Math.floor(Math.random()*validStartCells.length)
      const randomCell = validStartCells[randomCellIndex]
      // plant the crops!
      plantCrops(orientation, cropLength, randomCell)
    } // end of for loop
  } //end of function

  populateGrid()

  function plantCrops(orientation, cropLength, randomCell) {
    const randomCellIndex = player1GridCells.indexOf(randomCell)
    if(orientation === 'horizontal') {
      let i = 0
      while (i < cropLength) {
        player1GridCells[randomCellIndex+i].setAttribute('class', 'planted')
        i++
      }
    }
    if(orientation === 'vertical') {
      let i = 0
      while (i < cropLength) {
        player1GridCells[randomCellIndex+(i*gridWidth)].setAttribute('class', 'planted')
        i++
      }
    }
  }
  //Test function below
  // plantCrops('vertical', 5, 9)




  // Starting with the largest/longest crop (eg 5 tomatoes) computer needs to identify all the valid starting cells (ie a cell in which the first crop item can be dropped which has the required number of cells to the right (or below) in which the remaining crop items can be dropped.  For example, for a crop containing 6 items, the starting cell must be at least 6 cells away from the bottom of the grid if oriented vertically or 6 cells away from the right of the grid if oriented horizontally.

  // The computer should then pick one of the valid starter cells at random and position the first crop - marking these cells as ‘planted’ or similar.

  // When planting subsequent crops, the computer must take into account cells in which existing crops have been planted so that the next batch of valid starting cells must have x clear cells to the right of it or below it (where x = length of the crop).

  // Computer identifies next batch of valid starting cells, picks one at random and plants crop - marking cells as ‘planted’.

  // If a situation arises where the computer is unable to find a valid position for a crop in one orientation, then it should try the other orientation.

  // Once all five crops are planted.  Computer playing grid is ready.

  // Tip from Mike - Battleships shouldn’t be adjacent…make this a ‘should have’.



  // BUILD A SET OF TESTS HERE AND DON'T DELETE THEM!!!

  // ***** Test classlist in for each on Grid
  // player1GridCells.forEach(cell => {
  //   if(!cell.classList.contains('planted')) {
  //     console.log('this seems to work here...')
  //   }
  // })


  // ***** Test while loop in for each on Grid
  // player1GridCells.forEach((cell,i) => {
  //   let counter = 1
  //   while (counter < 5) {
  //     if(i > 22 && i < 24) {
  //       console.log(`i am in cell ${i}`)
  //     }
  //     counter++
  //   }
  // })


}) //End of DOMContentLoaded
