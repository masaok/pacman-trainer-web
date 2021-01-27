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

import { APP_TITLE, MAX_RELOADS } from '../../constants'

import { dumpGrid } from '../../common'

import { panelStyles } from '../../commonStyles'

// import RandomMaze from './RandomMaze'
import { generateMazeGrid } from '../../mazes/RecursiveBacktrackingMaze'
import BlockMazeDisplay from '../../mazes/views/BlockMazeDisplay'
import StatsPanel from '../common/StatsPanel'
import Footer from '../common/Footer'

const useStyles = makeStyles(
  theme => ({
    ...panelStyles(theme),

    root: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      // backgroundColor: theme.palette.primary.light,
      backgroundColor: '#7986CB', // light doesn't match for some reason
    },

    pageTitle: {
      color: 'white',
      fontSize: 40,
      fontFamily: ['Carter One', 'sans-serif'].join(','),
      textShadow: '3px 3px 4px #000',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },

    logoPaper: {
      // // backgroundImage: `url(${pacmanImitationLogoNarrow})`,
      // width: 200,
      // height: 200,
    },

    logoImage: {
      width: '100%',
      height: 'auto',
    },

    media: {
      height: 0,
      paddingTop: '50%',
    },

    // Panel Containers
    topPanels: {
      display: 'flex',
      flex: 1,
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

    homepageActionButton: {
      marginTop: theme.spacing(1),
      fontSize: 20,
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

    lobbyCodeField: {
      marginTop: theme.spacing(2),
    },

    numSamplesField: {
      maxWidth: 150,
    },

    createLobbyPanel: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(3),
      padding: theme.spacing(3),
    },

    requesterNameField: {
      marginRight: theme.spacing(2),
    },

    promptField: {
      marginRight: theme.spacing(2),
    },
  }),
  { name: 'Homepage' }
)

const Homepage = props => {
  const classes = useStyles(props)

  const { handleLobbyIdChange, handleUserIdChange } = props

  const history = useHistory()

  const [fieldValues, setFieldValues] = useState({
    name: '',
    requesterName: '',
    prompt: 'Choose the move that helps Pacman eat a ghost!',
    numSamples: '10',
  })

  const [mazeString, setMazeString] = useState('')
  const [lobbyCode, setLobbyCode] = useState('')

  // Validation
  // const [nameFieldError, setNameFieldError] = useState(false)
  const [nameFieldHelperText, setNameFieldHelperText] = useState('')
  const [requesterNameFieldHelperText, setRequesterNameFieldHelperText] = useState('')
  // const [lobbyFieldError, setLobbyFieldError] = useState(false)
  const [lobbyFieldHelperText, setLobbyFieldHelperText] = useState('')

  // Database Status
  const [userCount, setUserCount] = useState(0)
  const [refreshCount, setRefreshCount] = useState(0)

  // User Role Status
  // const [role, setRole] = useState('')

  useEffect(() => {
    handleGenerateNewMazeClick()
  }, [])

  useEffect(() => {
    const retrieveUserCount = async () => {
      try {
        const count = await getUserCount()
        setUserCount(count)
      } catch (err) {
        console.error(err)
      }
    }

    const interval = setInterval(() => {
      setRefreshCount(refreshes => {
        if (refreshes < MAX_RELOADS) {
          retrieveUserCount()
          return refreshes + 1
        } else {
          return refreshes > MAX_RELOADS ? MAX_RELOADS : refreshes
        }
      })
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

  // Create New Lobby Handler
  const handleCreateNewLobbyClick = async () => {
    // Check for errors and return on any error
    // (try/catch only allows for a single error)
    let errorsExist = false
    if (fieldValues.requesterName === '') {
      setRequesterNameFieldHelperText('Requester name is required')
      errorsExist = true
    }

    if (errorsExist) return

    // Create the instructor user
    const payload = {
      name: fieldValues?.requesterName,
      role: 'requester',
    }

    const user = await postUser(payload)
    if (!user) throw new Error('user creation failed')

    handleUserIdChange(user.user_id) // pass to parent

    const maze = await postMaze({
      string: mazeString,
    })
    if (!maze) throw new Error('maze creation failed')

    const lobby = await postLobby({
      prompt: fieldValues.prompt,
      numSamples: fieldValues.numSamples,
      createdBy: user.user_id,
    })
    if (!lobby) throw new Error('lobby creation failed')
    handleLobbyIdChange(lobby.lobby_id) // pass to parent

    await postLobbyMaze({
      lobbyId: lobby.lobby_id,
      mazeId: maze.maze_id,
    })

    // Redirect to the lobby
    // history.push(`/${lobby?.code}`) // API generates the lobby code
    history.push(`/r/${lobby?.hash}`) // API generates the lobby code
  }

  const handleJoinLobbyClick = async () => {
    // Validate Join Lobby Fields
    // Reset all helper texts first
    setNameFieldHelperText('')
    setLobbyFieldHelperText('')

    // Then, check for errors and return on any error
    // try/catch only allows for a single error
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
    if (!lobbyMaze) throw new Error('lobbyMaze fetch failed')
    handleLobbyIdChange(lobbyMaze.lobby_id)

    // Create the worker user
    const payload = {
      name: fieldValues?.name,
      role: 'worker',
    }

    // Insert the new User by name
    const user = await postUser(payload)
    if (!user) throw new Error('user creation failed')
    handleUserIdChange(user.user_id)

    // Insert the User into the Lobby using the user_lobby table
    const userLobby = await postUserLobby({
      userId: user.user_id,
      lobbyId: lobbyMaze.lobby_id,
    })
    if (!userLobby) throw new Error('userLobby creation failed')
    if (!user) throw new Error('userLobby row creation failed')

    // Redirect the User to the Lobby and display the maze and prompt
    const redirectPath = `/w/${userLobby?.hash}`
    history.push(redirectPath)
  }

  const handleRefreshStatsClick = () => {
    setRefreshCount(0)
  }

  // Field Handlers
  const handleFieldChange = event => {
    const newValues = { ...fieldValues, [event.target.name]: event.target.value }
    setFieldValues(newValues)
  }

  const handleLobbyCodeChange = event => {
    setLobbyCode(event.target.value)
  }

  const handleLobbyCodeKeyPress = event => {
    if (event.key === 'Enter') {
      return handleJoinLobbyClick()
    }
  }

  // Text Maze Handlers
  const handleTextMazeChange = event => {
    setMazeString(event.target.value)
  }

  return (
    <div className={classes.root}>
      <Helmet>
        <title>{APP_TITLE}</title>
      </Helmet>
      <Typography variant="h2" className={classes.pageTitle}>
        {APP_TITLE}
      </Typography>

      <div className={classes.topPanels}>
        {/* Join Lobby Panel */}
        <Paper className={classes.joinLobbyPanel}>
          <Typography className={classes.panelTitle}>Join a Lobby</Typography>
          <TextField
            className={clsx(classes.field, classes.nameField)}
            label="Worker name"
            helperText={nameFieldHelperText}
            variant="outlined"
            size="small"
            name="name"
            value={fieldValues.name}
            onChange={handleFieldChange}
            error={Boolean(nameFieldHelperText)}
          />
          <div className={classes.panelInnerContainer}>
            <TextField
              className={clsx(classes.field, classes.lobbyCodeField)}
              label="Enter lobby code here"
              helperText={lobbyFieldHelperText}
              variant="outlined"
              size="small"
              name="lobbyCode"
              value={lobbyCode}
              onChange={handleLobbyCodeChange}
              onKeyPress={handleLobbyCodeKeyPress} // allow submit with Enter key
              error={Boolean(lobbyFieldHelperText)}
            />
            <div className={classes.joinLobbyButtonContainer}>
              <Button
                className={classes.homepageActionButton}
                variant="contained"
                color="primary"
                onClick={handleJoinLobbyClick}
                type="submit"
              >
                Join Lobby
              </Button>
            </div>
          </div>
        </Paper>

        {/* Real Time Stats Panel */}
        <div>
          <StatsPanel
            userCount={userCount}
            refreshCount={refreshCount}
            handleRefreshStatsClick={handleRefreshStatsClick}
          />
        </div>
      </div>

      {/* Create Lobby Panel */}
      <Paper className={classes.createLobbyPanel}>
        <Typography className={classes.panelTitle}>Lobby Creation Panel</Typography>
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
              className={clsx(classes.field, classes.requesterNameField)}
              label="Requester Name"
              helperText={requesterNameFieldHelperText}
              variant="outlined"
              size="small"
              name="requesterName"
              value={fieldValues.requesterName}
              onChange={handleFieldChange}
              error={Boolean(requesterNameFieldHelperText)}
            />
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
              className={classes.homepageActionButton}
              variant="contained"
              color="primary"
              onClick={handleCreateNewLobbyClick}
              size="large"
            >
              Create New Lobby
            </Button>
          </div>
        </div>
      </Paper>
      <Footer />
    </div>
  )
}

export default Homepage
