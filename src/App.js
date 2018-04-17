import React, { Component } from 'react';
import {helpers} from './helpers'
import {API_PASSWORD} from './secrets'
import './App.css';

class App extends Component {
  
  getDatesForWeek(startDate, endDate) {
    let weekArray = []
    let currentDay = new Date(startDate)
    let today = new Date()
    while (currentDay < today) {
      let dateString = helpers.convertDateToQueryString(currentDay)
      weekArray.push(dateString)
      currentDay = new Date(currentDay.getTime() + 86400000);
    }
    
    // let lastDay = helpers.convertDateToQueryString(endDate)

    // weekArray.push(lastDay)
    return weekArray.slice(0,-1)
  }

  fetchCurrentWeekSeries() {
    let today = new Date()
    let startDate = helpers.determineStartOfWeek(today)
    let endDate = helpers.determineEndOfWeek(today)
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
        let week = this.getDatesForWeek(startDate, endDate);
        window.scores = [];
        let fetchThem = week.map(date => {
          return this.fetchScores(date)
        })
        let promises = Promise.all(fetchThem);
        return promises
      })
      .then(promiseArray => {
        promiseArray.forEach(scoreboard => {
          scoreboard.scoreboard.gameScore.forEach(game => {
            scoresMap[game.game.ID] = {'awayScore': game.awayScore, 'homeScore': game.homeScore}
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


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Soltman's Survivor League</h1>
        </header>
          {this.fetchCurrentWeekSeries()}
        <div className='container' id="games"></div>
      </div>
    );
  }
}

export default App;
