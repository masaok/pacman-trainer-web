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

// TODO: Given a mazeString, convert into a 2D array

// TODO: Given a 2D array maze, randomize the placement of pacman, ghosts, and pellets

// TODO: Given a 2D array maze, convert into a mazeString

export { dumpObject, generateInitialMaze }
