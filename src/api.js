import { isDev } from './common'
// TODO: Use an environment variable here
// TODO: PROD - Vercel
// TODO: DEV - localhost:4000

const api = isDev() ? 'http://localhost:4000/' : 'https://pacman-trainer-api.masaok.vercel.app/'

const BASE_API_REQUEST_HEADER = {
  'Content-Type': 'application/json',
}

const urlFor = resource => `${api}${resource}`

const get = resource => {
  // console.log('API > GET > resource:')
  // console.log(resource)
  const options = {
    method: 'GET',
    headers: { ...BASE_API_REQUEST_HEADER },
    // body: payload ? JSON.stringify(payload) : null,
  }

  return fetch(urlFor(resource), options).then(response => {
    // console.log('API > GET > FETCH > response:')
    // console.log(response)

    if (!response) throw new Error('GET FETCH failed')

    return response?.json()
  })
}

const patch = (resource, payload) => {
  const options = {
    method: 'PATCH',
    headers: { ...BASE_API_REQUEST_HEADER },
    body: payload ? JSON.stringify(payload) : null,
  }

  return fetch(urlFor(resource), options).then(response => response?.json())
}

const post = (resource, payload) => {
  const options = {
    method: 'POST',
    headers: { ...BASE_API_REQUEST_HEADER },
    body: payload ? JSON.stringify(payload) : null,
  }

  return fetch(urlFor(resource), options).then(response => response?.json())
}

// Sanity GETs
const getStatus = () => get(``).then(result => result)

// Lobby GETs
const getLobbyById = lobbyId => get(`lobby/${lobbyId}`).then(result => result)
const getLobbyMaze = lobbyCode => get(`lobbyMaze/${lobbyCode}`).then(result => result)
const getLobbyMazeByHash = lobbyHash => get(`lobbyMazeByHash/${lobbyHash}`).then(result => result)

// User Lobby GETs
const getUserLobbyMazeByHash = userLobbyHash =>
  get(`userLobbyMazeByHash/${userLobbyHash}`).then(result => result)

const getUserLobbyMazeByLobbyId = lobbyId =>
  get(`userLobbyMazeByLobbyId/${lobbyId}`).then(result => result)

const getNumUsersInLobby = lobbyCode =>
  get(`numUsersInLobby/${lobbyCode}`).then(result => result.count)

// User GETs
const getUserById = userId => get(`user/${userId}`).then(result => result)
const getUserCount = () => get(`userCount`).then(result => result.count)

// PATCHes (updates)
const patchUserLobby = (userId, lobbyId, payload) =>
  patch(`userLobby/${userId}/${lobbyId}`, payload).then(result => result.userLobby)

// POSTs (creates)
const postUser = payload => post(`user`, payload).then(result => result.user)
const postUserLobby = payload => post(`userLobby`, payload).then(result => result.userLobby)
const postMaze = payload => post(`maze`, payload).then(result => result.maze)
const postLobby = payload => post(`lobby`, payload).then(result => result.lobby)
const postLobbyMaze = payload => post(`lobbyMaze`, payload).then(result => result.lobbyMaze)

export {
  // Sanity GETs
  getStatus,
  // Lobby GETs
  getLobbyById,
  getLobbyMaze,
  getLobbyMazeByHash,
  // User Lobby GETs
  getUserLobbyMazeByHash,
  getUserLobbyMazeByLobbyId,
  getNumUsersInLobby,
  getUserById,
  getUserCount,
  // PATCHes
  patchUserLobby,
  // POSTs
  postLobby,
  postLobbyMaze,
  postMaze,
  postUser,
  postUserLobby,
}
