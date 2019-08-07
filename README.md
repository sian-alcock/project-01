# **Project 1: Crop Capers**

## Overview
Crop Capers is a fun, browser-based game, based on Battleships. The premise is two farmers who compete every year to show their fruit and vegetables at the county fair.  Player 1's rival - dubbed Farmer Giles - is playing dirty and stealing crops from Player 1's farm.  Player 1 is tasked with seeking out Farmer Giles' crops and digging them all up before Farmer Giles does the same to his/her own crops.

This is my first project from General Assembly's Software Engineering Immersive Course and first attempt at building a game from scratch using JavaScript.  I am the sole programmer on this project.

### Project duration
7 days.

Launch on [GitHub Pages](https://sian-alcock.github.io/project-01/).

![Main screenshot](/images/Screenshot-game-play.png)

## Brief

* The game should be one player, with the computer placing its pieces randomly at the start of the game
* The computer should be able to make random attacks on the player's board

## Technologies Used

* HTML5 with HTML5 audio
* CSS3
* JavaScript (ES6)
* ScSS
* Git
* GitHub
* Google Fonts

### Approach Taken

### Future proofing

I have  tried to make the game 'future-proof' and to avoid hard coding where possible.  For example, the grid is generated at start up based on a gridWidth variable - so it should be possible to change the size of the grid at a later stage without causing any issues.  In addition, the crops and their lengths (ie the number of cells they take up in the grid) are read from an object, so the names and lengths can be changed if needed.  

### Generation of grids and planting of crops

One of the toughest challenges has been to program the 'planting' of the crops - which vary in length either vertically or horizontally so that they do not:
* fall outside of the grid
* clash with other crops that have already been planted.

In my original planning, I was hoping to enable the player to plant his/her own crops using  'drag and drop' to pick up a crop and drag it to a cell on the grid.

With this goal in mind, I decided to create an array of 'valid starting cells' - meaning that if the user dragged a crop to a valid starting cell, it and its associate crop items could safely be placed within the grid and avoiding other crops already planted.

I successfully created a function that built two arrays of valid starting cells (one for vertically oriented crops and one for horizontal).  I then built a second function that referred to that array to plant the crops.

By building it this way, I believe that the implementation of the drag and drop capability will be simpler.

## Functionality

### Welcome screen
The player is introduced to the game with a simple welcome screen that explains the premise of the game.

![Screenshot](/images/Screenshot-welcome.png)

### Animation
Credit to Sarah Powell for producing an animated movie which I embedded in the welcome screen to help try to explain the game premise and to introduce a bit of fun and movement.

![Animation](/movies/cropcapers-coolmovie.gif)

### Crop rotation
At the beginning of the game, the user can re-plant his/her crops by clicking a button.  This was easy to do by simply re-running the code used to plant the crops in the first place.

![Screenshot](/images/Screenshot-crop-rotation.png)

### Game play
The player starts with an empty grid on the right hand side of the screen labelled Farmer Giles' farm.  His/her own farm sits on the left showing the crop configuration chosen in the initial set up screen.

The player clicks on the cells in the grid on the right to reveal either nothing (grey square) or a 'hit crop' (cross image).  A different sound effect is played according to 'miss' or 'hit'.  When the player has destroyed a whole set of crops, the images at the top of the screen update to show the set of crops with a line through them.

Each time the player clicks, the computer (aka Farmer Giles), takes its turn - the impact of which is reflected in the left hand grid.  The action of the click is managed for both the player and the computer in a single function as set out below.

``` JavaScript
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
```

![Screenshot](/images/Screenshot-game-play.png)

### End of game and reset
When either the player or the computer have destroyed all the crops, the game is over.  A 'Start again' button is available to reset the grids, scores etc.

![Screenshot](/images/Screenshot-final.png)

### Bugs

* The function to plant the crops did not work in all cases but did in 80% of cases.  I built a workaround to keep re-generating it until it worked.
* The Start again button resets the grid but does not allow the player to go back and re-plant crops.


## Wins and Blockers

### Final deliverable looks good and works well

I'm happy with the final deliverable which met the brief. In a relatively short time, I have produced a game that - I believe - looks fun and is easy to navigate and play.

### Making the computer play the game more intelligently

I spent about twenty or so hours programming the computer to replicate how a human would play the game.

In the end, I had to put the code to one side in order to meet the project deadline.

Although I set out with a plan of what I wanted to code, I was unsure of how to build the code to do what I wanted and so started by creating a massive function which was hard to debug.

I started to refactor the code and to break it down to smaller chunks and made some progress but ran out of time to follow that to its conclusion.  

It is my intention to complete that code at the end of the course.

## Future Content

I would like to include the following capabilities:
* Responsive design - not working great on mobiles right now.
* Complete the code to make the computer play the game more intelligently (ie once a 'hit' has been made - to target the cells around it until crop is completely destroyed).
* Enable player to plant his/her crops by clicking to select the orientation, then dragging them onto the grid.
* Keep score between games.
* Should be a sound to alert player when a single crop has been destroyed (image does update but is a bit subtle)

## What I learned

This project was such a great learning experience.  Major learning points:
* Generating functions and passing parameters back and forth between them
* Try to never write the same piece of code more than once even if it's quite a small check (eg check if a cell falls within the grid)
* Try to design a code solution before starting.  I did this for my crop planting and it went fairly well.  I didn't for the 'intelligent computer game-playing' and failed to complete it in the end.
* Everything takes 3 or 4 times longer than you think - even just placing a piece of text on a page.
* Write meaningful messages when you commit your code on gitHub - makes life so much easier if you have to restore.
