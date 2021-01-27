import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

import clsx from 'clsx'

import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'

import TaskDisplay from './content/TaskDisplay'

// Constants
import { SITE_TITLE_POSTFIX } from '../../constants'

// createStyles is for TS-compatibility
// https://material-ui.com/styles/api/#createstyles-styles-styles
const useStyles = makeStyles(
  theme => ({
    root: {
      display: 'grid',
      height: '100vh',
      overflowY: 'scroll',
      backgroundColor: '#F8F8F8', // very light gray
      gridTemplate: `
      "headerLeft headerRight" auto
      "sidebar content" 1fr
      / auto 1fr
    `,
    },

    // All Grid Items
    gridItem: {
      backgroundColor: theme.palette.common.white,
      // padding: spacing(1),
    },

    // Each Grid Item below
    headerLeft: {
      gridArea: 'headerLeft',
      backgroundColor: theme.palette.primary.light,
      display: 'flex',
      paddingBottom: theme.spacing(0.5),
    },

    headerRight: {
      gridArea: 'headerRight',
      backgroundColor: theme.palette.primary.light,
      display: 'flex',
      paddingBottom: theme.spacing(0.5),
    },

    sidebar: {
      gridArea: 'sidebar',
      padding: 0,
      // minWidth: 240,
      maxWidth: 250,
    },

    content: {
      gridArea: 'content',
      marginTop: theme.spacing(10.75),
      marginBottom: theme.spacing(10.75),
      marginLeft: theme.spacing(11.75),
      marginRight: theme.spacing(11.75),
      backgroundColor: '#F8F8F8', // very light gray
    },

    // Header Contents
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      maxWidth: 106,
      marginLeft: theme.spacing(2),
    },

    logo: {
      width: '100%',
      height: 'auto',
    },

    // Header Buttons
    headerButtonsContainer: {
      display: 'flex',
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingRight: theme.spacing(5),
    },

    userAvatar: {
      width: 30,
      height: 30,
    },

    appsIcon: {
      width: 40,
      height: 40,
      color: '#F2F2F2', // light gray
      marginLeft: theme.spacing(0.5),
    },
  }),
  { name: 'Dashboard' }
)

const components = {
  tasks: TaskDisplay,
}

const Dashboard = props => {
  const classes = useStyles(props)
  const { match } = props

  // Using dynamic components to fill in the Dashboard
  // const [Content, setContent] = useState(TaskDisplay)
  const [content, setContent] = useState('tasks')

  let Content = null

  // First load effect
  useEffect(() => {
    switch (match.path) {
      default:
        // setContent(TaskDisplay)
        setContent('tasks')
    }
    // Content = components.content
  }, [match])

  Content = components[content]

  return (
    <div className={classes.root}>
      <Helmet>
        <title>Dashboard {SITE_TITLE_POSTFIX}</title>
      </Helmet>

      <div className={clsx(classes.gridItem, classes.headerLeft)}>
        <div className={classes.logoContainer}></div>
      </div>
      <div className={clsx(classes.gridItem, classes.headerRight)}>
        <Button component={Link} to="/">
          Pacman Training
        </Button>
        <div className={classes.headerButtonsContainer}>SETTINGS</div>
      </div>
      <div className={clsx(classes.gridItem, classes.sidebar)}>
        {/* <LeftSidebar {...props.match} /> */}
        {/* LEFT SIDE BAR */}
      </div>
      <div className={clsx(classes.gridItem, classes.content)}>
        <Content />
      </div>
    </div>
  )
}

export default Dashboard
