const api = 'http://localhost:4000/'

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

const post = (resource, payload) => {
  const options = {
    method: 'POST',
    headers: { ...BASE_API_REQUEST_HEADER },
    body: payload ? JSON.stringify(payload) : null,
  }

  return fetch(urlFor(resource), options).then(response => response?.json())
}

// Lobby GETs
const getLobbyById = lobbyId => get(`lobby/${lobbyId}`).then(result => result)
const getLobbyMaze = lobbyCode => get(`lobbyMaze/${lobbyCode}`).then(result => result)
const getLobbyMazeByHash = lobbyHash => get(`lobbyMazeByHash/${lobbyHash}`).then(result => result)
const getNumUsersInLobby = lobbyCode =>
  get(`numUsersInLobby/${lobbyCode}`).then(result => result.count)

// User GETs
const getUserById = userId => get(`user/${userId}`).then(result => result)
const getUserCount = () => get(`userCount`).then(result => result.count)

// POSTs
const postUser = payload => post(`user`, payload).then(result => result.user)
const postUserLobby = payload => post(`userLobby`, payload).then(result => result.userLobby)
const postMaze = payload => post(`maze`, payload).then(result => result.maze)
const postLobby = payload => post(`lobby`, payload).then(result => result.lobby)
const postLobbyMaze = payload => post(`lobbyMaze`, payload).then(result => result.lobbyMaze)

export {
  getLobbyById,
  getLobbyMaze,
  getLobbyMazeByHash,
  getNumUsersInLobby,
  getUserById,
  getUserCount,
  postLobby,
  postLobbyMaze,
  postMaze,
  postUser,
  postUserLobby,
}
