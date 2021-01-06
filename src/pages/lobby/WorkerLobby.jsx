import React, { useEffect, useState } from 'react'

import { Helmet } from 'react-helmet-async'

import { makeStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'

// import RecursiveBacktrackingMaze from '../../mazes/RecursiveBacktrackingMaze'
import BlockMazeDisplay from '../../mazes/views/BlockMazeDisplay'

import { getLobbyMaze } from '../../api'

import { SITE_TITLE_POSTFIX } from '../../constants'

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
  { name: 'Lobby' }
)

const WorkerLobby = props => {
  const classes = useStyles(props)

  // const [seed, setSeed] = useState(Math.random())

  const lobbyCode = props.match.params['lobbyCode']

  const [mazeString, setMazeString] = useState('')
  const [prompt, setPrompt] = useState('')
  const [numSamples, setNumSamples] = useState('')

  useEffect(() => {
    console.log('TASK > LOBBY CODE EFFECT')

    // console.log('TASK > FIRST LOAD EFFECT > lobbyCode: ' + lobbyCode)

    const retrieveLobbyMaze = async () => {
      try {
        if (lobbyCode) {
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

  // const handleNewMazeClick = () => {
  //   setSeed(Math.random())
  // }

  // const handleCreateNewLobbyClick = () => {}

  return (
    <div className={classes.root}>
      <Helmet>
        <title>Worker Lobby {SITE_TITLE_POSTFIX}</title>
      </Helmet>
      <Typography variant="h3">Lobby: {lobbyCode}</Typography>
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

export default WorkerLobby
