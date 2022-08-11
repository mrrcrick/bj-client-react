import React, { useState, useRef, useEffect } from "react";



function Game() {
  const [ games, setGames ] = useState(['']);
  const testg = ['a','b','c','d','e'];

  return (
    <div className="bj-game-list">
      { (games != false) && games.map((e , i) => (<p style={ { color:'white'}} key={ i } id={ e.game_id } > Game ID: { e.game_id } Game status: { e.status } Number of players: { e.max_players } Current number of players: { e.players_in_game } </p>) )}
    </div>
  );
}

export default Game;
