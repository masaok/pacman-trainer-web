import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'

import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import RandomMaze from './RandomMaze'
import RecursiveBacktrackingMaze from './RecursiveBacktrackingMaze'

import { APP_TITLE } from '../../constants'

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

    button: {
      marginTop: theme.spacing(3),
    },

    // Controls
    controlArea: {
      display: 'flex',
      flex: 1,
      marginTop: theme.spacing(3),
      justifyContent: 'center',
    },

    createLobbyArea: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      marginTop: theme.spacing(3),
    },
  }),
  { name: 'Homepage' }
)

const Homepage = props => {
  const classes = useStyles(props)

  const [seed, setSeed] = useState(Math.random())

  useEffect(() => {
    console.log('TASK > FIRST LOAD EFFECT')
  }, [])

  const handleNewMazeClick = () => {
    setSeed(Math.random())
  }

  const handleCreateNewLobbyClick = () => {}

  return (
    <div className={classes.root}>
      <Helmet>
        <title>{APP_TITLE}</title>
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
      <div className={classes.createLobbyArea}>
        <TextField
          label="Type your name here"
          helperText="Name will be displayed to other users"
          variant="outlined"
          size="small"
        />
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={handleCreateNewLobbyClick}
        >
          Create New Lobby
        </Button>
      </div>
    </div>
  )
}

export default Homepage
