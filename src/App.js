import React, { Component } from 'react';
import TeamsContainer from './TeamsContainer'
import MembersContainer from './MembersContainer'
import './App.css';

class App extends Component {

  constructor() {
    super()

    this.state = {
      render: 'games'
    }

    this.determineRenderedContainer = this.determineRenderedContainer.bind(this)
    this.toggleState = this.toggleState.bind(this)
  }
  
  determineRenderedContainer() {
    if (this.state.render === 'games') {
      return <TeamsContainer/>
    } else if (this.state.render === 'members') {
      return <MembersContainer/>
    }
  }

  toggleState() {
    this.setState({
      render: this.state.render === 'members' ? 'games' : 'members'
    }, this.determineRenderedContainer)
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Soltman's Survivor League</h1>
          <button onClick={this.toggleState}>Show me {this.state.render === 'members' ? 'Games' : 'Survivor League Standings'}</button>
        </header>
        {this.determineRenderedContainer()}
      </div>
    );
  }
}

export default App;
