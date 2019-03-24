import React, { useReducer, useEffect, useContext } from 'react'
import axios from 'axios'
import { useTransition, animated } from 'react-spring'
import { Route, Switch, __RouterContext } from 'react-router-dom'
import './App.css'

const AppContext = React.createContext(null)

let dispatch, state;
const reducer = () => useReducer((state, [action, payload]) => {
  console.log("action", action)
  switch(action) {
    case 'loginUsername': 
      return { ...state, loginUsername: payload}
    case 'loginPassword': 
      return { ...state, loginPassword: payload}
    case 'loginErrors': 
      return { ...state, loginErrors: payload }
    case 'loginSuccess': 
      return { ...state, loginErrors: [], user: payload, location: "/welcome"}
    case 'login': 
      axios.post('http://localhost:3000/auth/login', {
        username: state.loginUsername,
        password: state.loginPassword
      })
      .then(response => dispatch(["loginSuccess", response.data]))
      .catch(({ response }) => dispatch([ "loginErrors", 
        response ? response.data : [{ message: "Error... " }] ])
      )
      return { ...state, location: "/" }
    case 'playlistsFetch': 
      axios.get('http://localhost:3000/playlist')
      .then(({ data }) => dispatch(["playlists", data]))
      .catch(({ response }) => dispatch([ "playlistsErrors", 
        response ? response.data : [{ message: "Error... " }] ])
      )
      return state 
    case 'playlists': 
      return { ...state, playlists: payload };
    case 'playlistsErrors': 
      return state;
    default: 
      throw new Error(`bad action: ${action}`)
  }
}, {
  loginUsername: "aaron",
  loginPassword: "aaron",
  loginErrors: [],
  user: {},
  playlists: [],
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
    <div className="container containerWelcome">
      <div className="welcome">
        Welcome, {state.user.username}
        <div>
          {state.playlists.map((pl, i) =>
            <div key={i}>{pl.name}</div>  
          )}
        </div>
      </div>
    </div>
  )
}

export default Home;

// TODO
// Thing