import React from 'react';
import Game from './Game'

const Team = (props) => {
  let {info} = props
  let games = info.games

  const renderGames = games => {
    if (typeof games === 'undefined' || !games.length) return

    let gameComponents = games.map(game => <Game key={game.id} data={game} team={info.abbr}/>)

    return gameComponents
  }

  const createLogoLink = info => {
    return <a href={`http://www.espn.com/mlb/team/_/name/${info.abbr.toLowerCase()}`} target='_blank'><img className='logo' src={`http://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/${info.abbr.toLowerCase()}.png&h=150&w=150`} alt={info.abbr}/></a>
  }

  return (
    <div className='team-box'>
      <span>{createLogoLink(info)}</span>
      {renderGames(games)}
    </div>
  )
}

export default Team