function determineStartOfWeek(today) {
  let day = today

  while (day.getDay() !== 1) {
    day = new Date(day.getTime() - 86400000);
  }

  return day
}

function convertDateToQueryString(dateToConvert) {
    let month = `0${dateToConvert.getMonth() + 1}`.slice(-2)
    let date = `0${dateToConvert.getDate()}`.slice(-2)
    let year = dateToConvert.getFullYear()

    return `${year}${month}${date}`
  }

function determineEndOfWeek(today) {
  let day = today

  while (day.getDay() !== 0) {
    day = new Date(day.getTime() + 86400000);
  }

  return day
}

function makeTeamObjects(games) {
  let teamMap = {}
  games.forEach(function(game) {
    if (!teamMap[game.homeTeam.Name]) {
      teamMap[game.homeTeam.Name] = {'games': [], 'abbr': game.homeTeam.Abbreviation}
    }

    if (!teamMap[game.awayTeam.Name]) {
      teamMap[game.awayTeam.Name] = {'games': [], 'abbr': game.awayTeam.Abbreviation}
    }

    teamMap[game.homeTeam.Name]['games'].push(game)
    teamMap[game.awayTeam.Name]['games'].push(game)
  })

  teamMap['White Sox'].abbr = 'CHW'

  return teamMap
}

function makeTeamSeries(teamObjects, scores) {
  let htmlString = '<div class="row team-series-row">'
  let columnCheck = 0

  for (let team in teamObjects) {
    let games = teamObjects[team].games
    htmlString += `<div class="col-sm individual-team-series">${team}<div><img src="http://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/${teamObjects[team].abbr.toLowerCase()}.png&h=150&w=150"></div>`

    function homeGameClass(gameScoreObj) {
      if (gameScoreObj && gameScoreObj.homeScore) {
        if (gameScoreObj.awayScore < gameScoreObj.homeScore) {
          return 'home-game win'
        } else {
          return 'home-game loss'
        }
      }

      return 'home-game'
    }

    function awayGameClass(gameScoreObj) {
      if (gameScoreObj && gameScoreObj.awayScore) {
        if (gameScoreObj.homeScore < gameScoreObj.awayScore) {
          return 'away-game win'
        } else {
          return 'away-game loss'
        }
      }

      return 'away-game'
    }

    games = games.map(game => {
      if (game.homeTeam.Name === team) {
        let str = `<div id=${game.id} class="${homeGameClass(scores[game.id])}"><span class='small'>(${game.date.split('-').slice(1).join('/')})</span> vs ${game.awayTeam.Name}`
        if (scores[game.id] && scores[game.id].homeScore) {
          str += ` <span class='small'>${scores[game.id].awayScore || 0} - ${scores[game.id].homeScore || 0}</span></div>`
        } else if (game.scheduleStatus === 'Postponed') {
            str += ` <span class='small'>(PDP)</span></div>`
        } else {
          str += `</div>`
        }
        return str
      } else {
        let str = `<div id=${game.id} class="${awayGameClass(scores[game.id])}"><span class='small'>(${game.date.split('-').slice(1).join('/')})</span> vs ${game.homeTeam.Name}`
        if (scores[game.id] && scores[game.id].awayScore) {
          str += ` <span class='small'>${scores[game.id].awayScore || 0} - ${scores[game.id].homeScore || 0}</span></div>`
        } else {
          str += '</div>'
        }
        return str
      }
    }).join('')

    htmlString += `${games}</div>`
    columnCheck++
    if (columnCheck > 0 && columnCheck % 5 === 0) {
      htmlString += '</div><br /><br /></be><div class="row team-series-row">'
    }
  }

  return `${htmlString}</div>`
}

function processGames(games, scores) {
  let teamObjects = makeTeamObjects(games)
  let gameDivs = makeTeamSeries(teamObjects, scores)

  gameDivs = `<h2>This Week's Series</h2><br /><br />${gameDivs}`

  document.getElementById('games').innerHTML = gameDivs
}

export const helpers = {
  determineStartOfWeek,
  determineEndOfWeek,
  convertDateToQueryString,
  makeTeamObjects,
  makeTeamSeries,
  processGames
}
