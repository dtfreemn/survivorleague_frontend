import React from 'react'

const LeagueStandingsContainer = props => {
  const standingsComponents = props.standings.map(team => {
    return (
      <div className='league-standings-row' key={team.team.Name}>
        <div className='league-standings-cell'>{team.rank}</div>
        <div className='league-standings-cell'>{team.team.Name}</div>
        <div className='league-standings-cell'>{team.stats.Wins['#text']}</div>
        <div className='league-standings-cell'>{team.stats.Losses['#text']}</div>
        <div className='league-standings-cell'>{team.stats.RunsFor['#text']}</div>
        <div className='league-standings-cell'>{team.stats.RunsAgainst['#text']}</div>
      </div>
    )
  })
  
  return (
    <div>
      <div className='league-standings-row'>
        <div>Current Rank</div>
        <div>Team</div>
        <div>W</div>
        <div>L</div>
        <div>Runs For</div>
        <div>Runs Against</div>
      </div>
      {standingsComponents}
    </div>
  )
}

export default LeagueStandingsContainer