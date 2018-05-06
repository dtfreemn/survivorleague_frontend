import React, { Component } from 'react'
import {allTeams} from './members'

class Member extends Component {
  constructor() {
    super();

    this.state = {
      clicked: false
    };

    this.renderPicks = this.renderPicks.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  
  renderPicks(weeklyPicks) {
    if (!this.state.clicked) {
      let weeks = Object.keys(weeklyPicks)

      return weeks.map(week => <div className='border-top'> {`${week}: ${weeklyPicks[week].winner || 'X'} over ${weeklyPicks[week].loser || 'X'} - ${weeklyPicks[week].points}`}</div>)
    } else {
      let teams = Object.keys(allTeams).map(team => {
        return <div className={this.determineTeamClass(weeklyPicks, team)}>{team}</div>
      })
      return (
        <div className='team-grid'>
          {teams}
        </div>
      )
    }
  }

  determineTeamClass(weeklyPicks, team) {
    let weeks = Object.keys(weeklyPicks);
    let className = 'one-team not-picked';

    weeks.forEach(week => {
      if (weeklyPicks[week].winner === team) {
        className = 'one-team picked';
      }
    })

    return className;
  }

  handleClick() {
    this.setState({
      clicked: !this.state.clicked
    })
  }
  
  render() {
    const {picks} = this.props;
    const name = Object.keys(picks);
    const weeklyPicks = picks[name];
    
    return (
      <div className='team-box' id={name}>
        <div className='member-name' onClick={this.handleClick}>{name} - {this.props.score}</div>
        {this.renderPicks(weeklyPicks)}
      </div>
    )
  }
}

export default Member