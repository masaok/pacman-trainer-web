import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
// import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import { MAX_RELOADS } from '../../constants'

import { panelStyles } from '../../commonStyles'
// import { getNumUsersInLobby } from '../../api'

const useStyles = makeStyles(
  theme => ({
    ...panelStyles(theme),

    root: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      // backgroundColor: theme.palette.grey[200],
      backgroundColor: theme.palette.primary.light,
    },

    tableContainer: {
      marginBottom: theme.spacing(2),
      padding: theme.spacing(1),
    },

    cellRoot: {
      border: 'none',
    },

    // Panel Containers
    topPanels: {
      display: 'flex',
      flex: 1,
      margin: theme.spacing(2),
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
      backgroundColor: theme.palette.grey[200],
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
  { name: 'StatsPanel' }
)

const StatsPanel = props => {
  const classes = useStyles(props)

  const { userCount, numUsersInLobby, refreshCount, handleRefreshStatsClick } = props

  const data = [
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
      value: `${refreshCount} / ${MAX_RELOADS}`,
    },
  ]

  return (
    <Paper className={classes.realTimeStatsPanel}>
      <Typography className={classes.panelTitle}>Real-time Stats</Typography>
      <div className={classes.panelInnerContainer}>
        <TableContainer className={classes.tableContainer} component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableBody>
              {data.map((item, index) => {
                return item.value === undefined ? (
                  ''
                ) : (
                  <TableRow key={index}>
                    <TableCell classes={{ root: classes.cellRoot }} size="small">
                      {item.field}
                    </TableCell>
                    <TableCell classes={{ root: classes.cellRoot }} size="small">
                      {item.value}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          className={classes.refreshStatsButton}
          variant="outlined"
          color="primary"
          onClick={handleRefreshStatsClick}
          size="small"
        >
          Reload Stats
        </Button>
      </div>
    </Paper>
  )
}

export default StatsPanel
