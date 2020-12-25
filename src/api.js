const api = 'http://localhost:4000/'

const BASE_API_REQUEST_HEADER = {
  'Content-Type': 'application/json',
}

const urlFor = resource => `${api}${resource}`

const post = (resource, payload) => {
  const options = {
    method: 'POST',
    headers: { ...BASE_API_REQUEST_HEADER },
    body: payload ? JSON.stringify(payload) : null,
  }

  return fetch(urlFor(resource), options).then(response => response?.json())
}

const postUser = payload => post(`user`, payload).then(result => result.user)
const postMaze = payload => post(`maze`, payload).then(result => result.maze)
const postLobby = payload => post(`lobby`, payload).then(result => result.lobby)
const postLobbyMaze = payload => post(`lobbyMaze`, payload).then(result => result.lobbyMaze)

export { postLobby, postLobbyMaze, postMaze, postUser }
