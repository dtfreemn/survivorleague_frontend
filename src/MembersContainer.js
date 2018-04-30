import React, { Component } from 'react'
import {members} from './members'

class MembersContainer extends Component {
  constructor() {
    super();

    this.state = {
      members: members
    }
  }

  render() {
    return (
      <div>
        I am the members container.
      </div>
    )
  }
}

export default MembersContainer;