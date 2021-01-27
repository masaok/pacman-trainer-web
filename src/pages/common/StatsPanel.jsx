import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'

import { MAX_RELOADS } from '../../constants'

import { panelStyles } from '../../commonStyles'

const useStyles = makeStyles(
  theme => ({
    ...panelStyles(theme),

    root: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: theme.palette.primary.light,
    },

    tableContainer: {
      marginBottom: theme.spacing(2),
      padding: theme.spacing(1),
    },

    cellRoot: {
      border: 'none',
    },

    panelInnerContainer: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
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
      <Typography className={classes.panelTitle}>Stats</Typography>
      <div className={classes.panelInnerContainer}>
        <TableContainer className={classes.tableContainer} component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableBody>
              {data.map((item, index) => {
                return item.value === undefined ? null : (
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
          Refresh Stats
        </Button>
      </div>
    </Paper>
  )
}

export default StatsPanel
