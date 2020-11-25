import React, {
  useEffect,
  // useState
} from 'react'
import { Helmet } from 'react-helmet'

import clsx from 'clsx'

import { makeStyles } from '@material-ui/core/styles'

import { SITE_TITLE_POSTFIX } from '../../../constants'

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

const TaskDisplay = props => {
  const classes = useStyles(props)

  useEffect(() => {
    console.log('TASK > FIRST LOAD EFFECT')
  }, [])

  return (
    <div className={classes.root}>
      <Helmet>
        <title>Task Display {SITE_TITLE_POSTFIX}</title>
      </Helmet>
      <div className={classes.mazeContainer}>
        {mockMaze.map((row, rowIndex) => {
          return (
            <div className={classes.mazeRow}>
              {mockMaze[rowIndex].map((item, colIndex) => {
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
    </div>
  )
}

export default TaskDisplay
