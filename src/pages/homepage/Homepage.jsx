import React, { useEffect, useState } from 'react'

import clsx from 'clsx'

import { Helmet } from 'react-helmet-async'

import { useHistory } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import {
  getLobbyMaze,
  getUserCount,
  postLobby,
  postLobbyMaze,
  postMaze,
  postUser,
  postUserLobby,
} from '../../api'

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

    // Panel Containers
    topPanels: {
      display: 'flex',
      flex: 1,
      margin: theme.spacing(2),
    },

    panelTitle: {
      fontWeight: 'bold',
      fontSize: 22,
      marginBottom: theme.spacing(2),
    },

    // Name Panel
    namePanel: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      padding: theme.spacing(3),
      alignItems: 'center',
      marginRight: theme.spacing(3),
    },

    // Join Lobby Panel
    joinLobbyPanel: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      padding: theme.spacing(3),
      alignItems: 'center',
      marginRight: theme.spacing(3),
    },

    panelInnerContainer: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
    },

    joinLobbyButtonContainer: {
      marginTop: theme.spacing(1),
    },

    // Real-time Stats Panel
    realTimeStatsPanel: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      padding: theme.spacing(3),
      alignItems: 'center',
      backgroundColor: theme.palette.grey[100],
    },

    // Maze Generation Panel (inside Create a Lobby)
    mazeGenerationPanel: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      padding: theme.spacing(3),
      marginBottom: theme.spacing(2),
      backgroundColor: theme.palette.grey[100],
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
      backgroundColor: 'white',
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

    createLobbyPanel: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
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

  // Validation
  // const [nameFieldError, setNameFieldError] = useState(false)
  const [nameFieldHelperText, setNameFieldHelperText] = useState('')
  // const [lobbyFieldError, setLobbyFieldError] = useState(false)
  const [lobbyFieldHelperText, setLobbyFieldHelperText] = useState('')

  // Database Status
  const [userCount, setUserCount] = useState(0)

  useEffect(() => {
    handleGenerateNewMazeClick()
  }, [])

  useEffect(() => {
    console.log('HOMEPAGE > USER COUNT EFFECT')

    const retrieveUserCount = async () => {
      try {
        const count = await getUserCount()
        // console.log('HOMEPAGE > USER COUNT EFFECT > userCount:')
        // console.log(count)
        setUserCount(count)
      } catch (err) {} // do nothing
    }

    const interval = setInterval(() => {
      retrieveUserCount()
    }, 2000)
    return () => clearInterval(interval)
  }, [lobbyCode])

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
    history.push(`/${lobby?.code}`) // API generates the lobby code

    const lobbyMaze = await postLobbyMaze({
      lobbyId: lobby.lobby_id,
      mazeId: maze.maze_id,
    })
    console.log('POST LOBBY MAZE > lobbyMaze:')
    console.log(lobbyMaze)
  }

  const handleJoinLobbyClick = async () => {
    // Validate Join Lobby Fields
    // Reset all helper texts first
    setNameFieldHelperText('')
    setLobbyFieldHelperText('')

    // Then, check for errors and return if at least one exists
    let errorsExist = false
    if (fieldValues.name === '') {
      setNameFieldHelperText('Display name is required')
      errorsExist = true
    }

    if (lobbyCode === '') {
      setLobbyFieldHelperText('Lobby code required')
      errorsExist = true
    }

    if (errorsExist) return

    // Fetch the Lobby by the code
    const lobbyMaze = await getLobbyMaze(lobbyCode)
    console.log('HANDLE JOIN LOBBY CLICK > lobbyMaze:')
    console.log(lobbyMaze)
    if (!lobbyMaze) throw new Error('lobbyMaze fetch failed')

    // Create the instructor user
    const payload = {
      name: fieldValues?.name,
      role: 'student',
    }

    // Insert the new User by name
    const user = await postUser(payload)
    console.log('HANDLE JOIN LOBBY CLICK > user:')
    console.log(user)
    if (!user) throw new Error('user creation failed')

    // Insert the User into the Lobby using the user_lobby table
    const userLobby = await postUserLobby({
      userId: user.user_id,
      lobbyId: lobbyMaze.lobby_id,
    })
    console.log('HANDLE JOIN LOBBY CLICK > userLobby:')
    console.log(userLobby)
    if (!user) throw new Error('userLobby row creation failed')

    // Redirect the User to the Lobby and display the maze and prompt
    console.log('HANDLE JOIN LOBBY CLICK > REDIRECT to lobby:')
    console.log(lobbyMaze.lobby_code)
    history.push(`/${lobbyMaze?.lobby_code}`)
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

      <div className={classes.topPanels}>
        {/* Name Panel */}
        <Paper className={classes.namePanel}>
          <Typography className={classes.panelTitle}>Your Name</Typography>
          <TextField
            className={clsx(classes.field, classes.nameField)}
            label="Type your display name"
            helperText={nameFieldHelperText}
            variant="outlined"
            size="small"
            name="name"
            value={fieldValues.name}
            onChange={handleFieldChange}
            error={Boolean(nameFieldHelperText)}
          />
        </Paper>

        {/* Join Lobby Panel */}
        <Paper className={classes.joinLobbyPanel}>
          <Typography className={classes.panelTitle}>Join a Lobby</Typography>
          <div className={classes.panelInnerContainer}>
            <TextField
              className={clsx(classes.field, classes.nameField)}
              label="Enter lobby code here"
              helperText={lobbyFieldHelperText}
              variant="outlined"
              size="small"
              name="lobbyCode"
              value={lobbyCode}
              onChange={handleLobbyCodeChange}
              error={Boolean(lobbyFieldHelperText)}
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
          </div>
        </Paper>

        {/* Real Time Stats Panel */}
        <Paper className={classes.realTimeStatsPanel}>
          <Typography className={classes.panelTitle}>Real-time Stats</Typography>
          <div className={classes.panelInnerContainer}>Users: {userCount}</div>
        </Paper>
      </div>

      {/* Create Lobby Panel */}
      <Paper className={classes.createLobbyPanel}>
        <Typography className={classes.panelTitle}>Create a Lobby</Typography>
        <div className={classes.panelInnerContainer}>
          <Paper className={classes.mazeGenerationPanel}>
            <div className={classes.mazeArea}>
              <div className={classes.mazeContainer}>
                <BlockMazeDisplay mazeString={mazeString} />
              </div>
              <div className={classes.mazeEditor}>
                <TextField
                  InputProps={{
                    classes: {
                      root: classes.mazeStringField, // override font size
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
        </div>
      </Paper>
    </div>
  )
}

export default Homepage
