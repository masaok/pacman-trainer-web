import { SPACE_TOKEN, WALL } from './mazeConstants'

const dumpObject = obj => {
  let result = ''
  for (let i = 0; i < obj.length; i++) {
    const item = obj[i]

    if (typeof item === 'object') {
      result += JSON.stringify(item) + '\n'
    } else {
      result += item + SPACE_TOKEN
    }
  }
  return result
}

const generateInitialMaze = (width, height) => {
  const newMaze = []
  for (let row = 0; row < height; row++) {
    const newRow = []
    for (let col = 0; col < width; col++) {
      newRow.push(WALL)
    }
    newMaze.push(newRow)
  }
  return newMaze
}

const generateRandomInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min
}

const randomizeMazePlayers = mazeString => {
  const array = mazeStringToArray(mazeString)
  const newArray = randomizeMazeArrayPlayers(array)

  const newString = mazeArrayToString(newArray)

  return newString
}

// Given a mazeString, convert into a 2D array
const mazeStringToArray = mazeString => {
  const result = []
  const rowStrings = mazeString.trim().split('\n')

  rowStrings.forEach(string => {
    result.push(string.split(''))
  })
  return result
}

// Given a 2D array maze, randomize the placement of pacman, ghosts, and pellets
const randomizeMazeArrayPlayers = mazeArray => {
  // Pick and count all non-X non-dot characters
  const counter = {}

  for (let i = 0; i < mazeArray.length; i++) {
    const row = mazeArray[i]
    for (let j = 0; j < row.length; j++) {
      const item = row[j]
      switch (item) {
        case 'X':
        case '.':
          break
        default:
          if (counter[item]) counter[item] += 1
          else counter[item] = 1
          mazeArray[i][j] = '.'
      }
    }
  }

  const height = mazeArray.length
  const width = mazeArray[0].length

  const used = {}

  // Loop through all keys (pacman, ghosts, etc) in Player Counter
  const keys = Object.keys(counter)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]

    // If the counter is greater than zero, place the item on the maze
    while (counter[key] > 0) {
      // Place the key on a dot randomly looping as many times as needed
      let placed = false
      while (placed === false) {
        // Generate coordinates
        const y = generateRandomInteger(0, height)
        const x = generateRandomInteger(0, width)

        // Keep tracked of "used" coordinates to not overwrite previous placements
        const usedKey = `${y}-${x}`

        // Get the current item at the coordinates
        const current = mazeArray[y][x]
        // console.log('CURRENT: ' + current)

        // If it's a dot and the coordinates are not yet used...
        if (current === '.' && !used[usedKey]) {
          // Replace the maze item with the Player key
          mazeArray[y][x] = key

          // Mark coordinates as used
          used[usedKey] = 1

          // Decrement the number of times we need to place this Player
          counter[key] -= 1

          // Mark this Player as placed to end the infinite loop
          placed = true
        }
      }
    }
  }

  return mazeArray
}

// Given a 2D array maze, convert into a mazeString
const mazeArrayToString = mazeArray => {
  const strings = []
  for (let i = 0; i < mazeArray.length; i++) {
    const row = mazeArray[i]
    const rowString = row.join('')
    strings.push(rowString)
  }
  return strings.join('\n')
}

export { dumpObject, generateInitialMaze, randomizeMazePlayers }
