import logo from './logo.svg';
import './App.css';
import GameList from './GameList';
import React, { useState, useEffect,useRef } from "react";






function App() {

  const [ tab, setTab ]               = useState("CreateGame");
  const [ player, setPlayer ]         = useState({ cards:[],id: '', name:'' });
  const [ game_id, setGame_id ]       = useState('');
  const [ game, setGame ]             = useState( { current_suit:'', current_value:0, names: [], player_index: 0 } );
  const [ playerHand, setPlayerHand ] = useState([]);
  const [ token, setToken ]           = useState('');
  const [ playersGo, setPlayersGo ]   = useState('');
  const [ gameEvent, setGameEvent ]   = useState('');
  const [ showGameEve, setShowGameEve ] = useState( true );
  const [ inGame, setInGame ]         = useState( false );
  const [ theName, setTheName ]       = useState('');
  const [ lastCards, setLastCards ]   = useState(0);
  const [ gameEvents, setGameEvents]  = useState([]);
  const [ gameModal, setGameModal]    = useState({ on: false , message:'' } );
  const updateTime                    = 2000;
  const chatWindow                    = useRef(null);
  const chatWindowOutput              = useRef(null);
  const domain = 'http://127.0.0.1:8080/';
  //const domain                        = 'https://uk-blackjack.com/';


  let pick_up_url        = '';
  let gettoken = '';
  let intervalId  = '';
  let gamemsgserviceID ='';
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
 chatWindow.current.setAttribute('gameid', id );

}

// reset the game 
let resetTheGame = function(){
  // alert();
  //setVal = useState("");
  setPlayer({ cards:[],id: player.id, name: player.name });
  setGame_id ('');
  setGame( { current_suit:'', current_value:0, names: [], player_index: 0 } );
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
  console.log('*** cards played array ' + JSON.stringify( game.cards_played ) ) ;
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

    if ( game.current_value > 1 && game.current_value < 10 ){
      cardfile = game.current_value + game.current_suit ;
    }
    if ( game.current_value == 1 ){
      cardfile = 'A' + game.current_suit;
    }
    if ( game.current_value == 10 ){
      cardfile = 'T' + game.current_suit ;
    }
    if ( game.current_value == 11 ){
      cardfile = 'J' + game.current_suit ;
    }
    if ( game.current_value == 12 ){
      cardfile = 'Q' + game.current_suit  ;
    }
    if ( game.current_value == 13 ){
      cardfile = 'K' + game.current_suit ;
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
  turnOffEvent();
  let islastCard = 0;
  if ( lastCards == 0 ) {
    islastCard = 1;
  } else {
    islastCard = 0;
  }
  setLastCards( islastCard );
}

function addCardToHand( e ) {
  turnOffEvent();
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
  turnOffEvent();
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
        fetch( domain + 'wp-json/black-jack/v1/submithand/?' + submit_url ).
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
  
        fetch(domain + 'wp-json/black-jack/v1/getplayertoken/?id=' + playerid + '&game_id=' + gameid ).then( response => response.json() )
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
      , 1000 );
     //(setGameEvents(  gameEvents.push( gettoken ) ) );
      return gettoken;

  };




// get game message chat 
let getMsgChat = function() {
  //alert("GAME CHAT SERVICE");
  console.log("======GET CHAT MESSAGES !!!");
  chatWindow.current.setAttribute('msgid' , '0' );
  chatWindowOutput.current.innerHTML = '';


  gamemsgserviceID = window.setInterval( function(){
    let getmsgURL = domain + 'wp-json/black-jack/v1/getmessages/?game_id=' + chatWindow.current.getAttribute('gameid') + '&last_msg_recieved=' + chatWindow.current.getAttribute('msgid')
    console.log( getmsgURL );
    fetch( getmsgURL ).
    then( response => response.json() )
    .then( data =>{
      //data = JSON.parse( data );
      //console.log(" Messages DATA !!! fromfetch " + data );
      if (( data ) && ( data.length > 0 ) ) {

        console.log('!!! Messages ' + data );
        let msgtext = chatWindowOutput.current.innerHTML ;
        chatWindow.current.setAttribute('msgid' , data[0].ID );
        data.forEach( ( msg ) => {
          msgtext += '<p><b>' + msg.message + '</b></p>';
          return 1;

        } );
          //alert( msgtext);
          chatWindowOutput.current.innerHTML = msgtext;

      }


  }).catch(
      error => {
        throw(error);
      })
  
  }
  , updateTime );

  //setGameEvents(  gameEvents.push( intervalId ) ) ;
  return intervalId;

}
// get the game update proccess
let updateTheGame = function( game_id , playerId, playerName ) {
  console.log("====UPDATE STARTED=== !!! " + 'game id ' +  game_id + ' Playerid ' + playerId + ' Player name ' + playerName );
  //clearInterval( intervalId );
  let eventID = 0 ;
  intervalId = window.setInterval( function(){

      fetch(domain + 'wp-json/black-jack/v1/getgameupdate/?game_id=' + game_id + '&player_id=' + playerId ).then( response => response.json() )
      .then( data =>{ //console.log( data );
        let deck_card = JSON.parse( data );
        //console.group("Token data =====");
        //console.log('Player ID ' + playerId );
        //console.log(data);
        //console.log( deck_card );
        //console.groupEnd("Token data =====");
          //console.log(deck_card);
          //debugger;
          setGame( deck_card );
          console.log('******************************');
          console.log( playerName );
          console.log(player.name);
          console.log( deck_card.current_player_name );
          console.log( deck_card.players_card_count );
          //console.log("  Player id "+ playerId );
          //console.log( deck_card.current_player_name  );
          console.log('******************************');
          //console.log( 'events ' + eventID + 'vs ShowGameEve' + deck_card.event_id );

          if ( deck_card.event_id != eventID ) {
            //console.log("TURNING on game event ");
             setShowGameEve(true);
             setGameEvent( deck_card.event );
             eventID = deck_card.event_id ;
             //eventshoW();
            }
          if ( ( (playerId) && (playerName) && ( deck_card.current_player) ) ) {
            if ( ( playerId == deck_card.current_player ) ){
              //console.log("+++++++++++++++++++++YOUR TURN !!!++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
              setPlayersGo('Your turn');
              //eventshow();
              //setShowGameEve(true);
              setGameEvent( "YOUR TURN !!! " + deck_card.event );
              document.title = "Your turn";
            } else {
              setPlayersGo( deck_card.current_player_name.trim() );
              

              document.title = "Waiting .. ";
            }
          }
          //console.log( "~~~~~~~ " + playersGo + ' turn ~~~~~~~~~~~~~~~');
          //console.log( deck_card.names );
          //names = deck_card.names;
          //console.log("set the deck card ---------------------------------");
          //console.log( "The EVENT : " + deck_card.event );


    }).catch(
        error => {
          throw(error);
        })
    
  }
    , updateTime );

    //setGameEvents(  gameEvents.push( intervalId ) ) ;
    return intervalId;
}



  let Event = function () {
    return (<div  onClick={ turnOffEvent } onBlur={ turnOffEvent } className={ ( showGameEve ) ? 'game-event event-modal show' :'' } >
       { gameEvent }
    </div> );
  }
  let pickUpCard = function() {
    turnOffEvent();
    if ( ! token ) {
      setGameModal({on: true, message: "Not your turn to play "});
    }
    else {
      //console.log('==== PICK UP CARD ========== PLAYER ID ' + player.id );
      pick_up_url = 'game_id=' + game_id + '&player_id=' + player.id + '&last_card=' + lastCards + '&turn_token=' + token;
      fetch( domain + 'wp-json/black-jack/v1/pickupcard?' + pick_up_url ).
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
    fetch(domain + 'wp-json/black-jack/v1/get_game_list/').then( response => response.json())
    .then( data =>{ console.log( data );
      return data;
    }
  ).catch(
        error => {
          throw(error);
        });

  }

  let creategame = ()=> {
    fetch( domain + 'wp-json/black-jack/v1/creategame/?create'+ Math.floor(Math.random() * 10 ) ).then( response => response.json())
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
  let turnOffEvent = ()=>{ setShowGameEve( false ); }
  let sendChat =() =>{ 

    fetch(domain + 'wp-json/black-jack/v1/addmessage/?game_id=' + chatWindow.current.getAttribute('gameid') + '&msg=' + chatWindow.current.value ).
    then( response => response.json() )
    .then( data =>{ 
      chatWindow.current.setAttribute('msgid', data );
      chatWindowOutput.current.innerHTML =  chatWindowOutput.current.innerHTML + chatWindow.current.value;
      chatWindow.current.value = '';
        }).catch(
        error => {
          throw(error);
        });


  }
  return (
        
        <div className="game-window">
        <div className={ ( gameModal.on ) ? "game-modal active" : "game-modal" }  >
          <div className='text-area'>
            { gameModal.message }
            <button onClick={ turnOffModal } >OK</button>
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
              gameEvents={ gameEvents } setGameEvents={ setGameEvents }  setInGame={ setInGame } setGameModal={setGameModal} getmsgchat = { getMsgChat }/>

            </div>

            <div className="game-tab game" style= { { display: ( 'Game' == tab ) ? 'block' : 'none' } }>
              <div className="game-wrapper" >

                <div className="message">
                  <Event/>
                </div>
                  <div className='players-cards'>{ console.log( 'game ' + game.names  ) } PLAYERS: {  game.names.map( ( n, i ) => {
                        if ( game.current_player_name == n ){
                          return (<div className='other-players-info' key={ i } > <div className ="current-player-playing" key={ i }>  { n + " " } <div className='card-count' key={ i } > {game.players_card_count[n.trim()] } </div> </div></div> )
                        } else {
                          return ( <div className='other-players-info' key={ i } > { n + " " } <div className='card-count' key={ i }> { game.players_card_count[n.trim()] } </div>  </div> ) 
                        }
                      }) }</div>
                  <div className="play-area"> 
                    <div className="play-area-cards-played">
                      <div className="last-player-to-play"> { ( game.last_player_name ) ? game.last_player_name :'' } put down : </div>


                      { (typeof game.cards_played != "undefined") &&  Array.isArray( game.cards_played ) && game.cards_played.map(
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
                        <p>PICK UP VALUE: { game.pickup } </p>
                        <p>NAME: { ( theName ) ? theName : 'cant_find_name ' }</p>
                      </div>
                    </div>
                    <div className="play-area-col2">
                    <div className="deck-card-window"><CardOnDeck/> </div>
                    </div>
                  </div>

                </div>
                
                <button onClick={ pickUpCard } className={ "pickup " + ( playersGo == 'Your turn' ? 'active' : '') } > Pick Up { game.pickup }</button>
                <button onClick={ submitHand } className={ "submit " + ( playersGo == 'Your turn' ? 'active' : '') } > Submit Hand </button>

                <button onClick={ togglelastCard } className={ "lastCard " + ( lastCards > 0 ? playersGo == 'Your turn' ? 'active lastcard': 'lastcard' : playersGo == 'Your turn' ? 'active' : '' )   } > Last Card  </button>
                <div onClick={ turnOffEvent } className="playerHand">
                  { (typeof playerHand != "undefined") && Array.isArray( playerHand ) && playerHand.map(
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
                    { ( player != null ) && Array.isArray( player.cards ) &&  player.cards.map(
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
                <div className='chat'>
                  <div>
                    <h1>Text Chat</h1>
                    <div id='chat-window-output' type='text' ref={ chatWindowOutput } ></div>
                  </div>
                  <div>
                    <input id='chat-window' type="text" msgid='0'ref={ chatWindow } gameid='0'></input>
                    <button onClick={ sendChat } className='chat-button active'>SEND</button>
                  </div>

                </div>

             </div>

            </div>


          </div>
     


  );
}

export default App;
