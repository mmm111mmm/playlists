import React, { useReducer, useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useTransition, animated } from 'react-spring'
import colorsys from 'colorsys'
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
    default: 
      throw new Error(`bad action: ${action}`)
  }
}, {
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
            <Route exact path="/" component={Colour} />
          </Switch>
        </animated.div>
      ))}
    </AppContext.Provider>
  )
}

function hsvToRgb(h, s, v) {
  var r, g, b;
  var i = Math.floor(h * 6);
  var f = h * 6 - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return [ r * 255, g * 255, b * 255 ];
}

function rgb2hex(red, green, blue) {
  var rgb = blue | (green << 8) | (red << 16);
  return '#' + (0x1000000 + rgb).toString(16).slice(1)
}

function Colour() {
  const [hue, setHue] = useState(244)
  const [sat, setSat] = useState(2)
  const [bright, setBright] = useState(98)
  const [rgb, setRGB] = useState([0, 0, 0])
  const { state, dispatch } = useContext(AppContext)
  useEffect(() => {
    var [r, g, b ] = hsvToRgb(hue/360, sat/100, bright/100)
    setRGB([ Math.round(r),Math.round(g), Math.round(b) ])
  }, [hue, sat, bright])

  return (
    <div style={{ backgroundColor: `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`}}>
      <div>
        <div>Hue {hue}</div>
        <input type="range" min="0" max="360" value={hue}
          onChange={(e) => setHue(parseInt(e.target.value))} 
          />
      </div>
      <div>
        <div>Saturation {sat}</div>
        <input type="range" min="0" max="100" value={sat} 
          onChange={(e) => setSat(parseInt(e.target.value))} 
          />
      </div>
      <div>
        <div>Brightness {bright}</div>
        <input type="range" min="0" max="100" value={bright} 
          onChange={(e) => setBright(parseInt(e.target.value))} 
          />
      </div>
      <div>
        <div>{`rgb(${rgb[0]},${rgb[1]},${rgb[2]})`}</div>
        <div>{rgb2hex(rgb[0], rgb[1], rgb[2])}</div>
      </div>
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
