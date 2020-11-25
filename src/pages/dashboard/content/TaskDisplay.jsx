import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'

import clsx from 'clsx'

import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'

import { SITE_TITLE_POSTFIX } from '../../../constants'

const useStyles = makeStyles(
  theme => ({
    root: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
    },

    mazeContainer: {
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
    },

    mazeWall: {
      backgroundColor: 'blue',
    },

    mazePacman: {
      backgroundColor: 'yellow',
    },

    mazeGhost: {
      backgroundColor: 'pink',
    },

    mazeError: {
      backgroundColor: 'red',
    },

    // Controls
    controlArea: {
      display: 'flex',
      flex: 1,
      marginTop: theme.spacing(3),
      justifyContent: 'center',
    },
  }),
  { name: 'TaskDisplay' }
)

const mockMaze = [
  ['X', 'X', 'X', 'X', 'X', 'X', 'X'],
  ['X', ' ', ' ', ' ', 'X', ' ', 'X'],
  ['X', ' ', 'X', 'G', 'X', ' ', 'X'],
  ['X', 'G', 'X', ' ', 'X', ' ', 'X'],
  ['X', ' ', 'X', ' ', 'X', 'G', 'X'],
  ['X', ' ', 'X', ' ', 'X', ' ', 'X'],
  ['X', 'P', ' ', ' ', ' ', ' ', 'X'],
  ['X', 'X', 'X', 'X', 'X', 'X', 'X'],
]

// Common tokens (Pacman and Ghosts are special)
const tokens = [
  'X', // wall
  ' ', // space
]

const maxGhosts = 3
const maxPacmen = 1

const TaskDisplay = props => {
  const classes = useStyles(props)

  const [maze, setMaze] = useState(mockMaze)

  useEffect(() => {
    console.log('TASK > FIRST LOAD EFFECT')
  }, [])

  const isTokenValid = (token, numGhosts, numPacmen) => {
    switch (token) {
      case 'G':
        return numGhosts < maxGhosts
      case 'P':
        return numPacmen < maxPacmen
      default:
        return true
    }
  }

  const generateNonRepeatingRandomNumbers = (howMany, maxNumber, invalid = []) => {
    const indexes = []
    for (let i = 0; i < howMany; i++) {
      while (true) {
        let index = Math.floor(Math.random() * maxNumber)
        if (!indexes.includes(index) && !invalid.includes(index)) {
          indexes.push(index)
          break
        }
      }
    }
    return indexes
  }

  const generateNewMaze = () => {
    const width = 7
    const height = 8

    const maxTokens = width * height

    // Generate evenly-distributed random ghost locations
    const ghostIndexes = generateNonRepeatingRandomNumbers(maxGhosts, maxTokens)
    console.log('GHOST INDEXES:')
    console.log(ghostIndexes)

    // Pacman cannot be placed on an existing ghost
    const pacmanIndexes = generateNonRepeatingRandomNumbers(maxPacmen, maxTokens, ghostIndexes)
    console.log('PACMAN INDEXES:')
    console.log(pacmanIndexes)

    let newMaze = []
    let numGhosts = 0
    let numPacmen = 0
    let currentIndex = 0
    for (let row = 0; row < height; row++) {
      let rowItems = []
      for (let col = 0; col < width; col++) {
        let token = null
        if (pacmanIndexes.includes(currentIndex)) {
          token = 'P'
        } else if (ghostIndexes.includes(currentIndex)) {
          token = 'G'
        } else {
          while (true) {
            token = tokens[Math.floor(Math.random() * tokens.length)]
            console.log('RANDOM TOKEN: ' + token)
            if (isTokenValid(token, numGhosts, numPacmen)) break
          }

          switch (token) {
            case 'X':
              break
            case ' ':
              break
            case 'P':
              numPacmen++
              break
            case 'G':
              numGhosts++
              break
            default:
              rowItems.push('E') // error
          }
        }
        rowItems.push(token)
        currentIndex++
      }
      newMaze.push(rowItems)
    }
    setMaze(newMaze)
  }

  return (
    <div className={classes.root}>
      <Helmet>
        <title>Task Display {SITE_TITLE_POSTFIX}</title>
      </Helmet>
      <div className={classes.mazeContainer}>
        {maze.map((row, rowIndex) => {
          return (
            <div className={classes.mazeRow}>
              {maze[rowIndex].map((item, colIndex) => {
                switch (item) {
                  case ' ':
                    return <div className={clsx(classes.mazeBlock, classes.mazeSpace)}>{item}</div>
                  case 'X':
                    return <div className={clsx(classes.mazeBlock, classes.mazeWall)}>{item}</div>
                  case 'P':
                    return <div className={clsx(classes.mazeBlock, classes.mazePacman)}>{item}</div>
                  case 'G':
                    return <div className={clsx(classes.mazeBlock, classes.mazeGhost)}>{item}</div>
                  default:
                    return <div className={clsx(classes.mazeBlock, classes.mazeError)}>{item}</div>
                }
              })}
            </div>
          )
        })}
      </div>
      <div className={classes.controlArea}>
        <Button variant="contained" color="primary" onClick={generateNewMaze}>
          GENERATE NEW MAZE
        </Button>
      </div>
    </div>
  )
}

export default TaskDisplay
