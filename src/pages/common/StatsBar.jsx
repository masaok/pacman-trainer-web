import React from 'react'

import { Link } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'

import { panelStyles } from '../../commonStyles'

const useStyles = makeStyles(
  theme => ({
    ...panelStyles(theme),

    // Real-time Stats Panel
    root: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      padding: theme.spacing(2),
      alignItems: 'center',
      backgroundColor: theme.palette.grey[200],
      marginTop: theme.spacing(1),
    },

    panelInnerContainer: {
      display: 'flex',
      flex: 1,
      alignItems: 'center',
    },

    homeButton: {
      marginRight: theme.spacing(1),
    },

    statsPair: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
    },

    statsField: {
      display: 'flex',
      flex: 1,
      whiteSpace: 'nowrap',
      justifyContent: 'center',
      fontWeight: 'bold',
      textDecoration: 'underline',
    },

    statsValue: {
      display: 'flex',
      flex: 1,
      justifyContent: 'center',
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
    },

    button: {
      marginLeft: theme.spacing(2),
    },

    refreshStatsButton: {
      marginRight: theme.spacing(1),
    },

    autoRefreshButtonEnabled: {
      backgroundColor: 'lightgreen',
      '&:hover': {
        backgroundColor: 'lightgreen',
      },
    },

    autoRefreshButtonDisabled: {
      backgroundColor: 'red',
      '&:hover': {
        backgroundColor: 'red',
      },
    },
  }),
  { name: 'StatsBar' }
)

const StatsBar = props => {
  const classes = useStyles(props)

  const {
    lobbyId,
    lobbyCode,
    userId,
    userName,
    userRole,
    userCount,
    numUsersInLobby,
    refreshCount,
    maxRefreshes,
    autoRefreshEnabled,
    handleRefreshStatsClick,
    // handleSetRefreshInterval,
    handleSetAutoRefreshClick,
  } = props

  const data = [
    {
      field: 'Hostname',
      value: window.location.hostname,
    },
    {
      field: 'Lobby (ID)',
      value: `${lobbyCode} (${lobbyId})`,
    },
    {
      field: 'Role',
      value: userRole,
    },
    {
      field: 'User Name (ID)',
      value: `${userName} (${userId})`,
    },
    {
      field: 'Users',
      value: userCount,
    },
    {
      field: 'Number of Workers in Lobby',
      value: numUsersInLobby,
    },
    {
      field: 'Refreshes',
      value: `${refreshCount} / ${maxRefreshes}`,
    },
  ]

  return (
    <Paper className={classes.root}>
      <div className={classes.panelInnerContainer}>
        <div className={classes.button}>
          <Button
            className={classes.homeButton}
            component={Link}
            to="/"
            variant="outlined"
            color="primary"
            size="small"
          >
            Homepage
          </Button>
        </div>
        {data.map((item, index) => {
          return item.value === undefined ? (
            ''
          ) : (
            <div className={classes.statsPair} key={index}>
              <div className={classes.statsField}>{item.field}</div>
              <div className={classes.statsValue}>{item.value}</div>
            </div>
          )
        })}
        <div className={classes.button}>
          <Button
            className={classes.refreshStatsButton}
            variant="outlined"
            color="primary"
            onClick={handleRefreshStatsClick}
            size="small"
            disabled={autoRefreshEnabled}
          >
            Refresh Now
          </Button>
          <Button
            className={
              autoRefreshEnabled
                ? classes.autoRefreshButtonEnabled
                : classes.autoRefreshButtonDisabled
            }
            variant="outlined"
            color="primary"
            onClick={handleSetAutoRefreshClick}
            size="small"
          >
            Auto Refresh {autoRefreshEnabled ? 'On' : 'Off'}
          </Button>
          {/* <Button
            className={classes.refreshStatsButton}
            variant="link"
            color="primary"
            onClick={() => handleSetRefreshInterval(1000)}
            size="small"
          >
            1 sec
          </Button> */}
        </div>
      </div>
    </Paper>
  )
}

export default StatsBar
