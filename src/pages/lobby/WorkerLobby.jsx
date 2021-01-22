import React from 'react'

import { Link } from 'react-router-dom'

import { Helmet } from 'react-helmet-async'

import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'

import BlockMazeDisplay from '../../mazes/views/BlockMazeDisplay'
import StatsBar from '../common/StatsBar'
import StatsPanel from '../common/StatsPanel'

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'

import { SITE_TITLE_POSTFIX } from '../../constants'

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
    lobbyCode,
    // currentLobby,
    // currentUser,
    numUsersInLobby,
    refreshCount,
    handleRefreshStatsClick,
    mazeString,
    prompt,
    numSamples,
  } = props

  return (
    <div className={classes.root}>
      <Helmet>
        <title>Worker Lobby {SITE_TITLE_POSTFIX}</title>
      </Helmet>
      <StatsBar
        className={classes.statsBar}
        lobbyCode={lobbyCode}
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
            <Typography className={classes.samplesInfoText}>0 / {numSamples}</Typography>
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
              <IconButton className={classes.arrowButton}>
                <KeyboardArrowUpIcon className={classes.arrowIcon} />
              </IconButton>
            </div>
            <div className={classes.sideArrows}>
              <IconButton className={classes.arrowButton}>
                <KeyboardArrowLeftIcon className={classes.arrowIcon} />
              </IconButton>
              <IconButton className={classes.arrowButton}>
                <KeyboardArrowRightIcon className={classes.arrowIcon} />
              </IconButton>
            </div>
            <div className={classes.downArrow}>
              <IconButton className={classes.arrowButton}>
                <KeyboardArrowDownIcon className={classes.arrowIcon} />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkerLobby
