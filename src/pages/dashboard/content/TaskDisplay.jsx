import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(
  theme => ({
    root: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
    },
  }),
  { name: 'TaskDisplay' }
)

const TaskDisplay = props => {
  const classes = useStyles(props)

  return <div className={classes.root}>TASK DISPLAY CONTENT</div>
}

export default TaskDisplay
