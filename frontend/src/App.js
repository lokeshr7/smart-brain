import React, { useState } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';

import Particles from 'particles-bg';

const serverAddress = 'http://localhost:3001/'

const initalState = {
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

export default function App() {

  const [input, setInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [box, setBox] = useState({});
  const [route, setRoute] = useState('signin')
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [user, setUser] = useState({ ...initalState.user })

  const resetState = () => {
    setInput('')
    setImageUrl('')
    setBox({})
    setRoute('signin')
    setIsSignedIn(false)
    setUser({ ...initalState.user })
  }

  const loadUser = (data) => {
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    })
  }

  const calculateFaceLocation = (clarifaiFace) => {
    const image = document.getElementById('inputimage')
    const width = Number(image.width)
    const height = Number(image.height)
    /*console.log(clarifaiFace,width,height)*/
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  const displayFaceBox = (box) => {
    setBox(box)
  }

  const onInputChange = (event) => {
    setInput(event.target.value)
  }

  const onButtonSubmit = () => {
    setImageUrl(input)

    fetch(`${serverAddress}imageurl`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: input
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch(`${serverAddress}image`, {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: user.id
            })
          })
            .then(result => result.json())
            .then(count => {
              setUser({ ...user, entries: count.entries })
            })
            .catch(console.log)
        }
        displayFaceBox(calculateFaceLocation(response))
      })
      .catch(error => console.log(error))
  }

  const onRouteChange = (route) => {
    if (route === 'signout') {
      resetState()
    } else if (route === 'home') {
      setIsSignedIn(true)
      setRoute(route)
    }
    else {
      setRoute(route)
    }
  }

  return (
    <div className="App">
      <Particles type='cobweb' bg={true} />
      <Navigation onRouteChange={onRouteChange} isSignedIn={isSignedIn} />

      {
        route === 'home'

          ? <div>
            <Logo />
            <Rank name={user.name} entries={user.entries} />
            <ImageLinkForm
              onInputChange={onInputChange}
              onButtonSubmit={onButtonSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>

          : (
            route === 'signin'
              ? <Signin onRouteChange={onRouteChange} loadUser={loadUser} serverAddress={serverAddress} />
              : <Register onRouteChange={onRouteChange} loadUser={loadUser} serverAddress={serverAddress} />
          )
      }
    </div>
  );
}