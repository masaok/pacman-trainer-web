import React, { useEffect, useState } from 'react'

import clsx from 'clsx'

import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'

import pacmanImage from '../../assets/images/pacman-542x571.png'
import ghostImage from '../../assets/images/ghost-red-980x980.png'

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
      backgroundColor: 'black',
      color: 'white',
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

    // Sprites (Pacman, Ghosts, Walls, etc.)
    spriteContainer: {
      display: 'flex',
      flex: 1,
      backgroundColor: 'black',
      padding: theme.spacing(1),
      justifyContent: 'center',
      alignItems: 'center',
    },

    sprite: {
      width: '100%',
      height: 'auto',
    },

    pellet: {
      fontSize: 100,
    },
  }),
  { name: 'BlockMazeDisplay' }
)

const BlockMazeDisplay = props => {
  const classes = useStyles(props)

  const { mazeString } = props

  const [maze, setMaze] = useState([])
  const [debug] = useState(false)

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
                      &middot;
                    </div>
                  )
                case GHOST:
                  return (
                    <div
                      className={clsx(classes.mazeBlock, debug ? classes.mazeGhost : null)}
                      key={colIndex}
                    >
                      {debug ? (
                        item
                      ) : (
                        <div className={classes.spriteContainer}>
                          <img className={classes.sprite} src={ghostImage} alt="ghost" />
                        </div>
                      )}
                    </div>
                  )
                case PELLET:
                  return (
                    <div
                      className={clsx(classes.mazeBlock, debug ? classes.mazePellet : null)}
                      key={colIndex}
                    >
                      {debug ? item : <div className={classes.pellet}>&middot;</div>}
                    </div>
                  )
                case PACMAN:
                  return (
                    <div className={classes.mazeBlock} key={colIndex}>
                      <div className={classes.spriteContainer}>
                        <img className={classes.sprite} src={pacmanImage} alt="pacman" />
                      </div>
                    </div>
                  )
                case WALL:
                  return (
                    <div className={clsx(classes.mazeBlock, classes.mazeWall)} key={colIndex}>
                      {debug ? item : <>&nbsp;</>}
                    </div>
                  )
                case REMOVAL_TOKEN:
                  return (
                    <div className={clsx(classes.mazeBlock, classes.mazeRemoval)} key={colIndex}>
                      &middot;
                    </div>
                  )
                default:
                  return <div key={colIndex}></div> // ignore bad/unknown characters like newline chars
              }
            })}
          </div>
        )
      })}
    </div>
  )
}

BlockMazeDisplay.propTypes = {
  mazeString: PropTypes.string.isRequired,
}

export default BlockMazeDisplay
