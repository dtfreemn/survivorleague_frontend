import {API_PASSWORD} from './secrets'
import {helpers} from './helpers'

export function fetchCurrentWeekSeries() {
  let today = new Date()
  let startDate = helpers.determineStartOfWeek(today)
  let endDate = helpers.determineEndOfWeek(today)
  let url = `https://api.mysportsfeeds.com/v1.2/pull/mlb/2018-regular/full_game_schedule.json?date=from-${helpers.convertDateToQueryString(startDate)}-to-${helpers.convertDateToQueryString(endDate)}`
  let encryptedCredentials = btoa(`dtfreemn:${API_PASSWORD}`)
  
  let options = {
    headers: {
      'Authorization': `Basic ${encryptedCredentials}`
    },
    dataType: 'json',
    async: false,
    data: 'fetched'
  }

  return fetch(url, options)
}

export function fetchScores(dateString) {
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