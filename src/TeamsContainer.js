import React, {Component} from 'react';
import {API_PASSWORD} from './secrets';
import TeamsList from './TeamsList'
import WeekSelect from './WeekSelect'

class TeamsContainer extends Component {
  constructor() {
    super();
    
    this.state = {
      games: [],
      scores: {},
      filter: 'current'
    };
  
    this.handleRender = this.handleRender.bind(this);
    this.fetchSelectedWeekScoresAsPromises = this.fetchSelectedWeekScoresAsPromises.bind(this);
    this.setScoresToState = this.setScoresToState.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.determineStartOfWeek = this.determineStartOfWeek.bind(this);
    this.determineEndOfWeek = this.determineEndOfWeek.bind(this);
    this.convertDateToQueryString = this.convertDateToQueryString.bind(this);
  }

  componentDidMount() {
    this.handleRender()
  }

  handleRender(day = new Date(), week = this.state.filter) {
    if (week === 'last') {
        day = new Date(day.getTime() - (86400000*7));
    } else if (week === 'next') {
        day = new Date(day.getTime() + (86400000*7));
    }

    let startDate = this.determineStartOfWeek(day);
    let endDate = this.determineEndOfWeek(day);

    this.fetchAndSetSelectedWeekSeriesToState(week);
    this.fetchSelectedWeekScoresAsPromises(startDate, endDate, week).then(this.setScoresToState);
  }

  setScoresToState(promiseArray) {
    let scores = {};
    
    promiseArray.forEach(scoreboard => {
      scoreboard.scoreboard.gameScore.forEach(game => {
        scores[game.game.ID] = {'awayScore': game.awayScore, 'homeScore': game.homeScore};
      });
    });
    
    this.setState({scores});
  }
  
  fetchSelectedWeekScoresAsPromises(startDate, endDate, week) {
    let weekDates = this.getDatesForWeek(startDate, endDate, week);
    let fetchThem = weekDates.map(date => {
      return this.fetchScores(date);
    });
    let promises = Promise.all(fetchThem);
    return promises;
  }

  fetchScores(dateString) {
    return fetch(`https://api.mysportsfeeds.com/v1.2/pull/mlb/2018-regular/scoreboard.json?fordate=${dateString}`, {
      headers: {
        'Authorization': `Basic ZHRmcmVlbW46ZG9ubmllMzE=`
      },
      dataType: 'json',
      async: false,
      data: 'fetched'
    }).then(resp => resp.json());
  }

  fetchAndSetSelectedWeekSeriesToState(week) {
    let day = new Date();
    if (week === 'last') {
        day = new Date(day.getTime() - (86400000*7));
    } else if (week === 'next') {
        day = new Date(day.getTime() + (86400000*7));
    }
    let startDate = this.determineStartOfWeek(day);
    let endDate = this.determineEndOfWeek(day);
    let url = `https://api.mysportsfeeds.com/v1.2/pull/mlb/2018-regular/full_game_schedule.json?date=from-${this.convertDateToQueryString(startDate)}-to-${this.convertDateToQueryString(endDate)}`;
    
    fetch(url, {
      headers: {
        'Authorization': `Basic ZHRmcmVlbW46ZG9ubmllMzE=`
      },
      dataType: 'json',
      async: false,
      data: 'fetched'
    })
      .then(resp => resp.json())
      .then(gamesObj => {
        let games = gamesObj.fullgameschedule.gameentry
        this.setState({games});
      })
  }

  getDatesForWeek(startDate, endDate, week) {
    let weekArray = [];
    let currentDay = new Date(startDate);
    let today = new Date();
    let end = week === 'current' ? today : endDate;

    while (currentDay <= end) {
      let dateString = this.convertDateToQueryString(currentDay);
      weekArray.push(dateString);
      currentDay = new Date(currentDay.getTime() + 86400000);
    }

    if (week === 'current') {
        weekArray = weekArray.slice(0,-1);
    }
    return weekArray;
  }

  handleFilterChange(filter) {
    this.setState({filter}, this.handleRender)
  }

  determineStartOfWeek(today) {
    let day = today

    while (day.getDay() !== 1) {
      day = new Date(day.getTime() - 86400000);
    }

    return day
  }

  convertDateToQueryString(dateToConvert) {
    let month = `0${dateToConvert.getMonth() + 1}`.slice(-2)
    let date = `0${dateToConvert.getDate()}`.slice(-2)
    let year = dateToConvert.getFullYear()

    return `${year}${month}${date}`
  }

  determineEndOfWeek(today) {
    let day = today

    while (day.getDay() !== 0) {
      day = new Date(day.getTime() + 86400000);
    }

    return day
  }

  render() {
    return (
      <div className='grey'>
        <WeekSelect filter={this.state.filter} handleChange={this.handleFilterChange}/>
        <TeamsList games={this.state.games} scores={this.state.scores}/>
      </div>
    )
  }
}

export default TeamsContainer