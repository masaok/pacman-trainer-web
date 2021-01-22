import React, { useEffect, useState } from 'react'

import { Helmet } from 'react-helmet-async'

import { makeStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'

import WorkerLobby from './WorkerLobby'

import BlockMazeDisplay from '../../mazes/views/BlockMazeDisplay'
import StatsBar from '../common/StatsBar'

import { getLobbyMaze, getLobbyMazeByHash, getNumUsersInLobby } from '../../api'

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

  const { currentUser, currentLobby, handleLobbyIdChange, handleUserIdChange } = props

  // const [seed, setSeed] = useState(Math.random())

  const lobbyCode = props.match.params['lobbyCode']
  const lobbyHash = props.match.params['lobbyHash']

  const [mazeString, setMazeString] = useState('')
  const [prompt, setPrompt] = useState('')
  const [numSamples, setNumSamples] = useState('')

  const [numUsersInLobby, setNumUsersInLobby] = useState(0)
  const [refreshCount, setRefreshCount] = useState(0)

  // Lobby Hash Effect (Requester)
  useEffect(() => {
    console.log('LOBBY HASH EFFECT')

    const retrieveLobbyMaze = async () => {
      try {
        if (!lobbyHash) throw new Error('lobbyHash missing')
        console.log('LOBBY HASH EFFECT > lobbyHash: ' + lobbyHash)
        const maze = await getLobbyMazeByHash(lobbyHash)
        console.log('LOBBY HASH EFFECT > RETRIEVE > maze:')
        console.log(maze)
        setMazeString(maze.maze_string)
        setPrompt(maze.lobby_prompt)
        setNumSamples(maze.num_samples)

        // Set the App Lobby and User based on the URL (allows browser reloading)
        handleLobbyIdChange(maze.lobby_id)
        handleUserIdChange(maze.creator_id)
      } catch (err) {
        console.error(err)
      }
    }
    retrieveLobbyMaze()
  }, [lobbyHash])

  // Lobby Code Effect (Worker)
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
      } catch (err) {
        console.error(err)
      }
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
      } catch (err) {
        console.error(err)
      }
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

  // Click Handlers
  const handleRefreshStatsClick = () => {
    setRefreshCount(0)
  }

  return (
    <div className={classes.root}>
      {/* {currentUser?.role === 'requester' ? ( */}
      {lobbyHash ? (
        <>
          <Helmet>
            <title>Lobby {SITE_TITLE_POSTFIX}</title>
          </Helmet>
          <StatsBar
            className={classes.statsBar}
            lobbyCode={lobbyCode}
            numUsersInLobby={numUsersInLobby}
            refreshCount={refreshCount}
            handleRefreshStatsClick={handleRefreshStatsClick}
          />
          <Typography variant="h3">Creator Name: {currentLobby?.creator_name}</Typography>
          <Typography variant="h4">Your user id is: {currentUser?.user_id}</Typography>
          <Typography variant="h5">Your role is: {currentUser?.role}</Typography>

          <div className={classes.mazeContainer}>
            <BlockMazeDisplay mazeString={mazeString} />
          </div>
          <div className={classes.promptContainer}>
            <Typography>{prompt}</Typography>
          </div>
          <div className={classes.samplesContainer}>
            <Typography>{numSamples} samples per worker</Typography>
          </div>
        </>
      ) : (
        <WorkerLobby
          lobbyCode={lobbyCode}
          currentLobby={currentLobby}
          currentUser={currentUser}
          numUsersInLobby={numUsersInLobby}
          refreshCount={refreshCount}
          handleRefreshStatsClick={handleRefreshStatsClick}
          mazeString={mazeString}
          prompt={prompt}
          numSamples={numSamples}
          // {...props}
        />
      )}
    </div>
  )
}

export default Lobby
