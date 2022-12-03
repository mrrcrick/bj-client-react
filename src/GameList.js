import React, { useState, useRef, useEffect } from "react";



function GameList( props ) {
  const [ games, setGames ]    = useState([]);
  const [showPlayerId, setShowPlayerId] = useState(false);
  const [playerId, setPlayerId] = useState('');
  const [showGameId, setShowGameId] = useState(false);
  const nameBox = useRef(null);

  //let playerId ='';
  let gameId   ='';
  let id       ='';
  let token    ='';

  let tf = props.fn;
  let getName = props.getTheName;
  let setThName = props.setTheName;
  let inGame = props.inGame;
  let game = props.join;

  const testg                  = ['a','b','c','d','e'];
  let name                     = props.getTheName() ;
//  let showPlayerId, showGameId = false;
  //let games = '';
  let setName = ( e ) => {
    name = e.target.value ;
    //console.log( name );
  }
  let showGamesAvailable =() => {
    setGames([]);
    getGameList();
    //setGames( games );
  }
  let getGameList = () => {
    if ( games.length < 1 ) {
    // alert( "refresh data name  outside is is " + nam  );
      fetch('http://127.0.0.1:8080/wp-json/black-jack/v1/get_game_list/').then( response => response.json())
      .then( data =>{ console.log( data );
        setGames( data );
        //alert( "refresh data name is " + nam );
        //setThName( nam);
        return data;
      }
      );

    }
  }

  const startGame = ( e ) => {


  }
  useEffect(() => {


  }, []);
  let chsetShowPlayerId = ( e ) =>{
    setShowPlayerId( e.target.checked ) ;
    //console.log( showPlayerId );
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
    
    let namebx = document.getElementById("name-box").value;
    let get_player_url ='';
    if( playerId ) {
      get_player_url = 'http://127.0.0.1:8080/wp-json/black-jack/v1/getplayer/?player_id=' + playerId +'&game_id=' + e.target.id ;
    } else {
      get_player_url = 'http://127.0.0.1:8080/wp-json/black-jack/v1/addplayer/?game_id=' + e.target.id  + '&player_name=' + namebx;
    }
    fetch( get_player_url ).then( response => response.json())
    .then( data =>{
      let playerData = JSON.parse( data );
      inGame( true );
      props.setPlayer( playerData );
      setPlayerId( playerData.id );
      props.update( e.target.id , playerData.id );
      props.setgameId( e.target.id );
      token = props.getToken;
      token( playerData.id, e.target.id );
      
  })


  }



  return (
    <div className="bj-game-list">
      <div className="user-input">
        <p><label>Enter your player name </label><input id="name-box" type="text" ref={ nameBox }></input><span className ="info">&#x1F6C8;</span></p>
        <p><input onClick={ chsetShowPlayerId } type="checkbox"></input> Enter a player ID <label>Player ID </label><input onChange = { setGamePlayerId } type="text" style={ { display: ( showPlayerId )? 'inline-block' : 'none' } } value={ playerId }/><span className ="info">&#x1F6C8;</span></p>
        <p><input onClick={ chsetShowGameId } type="checkbox"></input> Enter a game ID <label>Game ID </label><input onChange = { setGameId } type="text" style={ { display: ( showGameId )? 'inline-block' : 'none' } }/><button style={ {display:( showGameId )? 'inline-block' : 'none' } }> Join </button><span className ="info">&#x1F6C8;</span></p>
      </div>
        <div className="list-data">
        { (games != false) && games.map((e , i) => (<p onClick={ JoinGame } style={ { color:'white'}} key={ i } id={ e.game_id } > Game ID: { e.game_id } Game status: { e.status } Number of players: { e.max_players } Current number of players: { e.players_in_game } Players: { e.players } Winners : { e.winners } </p>) )}
       </div>
      <div> <button onClick = { showGamesAvailable }> Find new games !! </button></div>
    </div>
  );
}

export default GameList;
