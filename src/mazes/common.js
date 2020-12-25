import { SPACE_TOKEN, WALL } from './constants'

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

export { dumpObject, generateInitialMaze }
