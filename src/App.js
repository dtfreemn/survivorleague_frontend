import React, { Component } from 'react';
import {helpers} from './helpers'
import TeamsContainer from './TeamsContainer'
import MembersContainer from './MembersContainer'
import './App.css';

class App extends Component {

  constructor() {
    super()

    this.state = {
      render: 'picks'
    }

    this.determineRenderedContainer = this.determineRenderedContainer.bind(this)
  }
  
  determineRenderedContainer() {
    if (this.state.render === 'games') {
      return <TeamsContainer/>
    } else if (this.state.render === 'picks') {
      return <MembersContainer/>
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Soltman's Survivor League</h1>
        </header>
        {this.determineRenderedContainer()}
      </div>
    );
  }
}

export default App;
