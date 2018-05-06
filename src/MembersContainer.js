import React, { Component } from 'react'
import {members} from './members'
import Member from './Member'

class MembersContainer extends Component {
  constructor() {
    super();

    this.state = {
      members: members
    }

    this.renderMembers = this.renderMembers.bind(this);
    this.calculateCurrentScore = this.calculateCurrentScore.bind(this);
  }

  renderMembers() {
    return members.map(member => {
      return <Member key={Object.keys(member)[0]} picks={member} score={this.calculateCurrentScore(member)}/>
    }).sort((a,b) => b.props.score - a.props.score)
  }

  calculateCurrentScore(member) {
    let name = Object.keys(member)[0]
    let weeks = Object.keys(member[name])
    let weekData = weeks.map(week => member[name][week])

    return weekData.reduce((final, week) => final + week.points, 0)
  }

  render() {
    return (
      <div className='teams-list-grid' >
        {this.renderMembers()}
      </div>
    )
  }
}

export default MembersContainer;