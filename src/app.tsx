import React from 'react'
import '@tarojs/async-await'
import './app.css'

class App extends React.Component {
  render () {
    return (
      this.props.children
    )
  }
}

export default App

