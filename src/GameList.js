import React, { useState, useRef, useEffect } from "react";



function GameList( props ) {
  const [ games, setGames ]    = useState([]);
  const [showPlayerId, setShowPlayerId] = useState(false);
  const [playerId, setPlayerId] = useState('');
  const [showGameId, setShowGameId] = useState(false);
  const nameBox = useRef(null);

  //let playerId ='';
  let gameId    ='';
  let id        ='';
  let token     ='';
  let setInGame = props.setInGame ;

  //let tf = props.fn;
  let getName = props.getTheName;
  let setTheName = props.setTheName;
  let inGame = props.inGame;
  //let game = props.join;
  let gameEvent   =  props.gameEvents;
  let setGameEvent =   props.setGameEvents;
  let setGameModal = props.setGameModal;

  //const testg                  = ['a','b','c','d','e'];
  //let name                     = props.getTheName() ;
//  let showPlayerId, showGameId = false;
  //let games = '';
 // let setName = ( e ) => {
  //  name = e.target.value ;
    //console.log( name );
  //}
  let showGamesAvailable =() => {
    setGames([]);
    getGameList();
    //setGames( games );
  }
  let getGameList = () => {
    if ( games.length < 1 ) {
    // alert( "refresh data name  outside is is " + nam  );
      fetch('http://192.168.1.218:8080/wp-json/black-jack/v1/get_game_list/').then( response => response.json())
      .then( data =>{ console.log( data );
        setGames( data );
        //alert( "refresh data name is " + nam );
        //setThName( nam);
        return data;
      }
      );

    }
  }


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

  let resetGame = ( e ) => {
      gameEvent.map( (evt) => {
        clearInterval(evt);
      })
    
  }

  //join games
  let JoinGame = ( e ) =>{
    setInGame(false);
    let eventsarr = [];
    let namebx = document.getElementById("name-box").value;
    setTheName( namebx ); 
    let get_player_url ='';

    get_player_url = 'http://192.168.1.218:8080/wp-json/black-jack/v1/addplayer/?game_id=' + e.target.id  + '&player_name=' + getName;

    fetch( get_player_url ).then( response => response.json())
    .then( data =>{
     // console.log( data );
      if ( ! data.error ){ 

      
     //   console.group("Join Game data");
      //  console.log(data);
        let obj = typeof data === 'object'; 
      //  console.log(obj);
      //  console.groupEnd("Join Game data");
        let playerData = data ;
        if ( ! obj ) {
          playerData = JSON.parse( playerData  );
        }
        //let playerData = JSON.parse( data );
        inGame( true );
        
        props.setPlayer( playerData );
        setPlayerId( playerId );
        // set the name given from server 
        //alert( playerData.name );
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
        { (games != false) && games.map((e , i) => (<p onClick={ JoinGame } style={ { color:'white'}} key={ i } id={ e.game_id } > Game ID: { e.game_id } Game status: { e.status } Current number of players: { e.players_in_game } Players: { e.players } </p>) )}
       </div>
      <div> <button onClick = { showGamesAvailable }> Find new games !! </button></div>
    </div>
  );
}

export default GameList;
