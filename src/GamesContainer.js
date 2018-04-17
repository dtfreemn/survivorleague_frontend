import React, { Component } from 'react';
import {helpers} from './helpers'
import {API_PASSWORD} from './secrets'
import {fetchers} from './fetchers'
import './App.css';

class GamesContainer extends Component {
  constructor() {
    super()
    
    this.state = {
      games: '',
      scoresMap: {}
    }

    this.setScoresState = function(scoresArray) {
      let scoresMap = helpers.makeScoresMap(scoresArray)
      this.setState({scoresMap})
    }.bind(this)
  }

  componentDidMount() {
    fetchers.fetchCurrentWeekSeries()
      .then(resp => resp.json())
      .then(games => this.setState({games: games.fullgameschedule.gameentry}))
      .then(fetchers.fetchRelevantScores)
      .then(this.setScoresState)
      .then(() => {
        helpers.processGames(this.state.games, this.state.scoresMap)
      })
  }

  render() {
    return (
      <div>
      </div>
    )
  }
}

export default GamesContainer;