import React, { useEffect, useState } from 'react'

import { Helmet } from 'react-helmet-async'

import { CSVLink } from 'react-csv'

import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'

import WorkerLobby from './WorkerLobby'

import BlockMazeDisplay from '../../mazes/views/BlockMazeDisplay'
import StatsBar from '../common/StatsBar'

import {
  getLobbyMazeByHash,
  getUserLobbyMazeByHash,
  getUserLobbyMazeByLobbyId,
  getNumUsersInLobby,
} from '../../api'

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

    // Workspace Parts
    workspaceMiddle: {
      display: 'flex',
      flex: 1,
      justifyContent: 'center',
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

    // Worker Table
    cullSamplesLink: {
      color: 'white',
      textDecoration: 'none',
    },
  }),
  { name: 'Lobby' }
)

const Lobby = props => {
  const classes = useStyles(props)

  const { handleLobbyIdChange, handleUserIdChange } = props

  const lobbyHashParam = props.match.params['lobbyHash']
  const userLobbyHashParam = props.match.params['userLobbyHash']

  const [lobbyId, setLobbyId] = useState('')
  const [lobbyCode, setLobbyCode] = useState('')

  const [userId, setUserId] = useState(null)
  const [userName, setUserName] = useState('')
  const [userRole, setUserRole] = useState('')

  const [mazeString, setMazeString] = useState('')
  const [prompt, setPrompt] = useState('')
  const [numSamples, setNumSamples] = useState('')

  const [numUsersInLobby, setNumUsersInLobby] = useState(0)
  const [workers, setWorkers] = useState([])
  const [refreshCount, setRefreshCount] = useState(0)

  // lobbyHashParam Effect (Requester)
  useEffect(() => {
    console.log('LOBBY HASH EFFECT')

    const retrieveLobbyMaze = async () => {
      try {
        if (lobbyHashParam) {
          console.log('LOBBY HASH EFFECT > lobbyHashParam: ' + lobbyHashParam)
          const maze = await getLobbyMazeByHash(lobbyHashParam)
          console.log('LOBBY HASH EFFECT > RETRIEVE > maze:')
          console.log(maze)
          setMazeString(maze.maze_string)
          setPrompt(maze.lobby_prompt)
          setNumSamples(maze.num_samples)

          // Set local values based on URL params
          setLobbyId(maze.lobby_id)
          setLobbyCode(maze.lobby_code)

          setUserId(maze.creator_id)
          setUserName(maze.creator_name)
          setUserRole(maze.creator_role)

          // Set the App Lobby and User based on the URL (allows browser reloading)
          handleLobbyIdChange(maze.lobby_id)
          handleUserIdChange(maze.creator_id)
        }
      } catch (err) {
        console.error(err)
      }
    }
    retrieveLobbyMaze()
  }, [lobbyHashParam])

  // User Lobby Hash Effect (Worker)
  useEffect(() => {
    console.log('USER LOBBY HASH EFFECT')

    const retrieveUserLobbyMaze = async () => {
      try {
        // if (!lobbyHashParam) throw new Error('lobbyHashParam missing')
        if (userLobbyHashParam) {
          console.log('USER LOBBY HASH EFFECT > lobbyHashParam: ' + lobbyHashParam)
          const maze = await getUserLobbyMazeByHash(userLobbyHashParam)
          console.log('USER LOBBY HASH EFFECT > RETRIEVE > maze:')
          console.log(maze)
          setMazeString(maze.maze_string)
          setPrompt(maze.lobby_prompt)
          setNumSamples(maze.num_samples)

          // Set local values based on URL params
          setLobbyId(maze.lobby_id)
          setLobbyCode(maze.lobby_code)

          setUserId(maze.user_id)
          setUserName(maze.user_name)
          setUserRole(maze.user_role)

          // Set the App Lobby and User based on the URL (allows browser reloading)
          handleLobbyIdChange(maze.lobby_id)
          handleUserIdChange(maze.creator_id)
        }
      } catch (err) {
        console.error(err)
      }
    }
    retrieveUserLobbyMaze()
  }, [userLobbyHashParam])

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

    const retrieveLobbyUsersAndActions = async () => {
      try {
        if (lobbyId) {
          const usersInLobby = await getUserLobbyMazeByLobbyId(lobbyId)
          setWorkers(usersInLobby)
        }
      } catch (err) {
        console.error(err)
      }
    }

    const interval = setInterval(() => {
      setRefreshCount(refreshes => {
        if (refreshes < MAX_RELOADS) {
          console.log('REFRESH COUNT: ' + (refreshes + +1))
          retrieveNumUsersInLobby()
          retrieveLobbyUsersAndActions()
          return refreshes + 1
        } else {
          return refreshes > MAX_RELOADS ? MAX_RELOADS : refreshes
        }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [lobbyCode])

  // Click Handlers
  const handleRefreshStatsClick = () => {
    setRefreshCount(0)
  }

  const handleMazeStringChange = mazeString => {
    setMazeString(mazeString)
  }

  // const handleCullSamplesClick = userLobbyActions => {
  //   console.log(userLobbyActions)

  //   const data = []
  //   for (let i = 0; i < userLobbyActions.length; i++) {
  //     const action = userLobbyActions[i]
  //     data.push([action.boardState, action.action])
  //   }
  //   console.log(data)

  //   return <CSVDownload data={data} target="_blank" />
  // }

  return (
    <div className={classes.root}>
      {/* {currentUser?.role === 'requester' ? ( */}
      {lobbyHashParam ? (
        <>
          <Helmet>
            <title>Requester Lobby {SITE_TITLE_POSTFIX}</title>
          </Helmet>
          <StatsBar
            className={classes.statsBar}
            lobbyId={lobbyId}
            lobbyCode={lobbyCode}
            userId={userId}
            userName={userName}
            userRole={userRole}
            numUsersInLobby={numUsersInLobby}
            refreshCount={refreshCount}
            handleRefreshStatsClick={handleRefreshStatsClick}
          />
          <div className={classes.mazeContainer}>
            <BlockMazeDisplay mazeString={mazeString} />
          </div>
          <div className={classes.workspaceMiddle}>
            <div className={classes.promptContainer}>
              <Typography>
                <strong>Prompt:</strong> {prompt}
              </Typography>
            </div>
          </div>
          <div className={classes.workerTable}>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Worker ID</TableCell>
                    <TableCell>Worker Name</TableCell>
                    <TableCell>Samples Completed</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {workers.map((worker, index) => {
                    const actions = worker.user_lobby_actions

                    const data = []
                    for (let i = 0; i < actions?.length; i++) {
                      const action = actions[i]
                      data.push([action.boardState, action.action])
                    }

                    return (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row" align="center">
                          {worker.user_id}
                        </TableCell>
                        <TableCell align="left">{worker.user_name}</TableCell>
                        <TableCell align="center">
                          {actions ? `${actions?.length} / ${numSamples}` : '-'}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            className={classes.cullSamplesButton}
                            variant="contained"
                            color="primary"
                            size="small"
                          >
                            <CSVLink
                              className={classes.cullSamplesLink}
                              data={data}
                              filename="samples.csv"
                            >
                              Cull Samples
                            </CSVLink>
                          </Button>
                          {/* <CSVDownload data={data} target="_blank" label="hi" /> */}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </>
      ) : (
        <WorkerLobby
          lobbyId={lobbyId}
          lobbyCode={lobbyCode}
          // currentLobby={currentLobby}
          // currentUser={currentUser}
          userId={userId}
          userName={userName}
          userRole={userRole}
          numUsersInLobby={numUsersInLobby}
          refreshCount={refreshCount}
          handleRefreshStatsClick={handleRefreshStatsClick}
          mazeString={mazeString}
          prompt={prompt}
          numSamples={numSamples}
          handleMazeStringChange={handleMazeStringChange}
          // {...props}
        />
      )}
    </div>
  )
}

export default Lobby
