import React from 'react';
import {helpers} from './helpers'
import Team from './Team'

const TeamsList = (props) => {
  let {games, scores} = props
  
  const combineTeamsGamesAndScores = (games, scores) => {
    if (!games.length) return

    let teamEnum = {}
    
    games.forEach(function(game) {
      if (!teamEnum[game.homeTeam.Name]) {
        teamEnum[game.homeTeam.Name] = {'games': [], 'abbr': game.homeTeam.Abbreviation}
      }

      if (!teamEnum[game.awayTeam.Name]) {
        teamEnum[game.awayTeam.Name] = {'games': [], 'abbr': game.awayTeam.Abbreviation}
      }
      
      if (
          typeof scores[game.id] !== 'undefined' &&
          typeof scores[game.id].awayScore !== 'undefined' &&
          typeof scores[game.id].homeScore !== 'undefined'
        ) {
        game.awayTeam.score = scores[game.id].awayScore
        game.homeTeam.score = scores[game.id].homeScore
      }

      teamEnum[game.homeTeam.Name]['games'].push(game)
      teamEnum[game.awayTeam.Name]['games'].push(game)
    })

    teamEnum['White Sox'].abbr = 'CHW'

    return teamEnum
  }

  const renderTeams = (games, scores) => {
    if (!games.length || !Object.keys(scores).length) return

    let teamEnum = combineTeamsGamesAndScores(games, scores)
    let teams = Object.keys(teamEnum).map(team => <Team key={team} info={teamEnum[team]} />)
    
    return teams
  }

  return (
    <div className='teams-list-grid'>
      {renderTeams(games, scores)}
    </div>
  )
}

export default TeamsList