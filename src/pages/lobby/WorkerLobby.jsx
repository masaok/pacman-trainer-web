import React, { useEffect, useState } from 'react'

import PropTypes from 'prop-types'

import { Helmet } from 'react-helmet-async'

import { makeStyles } from '@material-ui/core/styles'

import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'

import BlockMazeDisplay from '../../mazes/views/BlockMazeDisplay'
import StatsBar from '../common/StatsBar'

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'

import { SITE_TITLE_POSTFIX } from '../../constants'
import { randomizeMazePlayers } from '../../mazes/mazeCommon'

import { patchUserLobby } from '../../api'

const useStyles = makeStyles(
  theme => ({
    root: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
    },

    statsBar: {
      marginTop: theme.spacing(1),
    },

    workspace: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      marginTop: theme.spacing(3),
    },

    // Workspace Top Section
    workspaceTop: {
      display: 'flex',
      flex: 1,
    },

    samplesContainer: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 200,
    },

    samplesInfoText: {
      fontWeight: 'bold',
    },

    workspaceMiddle: {
      display: 'flex',
      flex: 1,
      justifyContent: 'center',
      marginTop: theme.spacing(3),
    },

    mazeContainer: {
      display: 'flex',
      flex: 1,
    },

    // Workspace Bottom
    workspaceBottom: {
      display: 'flex',
      flex: 1,
      marginTop: theme.spacing(3),
    },

    // Arrows
    arrows: {
      display: 'flex',
      flex: 1,
      alignItems: 'center',
      flexDirection: 'column',
    },

    sideArrows: {
      display: 'flex',
      flex: 1,
      justifyContent: 'space-between',
      width: 225,
    },

    arrowButton: {
      backgroundColor: 'lightblue',
    },

    arrowIcon: {
      height: 50,
      width: 50,
    },
  }),
  { name: 'WorkerLobby' }
)

const WorkerLobby = props => {
  const classes = useStyles(props)

  const {
    lobbyId,
    lobbyCode,
    userId,
    userName,
    userRole,
    numUsersInLobby,
    refreshCount,
    handleRefreshStatsClick,
    mazeString,
    prompt,
    numSamples,
    handleMazeStringChange,
  } = props

  const [actions, setActions] = useState([])
  const [numSamplesCompleted, setNumSamplesCompleted] = useState(0)
  const [done, setDone] = useState(false)

  // Actions Effect
  useEffect(() => {
    console.log('WORK LOBBY > ACTIONS EFFECT')

    const updateUserLobby = async () => {
      try {
        if (userId && lobbyId) {
          const payload = {
            actions,
          }

          await patchUserLobby(userId, lobbyId, payload)
          // console.log(userLobby)
        }
      } catch (err) {
        console.error(err)
      }
    }
    updateUserLobby()
  }, [actions])

  // Samples Completed Effect
  useEffect(() => {
    console.log('SAMPLES COMPLETED EFFECT')
    if (numSamplesCompleted > 0 && numSamplesCompleted >= numSamples) setDone(true)
  }, [numSamplesCompleted])

  const handleArrowClick = (event, direction) => {
    console.log('ARROW CLICK: ' + direction)
    const newAction = {
      boardState: mazeString,
      action: direction,
    }

    const newActions = [...actions, newAction]
    console.log(newActions)
    setActions(newActions)

    const newMazeString = randomizeMazePlayers(mazeString)
    handleMazeStringChange(newMazeString)
    setNumSamplesCompleted(numSamplesCompleted + 1)
  }

  return (
    <div className={classes.root}>
      <Helmet>
        <title>Worker Lobby {SITE_TITLE_POSTFIX}</title>
      </Helmet>
      <StatsBar
        className={classes.statsBar}
        lobbyCode={lobbyCode}
        userId={userId}
        userName={userName}
        userRole={userRole}
        numUsersInLobby={numUsersInLobby}
        refreshCount={refreshCount}
        handleRefreshStatsClick={handleRefreshStatsClick}
      />
      <div className={classes.workspace}>
        <div className={classes.workspaceTop}>
          <div className={classes.mazeContainer}>
            <BlockMazeDisplay mazeString={mazeString} />
          </div>
          <div className={classes.samplesContainer}>
            <Typography className={classes.samplesInfoText}>Completed:</Typography>
            <Typography className={classes.samplesInfoText}>
              {numSamplesCompleted} / {numSamples}
            </Typography>
          </div>
        </div>
        <div className={classes.workspaceMiddle}>
          <div className={classes.promptContainer}>
            <Typography>
              <strong>Prompt:</strong> {prompt}
            </Typography>
          </div>
        </div>
        <div className={classes.workspaceBottom}>
          <div className={classes.arrows}>
            <div className={classes.upArrow}>
              <IconButton
                className={classes.arrowButton}
                onClick={e => handleArrowClick(e, 'U')}
                disabled={done}
              >
                <KeyboardArrowUpIcon className={classes.arrowIcon} />
              </IconButton>
            </div>
            <div className={classes.sideArrows}>
              <IconButton
                className={classes.arrowButton}
                onClick={e => handleArrowClick(e, 'L')}
                disabled={done}
              >
                <KeyboardArrowLeftIcon className={classes.arrowIcon} />
              </IconButton>
              <IconButton
                className={classes.arrowButton}
                onClick={e => handleArrowClick(e, 'R')}
                disabled={done}
              >
                <KeyboardArrowRightIcon className={classes.arrowIcon} />
              </IconButton>
            </div>
            <div className={classes.downArrow}>
              <IconButton
                className={classes.arrowButton}
                onClick={e => handleArrowClick(e, 'D')}
                disabled={done}
              >
                <KeyboardArrowDownIcon className={classes.arrowIcon} />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

WorkerLobby.propTypes = {
  lobbyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  lobbyCode: PropTypes.string.isRequired,
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  userName: PropTypes.string.isRequired,
  numUsersInLobby: PropTypes.number.isRequired,
  refreshCount: PropTypes.number.isRequired,
  handleRefreshStatsClick: PropTypes.func.isRequired,
  mazeString: PropTypes.string.isRequired,
  prompt: PropTypes.string.isRequired,
  numSamples: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
}

export default WorkerLobby
