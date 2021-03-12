import React, { useEffect, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { APP_VERSION } from '../../constants'

import { getStatus } from '../../api'

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

  const [apiIsAlive, setApiIsAlive] = useState(false)

  useEffect(() => {
    const retrieveApiTest = async () => {
      try {
        const status = await getStatus()
        console.log('STATUS:')
        console.log(status)
        setApiIsAlive(Boolean(status))
      } catch (err) {
        console.error(err)
      }
    }
    retrieveApiTest()
  }, [])

  return (
    <div className={classes.root}>
      v{APP_VERSION} - API: {`${apiIsAlive ? 'OK' : 'FAIL'}`}
    </div>
  )
}

export default Footer
