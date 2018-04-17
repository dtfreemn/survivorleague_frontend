import React, { Component } from 'react';
import {helpers} from './helpers'
import {API_PASSWORD} from './secrets'
import GamesContainer from './GamesContainer'
import './App.css';

class App extends Component {
    render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Soltman's Survivor League</h1>
        </header>
        <GamesContainer />
        <div className='container' id="games"></div>
      </div>
    );
  }
}

export default App;
