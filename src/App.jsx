import React, { useEffect, useState } from 'react'
// import { Helmet } from 'react-helmet'
import { Helmet, HelmetProvider } from 'react-helmet-async'

import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'

import { ThemeProvider, makeStyles } from '@material-ui/core/styles'

import CssBaseline from '@material-ui/core/CssBaseline'

import Homepage from './pages/homepage/Homepage'
import Lobby from './pages/lobby/Lobby'

import theme from './themes/default'

import { getLobbyById, getUserById } from './api'

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

  // TODO: These should be updated by fetching the object based on an ID
  const [currentLobbyId, setCurrentLobbyId] = useState(null)
  const [currentUserId, setCurrentUserId] = useState(null)

  const [currentLobby, setCurrentLobby] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  // Current Lobby ID Effect
  useEffect(() => {
    const retrieveLobby = async () => {
      try {
        const lobby = await getLobbyById(currentLobbyId)
        setCurrentLobby(lobby)
      } catch (err) {
        console.error(err)
      }
    }
    if (currentLobbyId) retrieveLobby()
  }, [currentLobbyId])

  // Current User ID Effect
  useEffect(() => {
    const retrieveUser = async () => {
      try {
        const user = await getUserById(currentUserId)
        setCurrentUser(user)
      } catch (err) {
        console.error(err)
      }
    }
    if (currentUserId) retrieveUser()
  }, [currentUserId])

  // ID Handlers
  const handleLobbyIdChange = id => {
    setCurrentLobbyId(id)
  }

  const handleUserIdChange = id => {
    setCurrentUserId(id)
  }

  return (
    <HelmetProvider>
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
              {/* <Route exact path="/:lobbyCode" component={Lobby} /> */}
              {/* <Route exact path="/" component={Homepage} /> */}
              <Route
                exact
                path="/r/:lobbyHash"
                render={props => (
                  <Lobby
                    {...props}
                    currentLobby={currentLobby}
                    currentUser={currentUser}
                    handleLobbyIdChange={handleLobbyIdChange}
                    handleUserIdChange={handleUserIdChange}
                  />
                )}
              />
              <Route
                exact
                path="/w/:userLobbyHash"
                render={props => (
                  <Lobby
                    {...props}
                    currentLobby={currentLobby}
                    currentUser={currentUser}
                    handleLobbyIdChange={handleLobbyIdChange}
                    handleUserIdChange={handleUserIdChange}
                  />
                )}
              />
              <Route
                exact
                path="/:lobbyCode"
                render={props => (
                  <Lobby {...props} currentLobby={currentLobby} currentUser={currentUser} />
                )}
              />
              <Route
                exact
                path="/"
                render={props => (
                  <Homepage
                    {...props}
                    handleLobbyIdChange={handleLobbyIdChange}
                    handleUserIdChange={handleUserIdChange}
                  />
                )}
              />
            </Switch>
          </Router>
        </ThemeProvider>
      </div>
    </HelmetProvider>
  )
}

export default App
