import React, { Component } from 'react';
import {helpers} from './helpers'
import {fetchCurrentWeekSeries, fetchScores} from './fetchers'
import './App.css';

class SeriesContainer extends Component {
  
  state = {
    games: [],
    scores: {}
  }

  fetchGames() {
    fetchCurrentWeekSeries()
      .then(resp => resp.json())
      .then(games => this.setState({games}))
      .then(() => {
        debugger
        let today = new Date()
        let startDate = helpers.determineStartOfWeek(today)
        let endDate = helpers.determineEndOfWeek(today)
        let week = this.getDatesForWeek(startDate, endDate);
        // window.scores = [];
        let fetchScorePromises = week.map(date => {
          return fetchScores(date)
        })
        let promises = Promise.all(fetchScorePromises);
    
        return promises
      })
      .then(promiseArray => {
        let scoresMap = {}
        promiseArray.forEach(scoreboard => {
          scoreboard.scoreboard.gameScore.forEach(game => {
            scoresMap[game.game.ID] = {'awayScore': game.awayScore, 'homeScore': game.homeScore}
          })
        })
        this.setState({scores: scoresMap})
        // helpers.processGames(window.games, scoresMap)
      })
  }

  componentDidMount() {
    this.fetchGames()
  }
      // .then(() => {
      //   let week = this.getDatesForWeek(startDate, endDate);
      //   window.scores = [];
      //   let fetchScorePromises = week.map(date => {
      //     return this.fetchScores(date)
      //   })
      //   let promises = Promise.all(fetchScorePromises);
      //   return promises
      // })
      // .then(promiseArray => {
      //   promiseArray.forEach(scoreboard => {
      //     scoreboard.scoreboard.gameScore.forEach(game => {
      //       scoresMap[game.game.ID] = {'awayScore': game.awayScore, 'homeScore': game.homeScore}
      //     })
      //   })
      //   helpers.processGames(window.games, scoresMap)
      // })

  // fetchScores(dateString) {
  //   let encryptedCredentials = btoa(`dtfreemn:${API_PASSWORD}`)
  //   return fetch(`https://api.mysportsfeeds.com/v1.2/pull/mlb/2018-regular/scoreboard.json?fordate=${dateString}`, {
  //     headers: {
  //       'Authorization': `Basic ${encryptedCredentials}`
  //     },
  //     dataType: 'json',
  //     // url: `https://api.mysportsfeeds.com/v1.2/pull/mlb/2018-regular/full_game_schedule.json?date=from-${this.determineStartOfWeek(today)}-to-${this.determineEndOfWeek(today)}`,
  //     async: false,
  //     data: 'fetched'
  //   }).then(resp => resp.json())
  // }

  getDatesForWeek(startDate, endDate) {
    debugger
    let weekArray = []
    let currentDay = new Date(startDate)
    let today = new Date()
    while (currentDay < endDate) {
      let dateString = helpers.convertDateToQueryString(currentDay)
      weekArray.push(dateString)
      currentDay = new Date(currentDay.getTime() + 86400000);
    }
    
    let lastDay = helpers.convertDateToQueryString(endDate)

    // weekArray.push(lastDay)
    return weekArray
  }

  render() {
    return (
      <div>
        Hello
      </div>
    )
  }
}

export default SeriesContainer;