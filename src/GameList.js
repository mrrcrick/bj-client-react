import React, { useState, useRef } from "react";



function GameList( props ) {
  const [ games, setGames ]    = useState([]);
  const [showPlayerId, setShowPlayerId] = useState(false);
  const [playerId, setPlayerId] = useState('');
  const [showGameId, setShowGameId] = useState(false);
  const nameBox = useRef(null);
  const domain = 'http://127.0.0.1:8080/';

  //let playerId ='';
  let gameId    ='';
  let token     ='';
  let setInGame = props.setInGame ;
  let setTheName = props.setTheName;
  let inGame = props.inGame;
  let setGameEvent =   props.setGameEvents;
  let setGameModal = props.setGameModal;
  let showGamesAvailable =() => {

    setGames([]);
    getGameList();

  }
  let getGameList = () => {
    //if ( games.length < 1 ) {

      fetch( domain + 'wp-json/black-jack/v1/get_game_list/?load'+ Math.floor(Math.random() * 10 ) ).then( response => response.json())
      .then( data =>{ console.log( data );
        setGames( data );
        return data;
      }
      );

  //  }
  }


  let chsetShowPlayerId = ( e ) =>{

    setShowPlayerId( e.target.checked ) ;
    
  };
  let chsetShowGameId   = ( e ) =>{
    setShowGameId( e.target.checked );

  };


  let setGamePlayerId   = ( e ) =>{
    setPlayerId(e.target.value);
    console.log( playerId );
    sessionStorage.setItem("playerID", playerId);
  };

  let setGameId   = ( e ) =>{
    gameId = e.target.value ;
    console.log( gameId );
    sessionStorage.setItem("gameID", gameId);
  };


  //join games
  let JoinGame = ( e ) =>{
    setInGame(false);
    let eventsarr = [];
    let namebx = document.getElementById("name-box").value;
    setTheName( namebx ); 
    let get_player_url ='';

    get_player_url = domain + 'wp-json/black-jack/v1/addplayer/?game_id=' + e.target.id  + '&player_name=' + namebx;

    fetch( get_player_url ).then( response => response.json())
    .then( data =>{
      //data = JSON.parse( data );
      //console.log( '** JOIN DATA : ' + data.error );
      let obj = typeof data === 'object'; 
      //let playerData = data ;
      if ( ! obj ) {

          data = JSON.parse( data  );

      }

      if ( ! data.error ){ 

        let obj = typeof data === 'object'; 
        let playerData = data ;
        if ( ! obj ) {

          playerData = JSON.parse( playerData  );

        }
        
        inGame( true );
        props.setPlayer( playerData );
        setPlayerId( playerId );
        setTheName( playerData.name );
        eventsarr.push( props.update( e.target.id , playerData.id, playerData.name   ) );
        props.setgameId( e.target.id );
        token = props.getToken;
        let tokenInt = token( playerData.id , e.target.id );
        eventsarr.push(tokenInt);
        setGameEvent( eventsarr );
        var startGameButton = document.getElementById("start-game-button");
        startGameButton.click();
      
    } else {

      setGameModal( {on: true, message: data } );

    }
      
  })


  }



  return (
    <div className="bj-game-list">
      <div className="user-input">
        <p><label>Enter your player name </label><input id="name-box" type="text" ref={ nameBox }></input><span className ="info">&#x1F6C8;</span></p>
        <p><input onClick={ chsetShowPlayerId } type="checkbox"></input> Enter a player ID <label>Player ID </label><input id='player-id' onChange = { setGamePlayerId } type="text" style={ { display: ( showPlayerId )? 'inline-block' : 'none' } } value={ playerId }/><span className ="info">&#x1F6C8;</span></p>
        <p><input onClick={ chsetShowGameId } type="checkbox"></input> Enter a game ID <label>Game ID </label><input onChange = { setGameId } type="text" style={ { display: ( showGameId )? 'inline-block' : 'none' } }/><button style={ {display:( showGameId )? 'inline-block' : 'none' } }> Join </button><span className ="info">&#x1F6C8;</span></p>
      </div>
        <div className="list-data">
        { (games !== false) && games.map((e , i) => (<p onClick={ JoinGame } style={ { color:'white'}} key={ i } id={ e.game_id } > Game ID: { e.game_id } Game status: { e.status } Current number of players: { e.players_in_game } Players: { e.players } </p>) )}
       </div>
      <div> <button onClick = { showGamesAvailable }> Find new games !! </button></div>
    </div>
  );
}

export default GameList;
