import React, { useReducer, useEffect, useContext } from 'react'
import axios from 'axios'
import { useTransition, animated } from 'react-spring'
import { Route, Switch, __RouterContext } from 'react-router-dom'
import './App.css'

const service = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true
})

const AppContext = React.createContext(null)

let dispatch, state;
const reducer = () => useReducer((state, [action, payload]) => {
  console.log("action", action, payload)
  switch(action) {
    case 'loginUsername': 
      return { ...state, loginUsername: payload}
    case 'loginPassword': 
      return { ...state, loginPassword: payload}
    case 'loginErrors': 
      return { ...state, loginErrors: payload ? payload : [{ message: "Error... " }] }
    case 'loginSuccess': 
      return { ...state, loginErrors: [], user: payload, location: "/welcome"}
    case 'login': 
      service.post('/auth/login', {
        username: state.loginUsername,
        password: state.loginPassword
      })
      .then(response => dispatch(["loginSuccess", response.data]))
      .catch(({ response }) => dispatch([ "loginErrors", 
        response ? response.data : [{ message: "Error... " }] ])
      )
      return { ...state, location: "/" }
    case 'playlistsFetch': 
      service.get('/playlist')
      .then(({ data }) => dispatch(["playlists", data]))
      .catch(({ response }) => dispatch([ "playlistsErrors", 
        response ? response.data : [{ message: "Error... " }] ])
      )
      return state 
    case 'playlistsErrors': 
      return state;
    case 'playlists': 
      return { ...state, playlists: payload };
    case 'playlistName': 
      return { ...state, playlistName: payload}
    case 'playlistAdd': 
      service.post(`/playlist/${state.playlistName}`)
      .then(({ data }) => dispatch(["playlistsFetch"]))
      .catch(({ response }) => dispatch([ "playlistsErrors", 
        response ? response.data : [{ message: "Error... " }] ])
      )
      return { ...state, playlistName: "" } 
    case 'playlistDelete': 
      service.delete(`/playlist/${payload}`)
      .then(() => dispatch(["playlistsFetch"]))
      .catch(({ response }) => dispatch([ "playlistsErrors", 
        response ? response.data : [{ message: "Error... " }] ])
      )
      return state 
    default: 
      throw new Error(`bad action: ${action}`)
  }
}, {
  loginUsername: "aaron",
  loginPassword: "aaron",
  loginErrors: [],
  user: {},
  playlists: [],
  playlistName: "",
  location: window.location.pathname,
})

function Home() {
  [state, dispatch] = reducer()
  const { location, history } = useContext(__RouterContext)
  const transitions = useTransition(location, location => location.pathname, {
    initial: (item) => {
      return { transform: 'translate3d(0, 0%,0)'}
    },
    from: { transform: 'translate3d(0, -80%,0)'},
    enter: { transform: 'translate3d(0, 0%,0)'},
    leave: { transform: 'translate3d(0, 90%,0)'}
  })
  useEffect(() => history.push(state.location), [state.location])
  return (
    <AppContext.Provider value={{state, dispatch}}>
      {transitions.map(({ item, props, key }) => (
        <animated.div 
          style={{...props, position: "absolute", height: "100%", width: "100%"}} 
          key={key}>
          <Switch location={item}>
            <Route exact path="/" component={Login} />
            <Route exact path="/welcome" component={Welcome} />
          </Switch>
        </animated.div>
      ))}
    </AppContext.Provider>
  )
}

function Login() {
  const { state, dispatch } = useContext(AppContext)
  return (
    <div className="container containerLogin">
      <div className="loginTitle">Create your playlists</div>
      <input className="usernameInput" placeholder="username" required
        value={ state.loginUsername } 
        onChange={e => dispatch(["loginUsername", e.target.value]) } />
      <input className="passwordInput" placeholder="password" required
        value={ state.loginPassword } 
        onChange={e => dispatch(["loginPassword", e.target.value]) } />      
      <button className="loginButton" 
        onClick={() => dispatch(["login"])}>
        Login
      </button>
      <div className="loginError">
        { state.loginErrors.map((e, i) =>
            <div key={i}>{e.message}</div>
          ) 
        }
      </div>
    </div>    
  )
}  

function Welcome() {
  const { state, dispatch } = useContext(AppContext)
  useEffect(() => {
    dispatch(["playlistsFetch"])
  }, [])
  return (
    <div className="container welcome" style={{ padding: "40px" }}>
      Welcome, {state.user.username}
      <div style={{ backgroundColor: "var(--x-light)"}}>
        {state.playlists.map((pl, i) =>
          <div key={i}>
            <div>{pl.name}</div>  
            <button
              onClick={() => dispatch(["playlistDelete", pl._id])}
              >delete</button>
          </div>
        )}
      </div>
      <AddPlaylist />
    </div>
  )
}

function AddPlaylist() {
  const { state, dispatch } = useContext(AppContext)
  return (
    <div>
      <input placeholder="playlist name" 
        value={state.playlistName}
        onChange={(e) => dispatch(["playlistName", e.target.value])}
      />
      <button
        onClick={() => dispatch(["playlistAdd"])}
      >add playlist</button>
    </div>
  )
}

export default Home;

// TODO
// api.js file
// Fetch user info in welcome screen
// Seperate screen for playlists and my playlists
// List tracks in playlist
// Add tracks in playlist
// Delete tracks in playlist
// Loading indicator
// Different transitions for different components
// login not found error
