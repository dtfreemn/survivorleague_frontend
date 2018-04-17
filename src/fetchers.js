import {helpers} from './helpers'
import {API_PASSWORD} from './secrets'

function fetchCurrentWeekSeries() {
    let today = new Date()
    let startDate = helpers.determineStartOfWeek(today)
    let endDate = helpers.determineEndOfWeek(today)
    let url = `https://api.mysportsfeeds.com/v1.2/pull/mlb/2018-regular/full_game_schedule.json?date=from-${helpers.convertDateToQueryString(startDate)}-to-${helpers.convertDateToQueryString(endDate)}`
    let weekGames = [];
    let encryptedCredentials = btoa(`dtfreemn:${API_PASSWORD}`)
    
    return fetch(url, {
      headers: {
        'Authorization': `Basic ${encryptedCredentials}`
      },
      dataType: 'json',
      // url: `https://api.mysportsfeeds.com/v1.2/pull/mlb/2018-regular/full_game_schedule.json?date=from-${this.determineStartOfWeek(today)}-to-${this.determineEndOfWeek(today)}`,
      async: false,
      data: 'fetched'
    })
  }

function fetchRelevantScores() {
  let today = new Date()
  let startDate = helpers.determineStartOfWeek(today)
  let endDate = helpers.determineEndOfWeek(today)
  let week = getDatesForWeek(startDate, endDate);
  let fetchThem = week.map(date => {
    return fetchScores(date)
  })
  let promises = Promise.all(fetchThem);
  return promises
}

function fetchScores(dateString) {
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

function getDatesForWeek(startDate, endDate) {
  let weekArray = []
  let currentDay = new Date(startDate)
  let today = new Date()
  while (currentDay < today) {
    let dateString = helpers.convertDateToQueryString(currentDay)
    weekArray.push(dateString)
    currentDay = new Date(currentDay.getTime() + 86400000);
  }

  return weekArray.slice(0,-1)
}

export const fetchers = {
  fetchCurrentWeekSeries,
  fetchRelevantScores
}