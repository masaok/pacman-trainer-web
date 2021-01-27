import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { APP_VERSION } from '../../constants'

const useStyles = makeStyles(
  theme => ({
    // Real-time Stats Panel
    root: {
      display: 'flex',
      flex: 1,
      marginTop: theme.spacing(3),
      padding: theme.spacing(3),
    },
  }),
  { name: 'Footer' }
)

const Footer = props => {
  const classes = useStyles(props)
  return <div className={classes.root}>v{APP_VERSION}</div>
}

export default Footer
