import React, { useEffect, useState } from 'react'

import clsx from 'clsx'

import { makeStyles } from '@material-ui/core/styles'

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
  { name: 'BlockMazeDisplay' }
)

// const mazeString = `
// XXXXXXXXXXX
// X.........X
// X.XGX.X.X.X
// X....OX.O.X
// X.X.X.X.X.X
// X....OX.X.X
// X.XXX.X.X.X
// X.P.....G.X
// XXXXXXXXXXX
// `

const BlockMazeDisplay = props => {
  const classes = useStyles(props)

  const { mazeString } = props

  const [maze, setMaze] = useState([])

  useEffect(() => {
    const grid = []
    const lines = mazeString.split('\n')
    for (let i = 0; i < lines.length; i++) {
      const item = lines[i]
      grid.push(item.split(''))
    }
    setMaze(grid)
  }, [mazeString])

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

export default BlockMazeDisplay
