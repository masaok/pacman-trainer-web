import React, {
  useEffect,
  // useState
} from 'react'
import { Helmet } from 'react-helmet'

import { makeStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'

// import RecursiveBacktrackingMaze from '../../mazes/RecursiveBacktrackingMaze'

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

const Lobby = props => {
  const classes = useStyles(props)

  // const [seed, setSeed] = useState(Math.random())

  const lobbyCode = props.match.params['lobbyCode']

  useEffect(() => {
    console.log('TASK > FIRST LOAD EFFECT')
    // console.log('TASK > FIRST LOAD EFFECT > lobbyCode: ' + lobbyCode)
  }, [])

  // const handleNewMazeClick = () => {
  //   setSeed(Math.random())
  // }

  // const handleCreateNewLobbyClick = () => {}

  return (
    <div className={classes.root}>
      <Helmet>
        <title>Lobby {SITE_TITLE_POSTFIX}</title>
      </Helmet>
      <Typography variant="h3">Lobby: {lobbyCode}</Typography>
    </div>
  )
}

export default Lobby
