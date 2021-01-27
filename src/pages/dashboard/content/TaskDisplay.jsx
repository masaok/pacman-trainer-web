import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'

import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'

// import RandomMaze from '../../../mazes/RandomMaze'
import RecursiveBacktrackingMaze from '../../../mazes/RecursiveBacktrackingMaze'

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
      marginTop: theme.spacing(3),
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

const TaskDisplay = props => {
  const classes = useStyles(props)

  const [seed, setSeed] = useState(Math.random())

  const handleNewMazeClick = () => {
    setSeed(Math.random())
  }

  return (
    <div className={classes.root}>
      <Helmet>
        <title>Task Display {SITE_TITLE_POSTFIX}</title>
      </Helmet>
      {/* <div className={classes.mazeContainer}>
        <RandomMaze seed={seed} />
      </div> */}
      <div className={classes.mazeContainer}>
        <RecursiveBacktrackingMaze seed={seed} />
      </div>
      <div className={classes.controlArea}>
        <Button variant="contained" color="primary" onClick={handleNewMazeClick}>
          GENERATE NEW MAZE
        </Button>
      </div>
    </div>
  )
}

export default TaskDisplay
