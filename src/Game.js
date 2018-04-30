import React from 'react'

const Game = props => {
  let {team, data} = props
  let {awayTeam} = data
  let {homeTeam} = data
  homeTeam.Name = homeTeam.Name === 'Diamondbacks' ? 'Dbacks' : homeTeam.Name
  awayTeam.Name = awayTeam.Name === 'Diamondbacks' ? 'Dbacks' : awayTeam.Name

  
  const determineWLClass = (awayTeam, homeTeam, gameType) => {
    if (!awayTeam.score || !homeTeam.score) return
    
    let homeScore = parseInt(homeTeam.score, 10)
    let awayScore = parseInt(awayTeam.score, 10)

    if (gameType === 'home') {
      return homeScore > awayScore ? 'win' : 'loss'
    } else {
      return awayScore > homeScore ? 'win' : 'loss'
    }
  }
  
  const makeDate = date => {
    return <span className='small'>{`${date.split('-').slice(1).join('/')}`}</span>
  }

  const renderHomeGame = (awayTeam, homeTeam, data) => {
    return (
      <div className={`home-game ${determineWLClass(awayTeam, homeTeam, 'home')}`}>
      {data.date ? makeDate(data.date) : ''} {awayTeam.Name}{awayTeam.score ? ` ${awayTeam.score}` : ''} vs {homeTeam.Name}{homeTeam.score ? ` ${homeTeam.score}` : ''}
      </div>)
  }

  const renderAwayGame = (awayTeam, homeTeam, data) => {
    return (
      <div className={`away-game ${determineWLClass(awayTeam, homeTeam, 'away')}`}>
      {data.date ? makeDate(data.date) : ''} {awayTeam.Name}{awayTeam.score ? ` ${awayTeam.score}` : ''} @ {homeTeam.Name}{homeTeam.score ? ` ${homeTeam.score}` : ''}
      </div>
    )
  }

  const renderGame = (awayTeam, homeTeam, team) => {
    return homeTeam.Abbreviation === team 
      ? renderHomeGame(awayTeam, homeTeam, data)
      : renderAwayGame(awayTeam, homeTeam, data)
  }
  
  return (
    <div>{renderGame(awayTeam, homeTeam, team)}</div>
  )
}

export default Game