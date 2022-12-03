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
  const [ theName, setTheName ]       = useState('Name not set');
  let names              = [];
  let players_cards      = [];
  let hand               = [];
  let submit_url         = '';
  let pick_up            = 0;
  let pick_up_url        = '';
  let current_card_suit  ='';
  let current_card_value = 0;
  let gettoken = '';
  let intervalId  = '';

// get the name
let getTheName = function(){
  return theName;
}

// set the game id
let setTheGameId = function( id ){
 setGame_id( id );

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
   console.log("++++++ " + deckCard + " ++++++++++++++")
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
    console.log( players_cards );
}


}

function removeCardFromHand( e ) {
  let value       = e.target.getAttribute("value") ;
  let suit        = e.target.getAttribute("suit") ;
  let id          = e.target.getAttribute("id") ;

  if ( id !== null && suit !==null &&  value !== null) {
    let card        = { value: value, suit: suit, accesskey: id };
    console.log('--------'+  value +' '+id +' ----------------------');
    let currPlayer = player;
    currPlayer.cards.push( card );
    console.log('=====' + currPlayer.cards );
    setPlayer( currPlayer );
    let plh = playerHand;

    plh = plh.filter(function( remCard ) {
      console.log("the id : " + id )
      console.log( remCard );
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
    let submit_url = 'game_id=' + getGameID() + '&player_id=' + getPlayerId() + '&turn_token=' + token;
    playerHand.map( function( h, i ){
      submit_url += '&hand[]=' + h.accesskey ;
      if ( h.value == 1 ){
        submit_url += '&set_cards[' + i + '][id]=' + h.accesskey + '&set_cards[' + i + '][suit]=' + h.suit;

      }

    });
    console.log("the submit URL: " + submit_url);
    // alert( submit_url );
      fetch('http://127.0.0.1:8080/wp-json/black-jack/v1/submithand/?' + submit_url ).
      then( response => response.json()).then( data => {
         console.log( data );
         //players =  JSON.parse( data )  ;

         //alert("");
         //players =  JSON.parse( data )  ;
         if ( data[1] == player.id){
           alert("You Win!!!!")
         } else if ( data[2] == 'valid'){
           setPlayer( data[0] )  ;
           //populate_cards();
          // document.querySelector('#token').value = '' ;
           setPlayerHand( [] );
          // document.querySelector('#players_hand').innerHTML='';
           setToken('');
       }
       if ( data[2] == 'invalid' ){
         alert( data[3] );
         //setPlayerHand( [] );
        // document.querySelector('#players_hand').innerHTML='';
       }

    }).catch(
        error => {
          throw(error);
        });


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

    let playerID = '';
    if (typeof player.id === "undefined" || player.id === null) {
      playerID = sessionStorage.getItem("playerID");
    } else {
      playerID = player.id ;
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
    console.log( " ply id " + player.id + " game id " + game_id );
    console.log( "token type is " + typeof( token + "length : ") + token.length );
    gettoken = window.setInterval( function(){
      if( token.length === 0 ) {
        fetch('http://127.0.0.1:8080/wp-json/black-jack/v1/getplayertoken/?id=' + playerid + '&game_id=' + gameid ).then( response => response.json() )
        .then( data =>{ //console.log( data );
        //  document.querySelector('#token').value = data ;
          let token = data;
          console.log( 'the token is ' + token );
          console.log( "token type is " + typeof( token + "length : ") + token.length );
            console.log( " ply id " + player.id + " game_id " + game_id )
            setToken( token );
          //console.log( data );
        }).catch(
            error => {
              throw(error);
            });
      } else {
        console.log("we have a token ");
        gettoken = token;
      }
    }
      , 1000);
      return gettoken;

  };

// get the game update proccess
let updateTheGame = function( game_id , playerId ) {
  intervalId = window.setInterval( function(){
    if( token.length === 0  ) {
      fetch('http://127.0.0.1:8080/wp-json/black-jack/v1/getgameupdate/?game_id=' + game_id + '&player_id=' + playerId ).then( response => response.json() )
      .then( data =>{ //console.log( data );
        let deck_card = JSON.parse( data );

          setDeckCard( deck_card );

          //console.log( deck_card );
          //console.log( deck_card.current_player );
          //console.log("  Player id "+ playerId );
          //console.log( deck_card.current_player_name  );
          if ( playerId == deck_card.current_player ){
            //console.log("+++++++++++++++++++++YOUR TURN !!!++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
            setPlayersGo('Your turn');
            setGameEvent( "your turn !!! " + deck_card.event );
          } else {
            setPlayersGo( deck_card.current_player_name );
            setGameEvent( deck_card.event );
          }
          console.log( "~~~~~~~ " + playersGo + ' turn ~~~~~~~~~~~~~~~');
          console.log( deck_card.names );
          names = deck_card.names;
          console.log("set the deck card ---------------------------------");
          console.log( "The EVENT : " + deck_card.event );

          let cardObject ={ value: deck_card.current_value, suit: deck_card.current_suit , accesskey: '00'};

    }).catch(
        error => {
          throw(error);
        })
    } ;
  }
    , 5000);


}

  let Event = function () {
    return (<div>
      { player.id } { gameEvent }
    </div> );
  }
  let pickUpCard = function() {
    console.log('==== PICK UP CARD ==========');
    pick_up_url = 'game_id=' + game_id + '&player_id=' + player.id + '&turn_token=' + token;
    fetch('http://127.0.0.1:8080/wp-json/black-jack/v1/pickupcard?' + pick_up_url ).
    then( response => response.json()).then( data => {
       console.log( data );
       setPlayer( data[1] );
       setPlayerHand( [] );
       setToken('');
    }).catch(
        error => {
          throw(error);
        });

  }


  const changeTab = (event) => {
    setTab( event.target.name );
    //alert( event );
    console.log(  event.target.name );
  }

  let getGameList = () => {
    fetch('http://127.0.0.1:8080/wp-json/black-jack/v1/get_game_list/').then( response => response.json())
    .then( data =>{ console.log( data );
      return data;
    }
  ).catch(
        error => {
          throw(error);
        });

  }

  let creategame = ()=> {
    fetch('http://127.0.0.1:8080/wp-json/black-jack/v1/creategame/').then( response => response.json())
    .then( data =>{ console.log( data );
      alert('Game created with ID: ' + data.session_id );
    }
  ).catch(
      error => {
        throw(error);
      });
  }
  return (

    <div className="wrapper">
    <div className="game-overlay">
       <h1> British Black Jack { cnt }</h1>
    </div>


      <div className="game-controls">


        <div className="game-window">

        <div className="tab">
          <button  onClick={ changeTab } name="CreateGame"  className="lt tablinks">Create Game</button>
          <button className="rt tablinks" name="JoinGame"  onClick={ changeTab } >Join Game</button>
          <button className="rt tablinks start-game" name="Game"  onClick={ changeTab } > Game</button>
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

              <GameList getTheName={ getTheName } setTheName={ setTheName } setPlayer={ setPlayer } update={ updateTheGame } setgameId={setTheGameId} getToken = { getGameToken } inGame = { setInGame } />

            </div>

            <div className="game-tab game" style= { { display: ( 'Game' == tab ) ? 'block' : 'none' } }>
              <div className="game-wrapper">

                <div className="message">
                  <Event className="game-event"/>
                </div>
                  <p>PLAYERS: { deckCard.names.map( ( n, i ) => {
                        if ( deckCard.current_player_name == n ){
                          return ( <span className ="current-player-playing" >  {n} </span> )
                        } else {
                          return n + " "
                        }
                      }) }</p>
                  <p>PICK UP VALUE: { deckCard.pickup } </p>
                  <p>NAME: { player.name }</p>
                  <p>PLAYING: { playersGo } </p>


                </div>
                <div className="deck-card-window"><CardOnDeck/> </div>
                <button onClick={ pickUpCard }> Pick Up { deckCard.pickup }</button>
                <button onClick={ submitHand }> Submit Hand </button>
                <div className="playerHand">
                  { console.log( playerHand.length )}
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
         </div>
      </div>


  );
}

export default App;
