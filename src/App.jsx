import React from 'react'
import { Helmet } from 'react-helmet'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'

import { ThemeProvider, makeStyles } from '@material-ui/core/styles'

import CssBaseline from '@material-ui/core/CssBaseline'

import Dashboard from './pages/dashboard/Dashboard'

import theme from './themes/default'

const useStyles = makeStyles(
  theme => ({
    app: {
      width: '100vw',
      height: '100vh',
      padding: 0,
      margin: 0,
      backgroundColor: theme.palette.common.white, // switch to black for debugging
    },
  }),
  { name: 'App' }
)

const App = props => {
  const classes = useStyles(props)

  return (
    <div className={classes.app}>
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <ThemeProvider theme={theme}>
        {/* Global CSS reset: https://material-ui.com/components/css-baseline/ */}
        <CssBaseline />
        <Router>
          <Switch>
            <Route exact path="/" component={Dashboard} />
          </Switch>
        </Router>
      </ThemeProvider>
    </div>
  )
}

export default App
