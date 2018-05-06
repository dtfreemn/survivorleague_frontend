import React, {Component} from 'react';
import TeamsList from './TeamsList'
import WeekSelect from './WeekSelect'
import LeagueStandingsContainer from './LeagueStandingsContainer'

class TeamsContainer extends Component {
  constructor() {
    super();
    
    this.state = {
      games: [],
      scores: {},
      standings: [],
      filter: 'current',
      showLeagueStandings: false,
      loading: true
    };
  
    this.handleRender = this.handleRender.bind(this);
    this.fetchSelectedWeekScoresAsPromises = this.fetchSelectedWeekScoresAsPromises.bind(this);
    this.setScoresToState = this.setScoresToState.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.determineStartOfWeek = this.determineStartOfWeek.bind(this);
    this.determineEndOfWeek = this.determineEndOfWeek.bind(this);
    this.convertDateToQueryString = this.convertDateToQueryString.bind(this);
    this.fetchAndSetLeagueStandings = this.fetchAndSetLeagueStandings.bind(this);
    this.determineContainerToRender = this.determineContainerToRender.bind(this);
    this.toggleSeriesAndStandings = this.toggleSeriesAndStandings.bind(this);
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
    this.fetchAndSetLeagueStandings()
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
    this.setState({loading: true, games: []}, () => {
      setTimeout(() => {
        this.setState({filter, loading: false}, this.handleRender)
      }, 1250)
    })
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

  fetchAndSetLeagueStandings() {
    return fetch(`https://api.mysportsfeeds.com/v1.2/pull/mlb/2018-regular/overall_team_standings.json?teamstats=W,L,RF,RA`, {
      headers: {
        'Authorization': `Basic ZHRmcmVlbW46ZG9ubmllMzE=`
      },
      dataType: 'json',
      async: false,
      data: 'fetched'
    }).then(resp => resp.json()).then(data => {
      this.setState({standings: data['overallteamstandings']['teamstandingsentry']})
    })
  }

  determineContainerToRender() {
    if (this.state.loading || this.state.games.lenght === 0) {
      setTimeout(() => {
        this.setState({loading: false})
      }, 1250)
      return <div><img className='loader' src={require('./baseball-loader.gif')} /></div>
    }
    if (!this.state.showLeagueStandings) {
      return (
        <div>
          <WeekSelect filter={this.state.filter} handleChange={this.handleFilterChange}/>
          <TeamsList games={this.state.games} scores={this.state.scores}/>
        </div>
      )
    } else {
      return (
        <LeagueStandingsContainer standings={this.state.standings}/>
      )
    }
  }

  toggleSeriesAndStandings() {
    this.setState({showLeagueStandings: !this.state.showLeagueStandings})
  }

  render() {
    return (
      <div className='grey'>
        <button onClick={this.toggleSeriesAndStandings}>Show Me {!this.state.showLeagueStandings ? 'Current MLB Standings' : 'Weekly Series'}</button>
        {this.determineContainerToRender()}
      </div>
    )
  }
}

export default TeamsContainer