import logo from './logo.svg';
import './App.css';
import GameList from './GameList';
import React, { useState, useRef, useEffect } from "react";
import { getByPlaceholderText } from '@testing-library/react';





function App() {

  const [ val, setVal ]               = useState("");
  const [ tab, setTab ]               = useState("CreateGame");
  const [ cnt, setCnt ]               = useState(0);
  const [ player, setPlayer ]         = useState({ cards:[],id: '', name:'' });
  const [ game_id, setGame_id ]       = useState('');
  const [ deckCard, setDeckCard ]     = useState( { current_suit:'', current_value:0, names: [], player_index: 0 } );
  const [ playerHand, setPlayerHand ] = useState([]);
  const [ token, setToken ]           = useState('');
  const [ playersGo, setPlayersGo ]   = useState('');
  const [ gameEvent, setGameEvent ]   = useState('');
  const [ inGame, setInGame ]         = useState( false );
  const [ theName, setTheName ]       = useState('');
  const [ lastCards, setLastCards ]   = useState(0);
  const [ gameEvents, setGameEvents]  = useState([]);
  const [ gameModal, setGameModal]    = useState({ on: false , message:'' } );


  let pick_up_url        = '';
  let gettoken = '';
  let intervalId  = '';
  let message = '';
  let hasWon = false;
// reset the game if not in game
useEffect(() => {
  if ( ! inGame ) {

    resetTheGame();
  }


}, [inGame] );



// get the name
let getTheName = function(){
  return theName;
}

// set the game id
let setTheGameId = function( id ){
 setGame_id( id );

}

// reset the game 
let resetTheGame = function(){
  // alert();
  //setVal = useState("");
  setPlayer({ cards:[],id: player.id, name: player.name });
  setGame_id ('');
  setDeckCard( { current_suit:'', current_value:0, names: [], player_index: 0 } );
  setPlayerHand([]);
  setToken('');
  setPlayersGo('');
  setGameEvent([]);
  setLastCards(0);
  pick_up_url = '';
  hasWon = false;
  gameEvents.map( (evt) => {
    clearInterval(evt);
  });
  

}
let turnOffModal = ()=> {
  setGameModal({ on:  false , message:' ' } );
}

var testdeckcard = () => {
  console.log('*** cards played array ' + JSON.stringify( deckCard.cards_played ) ) ;
}

function setCardSuit( e ){

  let newSuit = e.target.value;
  let ind     = e.target.getAttribute("index");
  let pl = player;
  pl.cards[ ind ].suit = newSuit;
  setPlayer( pl );

}
// suit drop down GameList
function SuitDropDown( value, ind ) {

  if ( value == 1 ){
    return ( <select onChange = { setCardSuit } index={ind}>
      <option value="H">Hearts</option>
      <option value="S">Spades</option>
      <option value="C">Clubs</option>
      <option value="D">Diamonds</option>
    </select> );
}
}
// deckCard
function CardOnDeck(){
   //console.log("++++++ " + deckCard + " ++++++++++++++")
    let cardfile ='';

    if ( deckCard.current_value > 1 && deckCard.current_value < 10 ){
      cardfile = deckCard.current_value + deckCard.current_suit ;
    }
    if ( deckCard.current_value == 1 ){
      cardfile = 'A' + deckCard.current_suit;
    }
    if ( deckCard.current_value == 10 ){
      cardfile = 'T' + deckCard.current_suit ;
    }
    if ( deckCard.current_value == 11 ){
      cardfile = 'J' + deckCard.current_suit ;
    }
    if ( deckCard.current_value == 12 ){
      cardfile = 'Q' + deckCard.current_suit  ;
    }
    if ( deckCard.current_value == 13 ){
      cardfile = 'K' + deckCard.current_suit ;
    }
    if ( cardfile ) {
      cardfile = 'cards/' + cardfile + '.gif';
      return (
        <div className="deckCard">
          <img src={ cardfile }/>
        </div>);
    } else {
      return(<div> EMPTY DECK CARD !!!!! </div>)
    }

}

function togglelastCard() {
  let islastCard = 0;
  if ( lastCards == 0 ) {
    islastCard = 1;
  } else {
    islastCard = 0;
  }
  setLastCards( islastCard );
}

function addCardToHand( e ) {
//  console.log('[ ' + e.target.getAttribute("suit") + ']');
  let value       = e.target.getAttribute("value") ;
  let suit        = e.target.getAttribute("suit") ;
  let id          = e.target.getAttribute("id") ;

  if ( id !== null && suit !==null &&  value !== null) {
    let card        = { value: value, suit: suit, accesskey: id };
    let cardsInHand = playerHand;
    cardsInHand.push( card );
    setPlayerHand( [ ...cardsInHand] );
    let pl = player;

    pl.cards = pl.cards.filter(function( remCard ) {
      console.log( remCard );
      //return item !== value
      if ( remCard.accesskey !== id ){
        return remCard;
      }
    })
    setPlayer( pl );
   // console.log( players_cards );
}


}

function removeCardFromHand( e ) {
  testdeckcard();
  let value       = e.target.getAttribute("value") ;
  let suit        = e.target.getAttribute("suit") ;
  let id          = e.target.getAttribute("id") ;

  if ( id !== null && suit !==null &&  value !== null) {
    let card        = { value: value, suit: suit, accesskey: id };
   // console.log('--------'+  value +' '+id +' ----------------------');
    let currPlayer = player;
    currPlayer.cards.push( card );
   // console.log('=====' + currPlayer.cards );
    setPlayer( currPlayer );
    let plh = playerHand;

    plh = plh.filter(function( remCard ) {
     // console.log("the id : " + id )
     // console.log( remCard );
      //return item !== value
      if ( remCard.accesskey !== id ){
        return remCard;
      }
    })
    setPlayerHand( [ ...plh ] );
    console.log( plh );
}

}

function submitHand(){
  //  hand = [];
  console.log('TOKEN ' +  token );
  if ( ! token ) {
    setGameModal({on: true, message: "Not your turn to play "});
  }
  if ( token && Array.isArray( playerHand ) && playerHand.length > 0 ) {
      let submit_url = 'game_id=' + getGameID() + '&player_id=' + player.id + '&last_card='+lastCards + '&turn_token=' + token;
      playerHand.map( function( h, i ){
        submit_url += '&hand[]=' + h.accesskey ;
        if ( h.value == 1 ){
          submit_url += '&set_cards[' + i + '][id]=' + h.accesskey + '&set_cards[' + i + '][suit]=' + h.suit;

        }

      });
      console.log("the submit URL: " + submit_url);
        fetch('http://192.168.1.218:8080/wp-json/black-jack/v1/submithand/?' + submit_url ).
        then( response => response.json()).then( data => {
          console.log( data );
          if ( data[1] == player.id){
            hasWon = true;
            setGameModal( { on:true, message: "You Win!!!!"} );
            document.title = "Watching Game";
          } else if ( data[2] == 'valid'){
            setPlayer( data[0] )  ;
            setPlayerHand( [] );
            setToken('');
        }
        if ( data[2] == 'invalid' ){
          //alert( data[3] );
          setGameModal({on:true, message: data[3]});
        }
        setLastCards( 0 );
        checkGameTips();

      }).catch(
          error => {
            throw(error);
          });
  }

}


function generateCardImageLink( card ){
    let cardfile = '';
    if ( card.value > 1 && card.value < 10 ){
      cardfile = card.value + card.suit ;
    }
    if ( card.value == 1 ){
      cardfile = 'A' + card.suit ;
    }
    if ( card.value == 10 ){
      cardfile = 'T' + card.suit ;
    }
    if ( card.value == 11 ){
      cardfile = 'J' + card.suit ;
    }
    if ( card.value == 12 ){
      cardfile = 'Q' + card.suit ;
    }
    if ( card.value == 13 ){
      cardfile = 'K' + card.suit ;
    }
    cardfile = 'cards/' + cardfile + '.gif';
    return cardfile;
}

// get the player id if not set use local storage 
  let getPlayerId = ()=> {

    let playerID = player.id ;
    if (typeof  player.id === "undefined" ||  player.id  === null || player.id  =='') {
      playerID = document.getElementById("player-id").value;
    }
    playerID = document.getElementById("player-id").value;
    if (typeof  playerID=== "undefined" ||  playerID === null || playerID =='') {
      playerID = sessionStorage.getItem("playerID");
    }
    return playerID;

  }
// get the game id if not set use local storage 
  let getGameID = ()=> {

    let gameID = '';
    if (typeof game_id === "undefined" || game_id === null) {
      gameID = sessionStorage.getItem("gameID");
    } else {
      gameID = game_id ;
    }
    return gameID;


  }

// get the game token process
  let getGameToken = ( playerid, gameid )=> {
    console.log( " ply id " + playerid + " game id " + gameid );
    //console.log( "token type is " + typeof( token + "length : ") + token.length );
  
    gettoken = window.setInterval( function(){
  
        fetch('http://192.168.1.218:8080/wp-json/black-jack/v1/getplayertoken/?id=' + playerid + '&game_id=' + gameid ).then( response => response.json() )
        .then( data =>{ //console.log( data );
        //  document.querySelector('#token').value = data ;
          let token = data;
         // console.log( 'the token is ' + token );
         // console.log( "token type is " + typeof( token + "length : ") + token.length );
          //  console.log( " ply id " + player.id + " game_id " + game_id )
            setToken( token );
          //console.log( data );
        }).catch(
            error => {
              throw(error);
            });
    }
      , 100);
     //(setGameEvents(  gameEvents.push( gettoken ) ) );
      return gettoken;

  };

// get the game update proccess
let updateTheGame = function( game_id , playerId, playerName ) {
  //clearInterval( intervalId );
  intervalId = window.setInterval( function(){
    if( token.length == 0  ) {
      fetch('http://192.168.1.218:8080/wp-json/black-jack/v1/getgameupdate/?game_id=' + game_id + '&player_id=' + playerId ).then( response => response.json() )
      .then( data =>{ //console.log( data );
        let deck_card = JSON.parse( data );
        //console.group("Token data =====");
        //console.log('Player ID ' + playerId );
        //console.log(data);
        //console.log( deck_card );
        //console.groupEnd("Token data =====");
          //console.log(deck_card);
          //debugger;
          setDeckCard( deck_card );
          console.log('******************************');
          console.log( playerName );
          console.log( deck_card.current_player_name );
          //console.log("  Player id "+ playerId );
          //console.log( deck_card.current_player_name  );
          console.log('******************************');
          if ( playerName.trim() == deck_card.current_player_name.trim() ){
            //console.log("+++++++++++++++++++++YOUR TURN !!!++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
            setPlayersGo('Your turn');
            setGameEvent( "your turn !!! " + deck_card.event );
            document.title = "Your turn";
          } else {
            setPlayersGo( deck_card.current_player_name.trim() );
            setGameEvent( deck_card.event );
            document.title = "Waiting .. ";
          }
          //console.log( "~~~~~~~ " + playersGo + ' turn ~~~~~~~~~~~~~~~');
          //console.log( deck_card.names );
          //names = deck_card.names;
          //console.log("set the deck card ---------------------------------");
          //console.log( "The EVENT : " + deck_card.event );

          let cardObject ={ value: deck_card.current_value, suit: deck_card.current_suit , accesskey: '00'};

    }).catch(
        error => {
          throw(error);
        })
    } ;
  }
    , 4000);

    //setGameEvents(  gameEvents.push( intervalId ) ) ;
    return intervalId;
}

  let Event = function () {
    return (<div>
      { player.id } { gameEvent }
    </div> );
  }
  let pickUpCard = function() {
    if ( ! token ) {
      setGameModal({on: true, message: "Not your turn to play "});
    }
    else {
      console.log('==== PICK UP CARD ========== PLAYER ID ' + player.id );
      pick_up_url = 'game_id=' + game_id + '&player_id=' + player.id + '&last_card=' + lastCards + '&turn_token=' + token;
      fetch('http://192.168.1.218:8080/wp-json/black-jack/v1/pickupcard?' + pick_up_url ).
      then( response => response.json()).then( data => {
        console.log( data );
        setPlayer( data[1] );
        setPlayerHand( [] );
        setToken('');
        setLastCards( 0 );

      }).catch(
          error => {
            throw(error);
          });
    }

  }


  // game tips 

  let checkGameTips = ()=> {
   if (   Array.isArray( player.cards ) && ( player.cards.length < 1 ) && ! hasWon ) {
    setGameModal( { on: true , message: "You need to declare last cards before you finish. On your next go press the last Card Button then submit . Then when its your turn again you can finish the game !! You have to pick up on your next go ... "})

   } 
  }


  const changeTab = (event) => {
    setTab( event.target.name );
    //alert( event );
    console.log(  event.target.name );
  }

  let getGameList = () => {
    fetch('http://192.168.1.218:8080/wp-json/black-jack/v1/get_game_list/').then( response => response.json())
    .then( data =>{ console.log( data );
      return data;
    }
  ).catch(
        error => {
          throw(error);
        });

  }

  let creategame = ()=> {
    fetch('http://192.168.1.218:8080/wp-json/black-jack/v1/creategame/').then( response => response.json())
    .then( data =>{ console.log( data );
      if ( data.hasOwnProperty('error') ) {
        message = ( data.error );
        setGameModal({on: true, message: data.error})
      } else {
        message = ('Game created with ID: ' + data.session_id );
      }
      setGameModal({ on: true, message: message });
    }
  ).catch(
      error => {
        throw(error);
      });
  }
  //let resetGame = resetTheGame.bind(this);
  return (

        <div className="game-window">
        <div className={ ( gameModal.on ) ? "game-modal active" : "game-modal" }  >
          <div className='text-area'>
            { gameModal.message }
            <button onClick={ turnOffModal }>OK</button>
          </div>
        </div>
        <div className="tab">
          <button  onClick={ changeTab } name="CreateGame"  className="lt tablinks">Create Game</button>
          <button className="rt tablinks" name="JoinGame"  onClick={ changeTab } >Join Game</button>
          <button id="start-game-button" className="rt tablinks start-game" name="Game"  onClick={ changeTab } > Game</button>
       </div>
          <div className="view">
            <div className="game-tab create-game" style= { { display: ( 'CreateGame' == tab ) ? 'block' : 'none' } }>
              <div><label> Create Game  </label></div>
              <br/>
              <div><label> number of players  </label></div>
              <br/>
              <button id="create-game" onClick={ creategame } > Create Game </button>
            </div>


            <div className="game-tab join-game" style= { { display: ( 'JoinGame' == tab ) ? 'block' : 'none' } }>

              <GameList getTheName={ theName } setTheName={ setTheName } setPlayer={ setPlayer } update={ updateTheGame } setgameId={setTheGameId} getToken = { getGameToken } inGame = { setInGame }
              gameEvents={ gameEvents } setGameEvents={ setGameEvents }  setInGame={ setInGame } setGameModal={setGameModal}/>

            </div>

            <div className="game-tab game" style= { { display: ( 'Game' == tab ) ? 'block' : 'none' } }>
              <div className="game-wrapper">

                <div className="message">
                  <Event className="game-event"/>
                </div>
                  <p>PLAYERS: { deckCard.names.map( ( n, i ) => {
                        if ( deckCard.current_player_name == n ){
                          return ( <span className ="current-player-playing" key={ i }>  {n} </span> )
                        } else {
                          return n + " "
                        }
                      }) }</p>
                  <div className="play-area"> 
                    <div className="play-area-cards-played">


                      { Array.isArray( deckCard.cards_played ) && deckCard.cards_played.map(
                      function( card ) {
                        if ( card ){
                        return(
                        <div className="cardHolder" key={ card.accesskey } id={ card.accesskey }>
                            <div className="card" id={ card.accesskey } suit={ card.suit}>
                              
                                <img src={ generateCardImageLink( card ) }></img>

                            </div>
                        </div>)
                      }
                      } )
                    }</div>

                    <div className="play-area-col1">
                      <div className='deck-info'>
                        <p>PICK UP VALUE: { deckCard.pickup } </p>
                        <p>NAME: { ( theName ) ? theName : 'cant_find_name ' }</p>
                        <p>PLAYING: { playersGo } </p>
                      </div>
                    </div>
                    <div className="play-area-col2">
                    <div className="deck-card-window"><CardOnDeck/> </div>
                    </div>
                  </div>

                </div>
                
                <button onClick={ pickUpCard } className={ ( playersGo == 'Your turn' ? 'active' : '') } > Pick Up { deckCard.pickup }</button>
                <button onClick={ submitHand } className={ ( playersGo == 'Your turn' ? 'active' : '') } > Submit Hand </button>

                <button onClick={ togglelastCard } className={ ( lastCards > 0 ? playersGo == 'Your turn' ? 'active lastcard': 'lastcard' : playersGo == 'Your turn' ? 'active' : '' )   } > Last Card  </button>
                <div className="playerHand">
                  { Array.isArray( playerHand ) && playerHand.map(
                    function( card ) {
                      if ( card ){
                      return(
                      <div className="cardHolder" key={ card.accesskey } id={ card.accesskey }>
                          <div className="card" onClick={ removeCardFromHand } value={ card.value } id={ card.accesskey } suit={ card.suit}>
                            <div className="cardOverlay" value={ card.value } suit={ card.suit } id={ card.accesskey } > <span style={ {color: 'red'}}  value={ card.value } suit={ card.suit } id={ card.accesskey } > - </span> </div>
                              <img src={ generateCardImageLink( card ) }></img>

                          </div>
                      </div>)
                    }
                    } )
                  }

                </div>
                <div>
                  <div className="cards">
                    {  Array.isArray( player.cards ) &&  player.cards.map(
                        function( card, ind ) {
                          return(
                          <div className="cardHolder" key={ card.accesskey } id={ 'ch' + card.accesskey }>
                            { SuitDropDown( card.value, ind ) }
                              <div className="card"  onClick={ addCardToHand } key={ 'c1' + card.accesskey } >
                                <div className="cardOverlay" key={ 'c2' + card.accesskey } > <span value={ card.value } suit={ card.suit } id={ card.accesskey } > + </span> </div>
                                  <img src={ generateCardImageLink( card ) } key={ 'c3' + card.accesskey } ></img>

                              </div>
                          </div>)
                        } )
                      }

                  </div>

                </div>

             </div>

            </div>


          </div>
     


  );
}

export default App;
