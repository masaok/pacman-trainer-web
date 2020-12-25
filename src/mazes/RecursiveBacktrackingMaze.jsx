import React, { useEffect, useState } from 'react'

import clsx from 'clsx'

import { makeStyles } from '@material-ui/core/styles'

// import { dumpGrid } from '../common/helpers'

import { generateInitialMaze } from './common'

const MAX_GHOSTS = 2
const MAX_PACMEN = 1
const MAX_PELLETS = 3
const MAX_BRIDGE_REMOVALS = 4

const MAZE_HEIGHT = 9 // odd number
const MAZE_WIDTH = 11 // odd number

const START_X = 1
const START_Y = 1

const showRemovals = true
const REMOVAL_TOKEN = showRemovals ? '-' : ' ' // using middot instead for now
const SPACE_TOKEN = '.'

const WALL = 'X'
const PELLET = 'O'
const PACMAN = 'P'
const GHOST = 'G'

const EAST = 'E'
const WEST = 'W'
const NORTH = 'N'
const SOUTH = 'S'

// Carve by 2 spaces to make room for walls
const DX = {
  E: 2,
  W: -2,
  N: 0,
  S: 0,
}

// Walls are immediately adjacent
const DXW = {
  E: 1,
  W: -1,
  N: 0,
  S: 0,
}

// Carve by 2 spaces to make room for walls
const DY = {
  E: 0,
  W: 0,
  N: -2,
  S: 2,
}

// Walls are immediately adjacent
const DYW = {
  E: 0,
  W: 0,
  N: -1,
  S: 1,
}

const OPPOSITE = {
  E: WEST,
  W: EAST,
  N: SOUTH,
  S: NORTH,
}

const DIRECTIONS = [EAST, WEST, NORTH, SOUTH]

const useStyles = makeStyles(
  theme => ({
    root: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
    },

    mazeRow: {
      display: 'flex',
      flex: 1,
    },

    mazeBlock: {
      display: 'flex',
      flex: 1,
      minHeight: 50,
      minWidth: 50,
      maxHeight: 50,
      maxWidth: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },

    mazeSpace: {
      backgroundColor: 'black',
      color: 'white',
    },

    mazeWall: {
      backgroundColor: 'blue',
    },

    mazePacman: {
      backgroundColor: 'yellow',
      padding: theme.spacing(0.5),
      backgroundClip: 'content-box',
      boxShadow: 'inset 0 0 0 10px black',
    },

    mazePellet: {
      backgroundColor: 'white',
      padding: theme.spacing(0.5),
      backgroundClip: 'content-box',
      boxShadow: 'inset 0 0 0 15px black',
    },

    mazeGhost: {
      backgroundColor: 'pink',
      padding: theme.spacing(0.5),
      backgroundClip: 'content-box',
      boxShadow: 'inset 0 0 0 10px black',
    },

    mazeRemoval: {
      color: showRemovals ? 'red' : 'white',
      backgroundColor: 'black',
    },

    mazeError: {
      backgroundColor: 'red',
    },
  }),
  { name: 'RecursiveBacktrackingMaze' }
)

// The de-facto unbiased shuffle algorithm is the Fisher-Yates (aka Knuth) Shuffle.
// See https://github.com/coolaj86/knuth-shuffle
// You can see a great visualization here (and the original post linked to this)
const shuffle = array => {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return [...array] // return a new copy
}

const randomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)

  const rando = Math.random()
  return Math.floor(rando * (max - min + 1)) + min
}

const carveFrom = (cx, cy, grid, level = 0) => {
  // let spacing = ''
  // for (let i = 0; i < level; i++) {
  //   spacing += '  '
  // }
  // console.log(spacing + 'LEVEL: ' + level)
  // console.log(spacing + 'CARVE FROM CX: ' + cx)
  // console.log(spacing + 'CARVE FROM CY: ' + cy)
  // console.log(spacing + 'GRID: ')
  // console.log(dump(grid))

  const directions = shuffle(DIRECTIONS)

  // for (const direction in directions) {
  for (let i = 0; i < directions.length; i++) {
    // console.log(spacing + 'DIRECTIONS LEFT: ')
    // console.log(spacing + dump(directions))
    const direction = directions[i]
    // console.log(spacing + '- LOOP DIRECTION: ' + direction)
    const nx = cx + DX[direction]
    // console.log(spacing + '- NX: ' + nx)
    const ny = cy + DY[direction]
    // console.log(spacing + '- NY: ' + ny)

    if (
      nx >= 0 &&
      nx <= MAZE_WIDTH - 1 && // X in bounds
      ny >= 0 &&
      ny <= MAZE_HEIGHT - 1 && // Y in bounds
      grid[ny][nx] === WALL // new location is a wall
    ) {
      // Carve the wall
      const wallX = cx + DXW[direction]
      // console.log(spacing + '- WALL X: ' + wallX)
      const wallY = cy + DYW[direction]
      // console.log(spacing + '- WALL Y: ' + wallY)
      grid[wallY][wallX] = SPACE_TOKEN

      grid[cy][cx] = direction
      // console.log(spacing + '- C DIR: ' + direction)
      grid[ny][nx] = OPPOSITE[direction]
      // console.log(spacing + '- N DIR: ' + OPPOSITE[direction])
      carveFrom(nx, ny, grid, level + 1)
    }
  }

  // We're done
  if (level === 0) {
    return grid
  }
}

const addItems = (grid, item, max, avoid = [WALL, GHOST, PACMAN, PELLET]) => {
  let count = 0
  while (count < max) {
    const randY = Math.floor(Math.random() * MAZE_HEIGHT)
    const randX = Math.floor(Math.random() * MAZE_WIDTH)

    // console.log('TRYING: ' + randX + ', ' + randY)

    if (!avoid.includes(grid[randY][randX])) {
      // console.log('ADDED: ' + item)
      grid[randY][randX] = item
      count++
    }
  }
  return grid
}

const removeBridges = (grid, max) => {
  let count = 0
  while (count < max) {
    const randY = randomInt(1, MAZE_HEIGHT - 2)
    const randX = randomInt(1, MAZE_WIDTH - 2)

    // console.log('TRYING: ' + randX + ', ' + randY)
    // console.log('  ITEM: ' + grid[randY][randX])

    const Yplus = grid[parseInt(randY + 1)][parseInt(randX)]
    const Yminus = grid[parseInt(randY - 1)][parseInt(randX)]
    // console.log('Y PLUS MINUS: ' + Yplus + ', ' + Yminus)

    const Xplus = grid[randY][randX + 1]
    const Xminus = grid[randY][randX - 1]
    // console.log('X PLUS MINUS: ' + Xplus + ', ' + Xminus)

    if (grid[randY][randX] === WALL)
      if (
        (Yplus === WALL && Yminus === WALL && Xplus !== WALL && Xminus !== WALL) ||
        (Xplus === WALL && Xminus === WALL && Yplus !== WALL && Yminus !== WALL)
      ) {
        // console.log(dumpGrid(grid))
        // console.log('REMOVING AT: ' + randX + ', ' + randY)
        grid[parseInt(randY)][parseInt(randX)] = REMOVAL_TOKEN
        // console.log(dumpGrid(grid))
        count++
      }
  }
  return grid
}

const removeInnerWalls = grid => {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      // If we ignore the edges...
      if (row > 0 && row < MAZE_HEIGHT - 1 && col > 0 && col < MAZE_WIDTH - 1) {
        // console.log('IF 1 INNER > ROW: ' + row + ', COL: ' + col)
        // ...and we consider only the inner edge...
        if (row === 1 || row === MAZE_HEIGHT - 2 || col === 1 || col === MAZE_WIDTH - 2) {
          // console.log('IF 2 INNER > ROW: ' + row + ', COL: ' + col)
          // ...and the block is a wall, make it a space
          if (grid[row][col] === WALL) {
            // console.log('REMOVE INNER > ROW: ' + row + ', COL: ' + col)
            grid[row][col] = REMOVAL_TOKEN
          }
        }
      }
    }
  }
}

const generateMazeGrid = () => {
  const grid = generateInitialMaze(MAZE_WIDTH, MAZE_HEIGHT)
  // console.log('RECURSIVE MAZE > FIRST LOAD EFFECT > INITIAL GRID:')
  // console.log(dump(grid))
  carveFrom(START_X, START_Y, grid)
  removeInnerWalls(grid)
  removeBridges(grid, MAX_BRIDGE_REMOVALS)
  addItems(grid, GHOST, MAX_GHOSTS)
  addItems(grid, PACMAN, MAX_PACMEN)
  addItems(grid, PELLET, MAX_PELLETS)
  return grid
}

const RecursiveBacktrackingMaze = props => {
  const classes = useStyles(props)

  const { seed, handleNewMazeGenerated } = props

  const [maze, setMaze] = useState([])

  useEffect(() => {
    console.log('RECURSIVE MAZE > FIRST LOAD EFFECT')
    const grid = generateMazeGrid()
    setMaze(grid)
    // setMaze(carved)
  }, [seed])

  useEffect(() => {
    handleNewMazeGenerated(maze)
  }, [maze, handleNewMazeGenerated])

  return (
    <div className={classes.root}>
      {maze.map((row, rowIndex) => {
        return (
          <div className={classes.mazeRow} key={rowIndex}>
            {maze[rowIndex].map((item, colIndex) => {
              switch (item) {
                case SPACE_TOKEN:
                case EAST:
                case WEST:
                case NORTH:
                case SOUTH:
                  return (
                    <div className={clsx(classes.mazeBlock, classes.mazeSpace)} key={colIndex}>
                      {/* {item} */}
                      &middot;
                    </div>
                  )
                case GHOST:
                  return (
                    <div className={clsx(classes.mazeBlock, classes.mazeGhost)} key={colIndex}>
                      {item}
                    </div>
                  )
                case PELLET:
                  return (
                    <div className={clsx(classes.mazeBlock, classes.mazePellet)} key={colIndex}>
                      {item}
                    </div>
                  )
                case PACMAN:
                  return (
                    <div className={clsx(classes.mazeBlock, classes.mazePacman)} key={colIndex}>
                      {item}
                    </div>
                  )
                case WALL:
                  return (
                    <div className={clsx(classes.mazeBlock, classes.mazeWall)} key={colIndex}>
                      {item}
                    </div>
                  )
                case REMOVAL_TOKEN:
                  return (
                    <div className={clsx(classes.mazeBlock, classes.mazeRemoval)} key={colIndex}>
                      &middot;
                    </div>
                  )
                default:
                  return (
                    <div className={clsx(classes.mazeBlock, classes.mazeError)} key={colIndex}>
                      {item}
                    </div>
                  )
              }
            })}
          </div>
        )
      })}
    </div>
  )
}

export { generateMazeGrid }

export default RecursiveBacktrackingMaze
