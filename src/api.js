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

const getLobbyMaze = lobbyCode => get(`lobbyMaze/${lobbyCode}`).then(result => result)
const getUserCount = () => get(`userCount`).then(result => result.count)

const postUser = payload => post(`user`, payload).then(result => result.user)
const postUserLobby = payload => post(`userLobby`, payload).then(result => result.userLobby)
const postMaze = payload => post(`maze`, payload).then(result => result.maze)
const postLobby = payload => post(`lobby`, payload).then(result => result.lobby)
const postLobbyMaze = payload => post(`lobbyMaze`, payload).then(result => result.lobbyMaze)

export { getLobbyMaze, getUserCount, postLobby, postLobbyMaze, postMaze, postUser, postUserLobby }
