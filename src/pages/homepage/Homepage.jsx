import React, { useEffect, useState } from 'react'

import clsx from 'clsx'

import { Helmet } from 'react-helmet-async'

import { useHistory } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import { postLobby, postLobbyMaze, postMaze, postUser } from '../../api'

// import RandomMaze from './RandomMaze'
import { generateMazeGrid } from '../../mazes/RecursiveBacktrackingMaze'
import BlockMazeDisplay from '../../mazes/views/BlockMazeDisplay'

import { APP_TITLE } from '../../constants'

import { dumpGrid } from '../../common/helpers'

const useStyles = makeStyles(
  theme => ({
    root: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      // backgroundColor: theme.palette.grey[200],
      backgroundColor: theme.palette.primary.light,
    },

    // Maze Display styles
    mazeGenerationPanel: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      padding: theme.spacing(3),
      margin: theme.spacing(1),
    },

    mazeArea: {
      display: 'flex',
      flex: 1,
      alignItems: 'center',
    },

    mazeContainer: {
      display: 'flex',
      flex: 1,
    },

    mazeEditor: {
      display: 'flex',
      flex: 1,
      margin: theme.spacing(3),
    },

    mazeStringField: {
      // fontFamily: ['Roboto', 'sans-serif'].join(','),
      // fontFamily: ['Open Sans', 'sans-serif'].join(','),
      fontFamily: ['monospace'].join(','),
      fontSize: 25,
    },

    button: {
      marginTop: theme.spacing(3),
    },

    // Controls
    mazeControlArea: {
      display: 'flex',
      flex: 1,
      justifyContent: 'center',
      paddingTop: theme.spacing(3),
    },

    // Name Panel
    namePanel: {
      display: 'flex',
      flex: 1,
      padding: theme.spacing(3),
    },

    // Lobby Fields
    formFields: {
      display: 'flex',
    },

    field: {
      margin: theme.spacing(1),
    },

    numSamplesField: {
      maxWidth: 140,
    },

    // Join Lobby Panel
    joinLobbyPanel: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: theme.spacing(3),
      padding: theme.spacing(3),
    },

    joinLobbyButtonContainer: {
      marginTop: theme.spacing(1),
    },

    createLobbyPanel: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: theme.spacing(3),
      padding: theme.spacing(3),
    },
  }),
  { name: 'Homepage' }
)

const Homepage = props => {
  const classes = useStyles(props)

  const history = useHistory()

  const [fieldValues, setFieldValues] = useState({
    name: 'Mock Name',
    prompt: 'Mock Prompt',
    numSamples: '10',
  })

  const [mazeString, setMazeString] = useState('')
  const [lobbyCode, setLobbyCode] = useState('')

  useEffect(() => {
    handleGenerateNewMazeClick()
  }, [])

  // Click Handlers
  const handleGenerateNewMazeClick = () => {
    const grid = generateMazeGrid()
    const string = dumpGrid(grid, { stringify: false })
    setMazeString(string)
    // setSeed(Math.random())
  }

  const handleCreateNewLobbyClick = async () => {
    console.log('HOMEPAGE > HANDLE CREATE NEW LOBBY CLICK')
    console.log('HOMEPAGE > HANDLE CREATE NEW LOBBY CLICK > fieldValues:')
    console.log(fieldValues)

    // Create the instructor user
    const payload = {
      name: fieldValues?.name,
      role: 'instructor',
    }

    const user = await postUser(payload)
    console.log('POST USER > user:')
    console.log(user)
    if (!user) throw new Error('user creation failed')

    const maze = await postMaze({
      string: mazeString,
    })
    console.log('POST MAZE > maze:')
    console.log(maze)
    if (!maze) throw new Error('maze creation failed')

    const lobby = await postLobby({
      prompt: fieldValues.prompt,
      numSamples: fieldValues.numSamples,
      createdBy: user.user_id,
    })
    if (!lobby) throw new Error('lobby creation failed')
    console.log('POST LOBBY > lobby:')
    console.log(lobby)
    history.push(`/${lobby?.code}`)

    const lobbyMaze = await postLobbyMaze({
      lobbyId: lobby.lobby_id,
      mazeId: maze.maze_id,
    })
    console.log('POST LOBBY MAZE > lobbyMaze:')
    console.log(lobbyMaze)
  }

  const handleJoinLobbyClick = async () => {
    // Create the instructor user
    const payload = {
      name: fieldValues?.name,
      role: 'student',
    }

    const user = await postUser(payload)
    console.log('POST USER > user:')
    console.log(user)
    if (!user) throw new Error('user creation failed')
  }

  // Field Handlers
  const handleFieldChange = event => {
    const newValues = { ...fieldValues, [event.target.name]: event.target.value }
    setFieldValues(newValues)
  }

  const handleLobbyCodeChange = event => {
    setLobbyCode(event.target.value)
  }

  // Text Maze Handlers
  const handleTextMazeChange = event => {
    console.log('HANDLE TEXT MAZE CHANGE > event:')
    console.log(event.target.value)
    setMazeString(event.target.value)
  }

  // console.log('MAZE STRING: ' + mazeString)
  // console.log('FIELD VALUES: ')
  // console.log(fieldValues)

  return (
    <div className={classes.root}>
      <Helmet>
        <title>{APP_TITLE}</title>
      </Helmet>
      <Typography variant="h2">{APP_TITLE}</Typography>
      <Paper className={classes.mazeGenerationPanel}>
        <div className={classes.mazeArea}>
          <div className={classes.mazeContainer}>
            <BlockMazeDisplay mazeString={mazeString} />
          </div>
          <div className={classes.mazeEditor}>
            <TextField
              InputProps={{
                classes: {
                  root: classes.mazeStringField, // overrride font size
                },
              }}
              label="Maze Editor"
              variant="outlined"
              size="small"
              name="maze"
              value={mazeString}
              onChange={handleTextMazeChange}
              multiline
              rows={10}
            />
          </div>
        </div>
        <div className={classes.mazeControlArea}>
          <Button variant="contained" color="primary" onClick={handleGenerateNewMazeClick}>
            GENERATE NEW MAZE
          </Button>
        </div>
      </Paper>

      {/* Name Panel */}
      <Paper className={classes.namePanel}>
        <TextField
          className={clsx(classes.field, classes.nameField)}
          label="Type your name here"
          helperText="Name will be displayed to other users"
          variant="outlined"
          size="small"
          name="name"
          value={fieldValues.name}
          onChange={handleFieldChange}
        />
      </Paper>

      {/* Join Lobby Panel */}
      <Paper className={classes.joinLobbyPanel}>
        <TextField
          className={clsx(classes.field, classes.nameField)}
          label="Enter lobby code here"
          variant="outlined"
          size="small"
          name="lobbyCode"
          value={lobbyCode}
          onChange={handleLobbyCodeChange}
        />
        <div className={classes.joinLobbyButtonContainer}>
          <Button
            className={classes.joinLobbyButton}
            variant="contained"
            color="primary"
            onClick={handleJoinLobbyClick}
          >
            Join Lobby
          </Button>
        </div>
      </Paper>

      {/* Create Lobby Panel */}
      <Paper className={classes.createLobbyPanel}>
        <div className={classes.formFields}>
          <TextField
            className={clsx(classes.field, classes.promptField)}
            label="Worker Prompt"
            helperText="Instructions for your workers to follow"
            variant="outlined"
            size="small"
            name="prompt"
            placeholder="Choose the move that helps Pacman survive"
            value={fieldValues.prompt}
            onChange={handleFieldChange}
            multiline
            rows={2}
          />
          <TextField
            className={clsx(classes.field, classes.numSamplesField)}
            label="# of Samples"
            helperText="How many samples do you want each worker to handle?"
            variant="outlined"
            size="small"
            name="numSamples"
            placeholder="10"
            value={fieldValues.numSamples}
            onChange={handleFieldChange}
          />
        </div>
        <div className={classes.createLobbyButtonContainer}>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={handleCreateNewLobbyClick}
          >
            Create New Lobby
          </Button>
        </div>
      </Paper>
    </div>
  )
}

export default Homepage
