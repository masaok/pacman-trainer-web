import React, { useEffect, useState } from 'react'

import clsx from 'clsx'

import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import { postLobby, postUser } from '../../api'

// import RandomMaze from './RandomMaze'
import { generateMazeGrid } from '../../mazes/RecursiveBacktrackingMaze'
import BlockMazeDisplay from '../../mazes/views/BlockMazeDisplay'

import { APP_TITLE } from '../../constants'

import { dumpGrid } from '../../common/helpers'

const useStyles = makeStyles(
  theme => ({
    root: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
    },

    // Maze Display styles

    mazeArea: {
      display: 'flex',
      flex: 1,
      alignItems: 'center',
    },

    mazeContainer: {
      display: 'flex',
      flex: 1,
      margin: theme.spacing(3),
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
    },

    button: {
      marginTop: theme.spacing(3),
    },

    // Controls
    controlArea: {
      display: 'flex',
      flex: 1,
      justifyContent: 'center',
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

    createLobbyArea: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: theme.spacing(3),
    },
  }),
  { name: 'Homepage' }
)

const Homepage = props => {
  const classes = useStyles(props)

  const history = useHistory()

  const [fieldValues, setFieldValues] = useState({
    name: '',
    prompt: '',
    numSamples: '',
  })

  const [mazeString, setMazeString] = useState('')

  useEffect(() => {
    handleGenerateNewMazeClick()
  }, [])

  // Click Handlers
  const handleGenerateNewMazeClick = () => {
    const grid = generateMazeGrid()
    const string = dumpGrid(grid, { stringify: false })
    setMazeString(string)
    // setSeed(Math.random())
  }

  const handleCreateNewLobbyClick = () => {
    console.log('HOMEPAGE > HANDLE CREATE NEW LOBBY CLICK')
    console.log('HOMEPAGE > HANDLE CREATE NEW LOBBY CLICK > fieldValues:')
    console.log(fieldValues)

    // Create a user
    const payload = {
      name: fieldValues?.name,
    }

    postUser(payload).then(user => {
      console.log('POST USER > user:')
      console.log(user)

      postLobby({}).then(lobby => {
        console.log('POST LOBBY > lobby:')
        console.log(lobby)

        history.push(`/${lobby?.code}`)
      })
    })
  }

  // Field Handlers
  const handleFieldChange = event => {
    const newValues = { ...fieldValues, [event.target.name]: event.target.value }
    setFieldValues(newValues)
  }

  // Text Maze Handlers
  const handleTextMazeChange = event => {
    console.log('HANDLE TEXT MAZE CHANGE > event:')
    console.log(event.target.value)
    setMazeString(event.target.value)
  }

  return (
    <div className={classes.root}>
      <Helmet>
        <title>{APP_TITLE}</title>
      </Helmet>
      <div className={classes.mazeArea}>
        <div className={classes.mazeContainer}>
          <BlockMazeDisplay mazeString={mazeString} />
        </div>
        <div className={classes.mazeEditor}>
          <TextField
            InputProps={{
              classes: {
                root: classes.mazeStringField, // overrride font size
              },
            }}
            label="Maze Editor"
            variant="outlined"
            size="small"
            name="maze"
            value={mazeString}
            onChange={handleTextMazeChange}
            multiline
            rows={10}
          />
        </div>
      </div>
      <div className={classes.controlArea}>
        <Button variant="contained" color="primary" onClick={handleGenerateNewMazeClick}>
          GENERATE NEW MAZE
        </Button>
      </div>
      <div className={classes.createLobbyArea}>
        <div className={classes.formFields}>
          <TextField
            className={clsx(classes.field, classes.nameField)}
            label="Type your name here"
            helperText="Name will be displayed to other users"
            variant="outlined"
            size="small"
            name="name"
            value={fieldValues.name}
            onChange={handleFieldChange}
          />
          <TextField
            className={clsx(classes.field, classes.promptField)}
            label="Worker Prompt"
            helperText="Instructions for your workers to follow"
            variant="outlined"
            size="small"
            name="prompt"
            placeholder="Choose the move that helps Pacman survive"
            value={fieldValues.prompt}
            onChange={handleFieldChange}
            multiline
            rows={2}
          />
          <TextField
            className={clsx(classes.field, classes.numSamplesField)}
            label="# of Samples"
            helperText="How many samples do you want each worker to handle?"
            variant="outlined"
            size="small"
            name="numSamples"
            placeholder="10"
            value={fieldValues.numSamples}
            onChange={handleFieldChange}
          />
        </div>
        <div className={classes.createLobbyButtonContainer}>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={handleCreateNewLobbyClick}
          >
            Create New Lobby
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Homepage
