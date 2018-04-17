import React, { Component } from 'react';
import {helpers} from './helpers'
import {API_PASSWORD} from './secrets'
import './App.css';

class App extends Component {

  constructor() {
    super()

    this.state = {
        filter: 'current'
    }

    this.handleFilterChange = this.handleFilterChange.bind(this)
  }

  getDatesForWeek(startDate, endDate, week) {
    let weekArray = []
    let currentDay = new Date(startDate)
    let today = new Date()
    let end = week === 'current' ? today : endDate

    while (currentDay <= end) {
      let dateString = helpers.convertDateToQueryString(currentDay)
      weekArray.push(dateString)
      currentDay = new Date(currentDay.getTime() + 86400000);
    }

    // let lastDay = helpers.convertDateToQueryString(endDate)

    // weekArray.push(lastDay)
    if (week === 'current') {
        weekArray = weekArray.slice(0,-1)
    }
    return weekArray
  }

  fetchCurrentWeekSeries(week) {
    let day = new Date()
    if (week === 'last') {
        day = new Date(day.getTime() - (86400000*7))
    } else if (week === 'next') {
        day = new Date(day.getTime() + (86400000*7))
    }
    let startDate = helpers.determineStartOfWeek(day)
    let endDate = helpers.determineEndOfWeek(day)
    let url = `https://api.mysportsfeeds.com/v1.2/pull/mlb/2018-regular/full_game_schedule.json?date=from-${helpers.convertDateToQueryString(startDate)}-to-${helpers.convertDateToQueryString(endDate)}`
    let scoresMap = {};
    let encryptedCredentials = btoa(`dtfreemn:${API_PASSWORD}`)
    fetch(url, {
      headers: {
        'Authorization': `Basic ${encryptedCredentials}`
      },
      dataType: 'json',
      // url: `https://api.mysportsfeeds.com/v1.2/pull/mlb/2018-regular/full_game_schedule.json?date=from-${this.determineStartOfWeek(today)}-to-${this.determineEndOfWeek(today)}`,
      async: false,
      data: 'fetched'
    })
      .then(resp => resp.json())
      .then(games => {
        window.games = games.fullgameschedule.gameentry
      })
      .then(() => {
        let weekDates = this.getDatesForWeek(startDate, endDate, week);
        window.scores = {};
        let fetchThem = weekDates.map(date => {
          return this.fetchScores(date)
        })
        let promises = Promise.all(fetchThem);
        return promises
      })
      .then(promiseArray => {
        promiseArray.forEach(scoreboard => {
          scoreboard.scoreboard.gameScore.forEach(game => {
            scoresMap[game.game.ID] = {'awayScore': game.awayScore, 'homeScore': game.homeScore}
            window.scores[game.game.ID] = scoresMap[game.game.ID]
          })
        })
        helpers.processGames(window.games, scoresMap)
      })
  }

  fetchScores(dateString) {
    let encryptedCredentials = btoa(`dtfreemn:${API_PASSWORD}`)
    return fetch(`https://api.mysportsfeeds.com/v1.2/pull/mlb/2018-regular/scoreboard.json?fordate=${dateString}`, {
      headers: {
        'Authorization': `Basic ${encryptedCredentials}`
      },
      dataType: 'json',
      // url: `https://api.mysportsfeeds.com/v1.2/pull/mlb/2018-regular/full_game_schedule.json?date=from-${this.determineStartOfWeek(today)}-to-${this.determineEndOfWeek(today)}`,
      async: false,
      data: 'fetched'
    }).then(resp => resp.json())
  }

  handleFilterChange(event) {
    let filter = event.target.value
    this.setState({filter})
    this.fetchCurrentWeekSeries(filter)
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Soltman's Survivor League</h1>
        </header>
        <select onChange={this.handleFilterChange}>
            <option value={this.state.filter}>Select a Week</option>
            <option value="current">This Week</option>
            <option value="last">Last Week</option>
            <option value="next">Next Week</option>
          </select>
        <div className='container' id="games"></div>
      </div>
    );
  }
}

export default App;
