import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import { Helmet } from 'react-helmet-async'

import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

// import RecursiveBacktrackingMaze from '../../mazes/RecursiveBacktrackingMaze'
import BlockMazeDisplay from '../../mazes/views/BlockMazeDisplay'

import { getLobbyMaze, getNumUsersInLobby } from '../../api'

import { MAX_RELOADS, SITE_TITLE_POSTFIX } from '../../constants'

import { panelStyles } from '../../commonStyles'

const useStyles = makeStyles(
  theme => ({
    ...panelStyles(theme),

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
  { name: 'Lobby' }
)

const Lobby = props => {
  const classes = useStyles(props)

  const { currentUser, currentLobby } = props

  // const [seed, setSeed] = useState(Math.random())

  const lobbyCode = props.match.params['lobbyCode']

  const [mazeString, setMazeString] = useState('')
  const [prompt, setPrompt] = useState('')
  const [numSamples, setNumSamples] = useState('')

  const [numUsersInLobby, setNumUsersInLobby] = useState(0)
  const [refreshCount, setRefreshCount] = useState(0)

  useEffect(() => {
    console.log('TASK > LOBBY CODE EFFECT')

    // console.log('TASK > FIRST LOAD EFFECT > lobbyCode: ' + lobbyCode)

    const retrieveLobbyMaze = async () => {
      try {
        if (lobbyCode) {
          console.log('TASK > LOBBY CODE EFFECT > lobbyCode: ' + lobbyCode)
          const maze = await getLobbyMaze(lobbyCode)
          console.log('TASK > LOBBY CODE EFFECT > RETRIEVE > maze:')
          console.log(maze)
          setMazeString(maze.maze_string)
          setPrompt(maze.lobby_prompt)
          setNumSamples(maze.num_samples)
        }
      } catch (err) {} // do nothing
    }
    retrieveLobbyMaze()
  }, [lobbyCode])

  // Real-time Stats Effect
  useEffect(() => {
    console.log('HOMEPAGE > USER COUNT EFFECT')

    const retrieveNumUsersInLobby = async () => {
      try {
        const count = await getNumUsersInLobby(lobbyCode)
        // console.log('HOMEPAGE > USER COUNT EFFECT > userCount:')
        // console.log(count)
        setNumUsersInLobby(count)
      } catch (err) {} // do nothing
    }

    const interval = setInterval(() => {
      setRefreshCount(refreshes => {
        if (refreshes < MAX_RELOADS) {
          console.log('REFRESH COUNT: ' + (refreshes + +1))
          retrieveNumUsersInLobby()
          return refreshes + 1
        } else {
          return refreshes > MAX_RELOADS ? MAX_RELOADS : refreshes
        }
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [lobbyCode])

  // const handleNewMazeClick = () => {
  //   setSeed(Math.random())
  // }

  // const handleCreateNewLobbyClick = () => {}

  // Click Handlers
  const handleRefreshStatsClick = () => {
    setRefreshCount(0)
  }

  return (
    <div className={classes.root}>
      <Helmet>
        <title>Lobby {SITE_TITLE_POSTFIX}</title>
      </Helmet>
      <Button component={Link} to="/">
        Homepage
      </Button>
      <Typography variant="h3">Lobby: {lobbyCode}</Typography>
      <Typography variant="h3">Creator: {currentLobby?.creator_name}</Typography>
      <Typography variant="h4">Your user id is: {currentUser?.user_id}</Typography>
      <Typography variant="h5">Your role is: {currentUser?.role}</Typography>

      {/* Real Time Stats Panel */}
      <Paper className={classes.realTimeStatsPanel}>
        <Typography className={classes.panelTitle}>Real-time Stats</Typography>
        <div className={classes.panelInnerContainer}>
          Workers in this Lobby: {numUsersInLobby}
          <br />
          Refreshes: {refreshCount} / {MAX_RELOADS}
          <br />
          <Button
            className={classes.refreshStatsButton}
            variant="contained"
            color="primary"
            onClick={handleRefreshStatsClick}
          >
            Reload Stats
          </Button>
        </div>
      </Paper>

      <div className={classes.mazeContainer}>
        <BlockMazeDisplay mazeString={mazeString} />
      </div>
      <div className={classes.promptContainer}>
        <Typography>{prompt}</Typography>
      </div>
      <div className={classes.samplesContainer}>
        <Typography>{numSamples} samples per worker</Typography>
      </div>
    </div>
  )
}

export default Lobby
