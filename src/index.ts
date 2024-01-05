import { Game, checkGameId, startGame } from './game';
import { demoPlayerStatusMessage } from './messages';
import './style.css';
import { activate, getButton, getButtons, getInput, getParagraph, getParagraphs, getSpan } from './utilities';

let game: Game | undefined;
let simulation = false;

// Als erstes machen wir die Elemente aus dem HTML in TypeScript verfügbar
const buttons = {
  newGame: getButton('#new-game'),
  joinGame: getButton('#join-game'),
  home: getButtons('.home'),
  joinConfirm: getButton('#join-game .confirm'),
  newGameConfirm: getButton('#start-game .confirm'),
  sendChatMessage: getButton('#send-chat-msg'),
  devLayout: getButton('#dev-layout'),
  startGameBtn: getButton('#start-game-btn'),
};

const inputs = {
  joinName: getInput('#join-game #player-name'),
  gameCode: getInput('#join-game #game-code'),
  newGameName: getInput('#start-game #player-name'),
  chatMessage: getInput('#chat-msg'),
};

const messages = {
  joinError: getParagraph('#join-game .error'),
  newGameError: getParagraph('#start-game .error'),
  errors: getParagraphs('.error'),
};

// Navigationsbuttons
buttons.joinGame.addEventListener('click', () => activate('join-game'));
buttons.newGame.addEventListener('click', () => activate('start-game'));
buttons.devLayout.addEventListener('click', () => {
  simulation = true;
  game = new Game('asdfgh', 'Eva');
  game.players = ['Eva', ...demoPlayerStatusMessage.OtherPlayers.map((p) => p.Name)];
  game.status = 'InProgress';
  game.refreshPlayerList();
  game.refreshGameCode();
  game.updateGameStatus(demoPlayerStatusMessage);
  activate('active-game');
});
buttons.home.forEach((b) => b.addEventListener('click', () => activate('choose-mode')));

// Join-Button
buttons.joinConfirm.addEventListener('click', async () => {
  if (!inputs.joinName.value || !inputs.gameCode.value) {
    messages.joinError.className = 'error show';
    return;
  }

  game = await checkGameId(inputs.gameCode.value, inputs.joinName.value);
  if (!game) {
    alert('Es tut mir leid, ich konnte dieses Spiel nicht finden');
    activate('choose-mode');
    return;
  }

  activate('active-game');
  simulation = false;
  await game.Join();
});

// Start new game button
buttons.newGameConfirm.addEventListener('click', async () => {
  if (!inputs.newGameName.value) {
    messages.newGameError.className = 'error show';
    return;
  }

  game = await startGame(inputs.newGameName.value);
  if (!game) {
    alert('Es tut mir leid, ich konnte kein Spiel starten');
    activate('choose-mode');
    return;
  }

  activate('active-game');
  simulation = false;
  await game.Join();
});

buttons.startGameBtn.addEventListener('click', async () => {
  if (!game) { return; }

  if (game.players.length < 2) {
    alert('Es müssen mindestens 2 Spieler mitspielen');
    return;
  }

  await game.startGame();  
});

buttons.sendChatMessage.addEventListener('click', async () => {
  if (game && !simulation) {
    game.sendChatMessage(inputs.chatMessage.value);
  }
});

// Wir aktivieren den initialen Modus
activate('choose-mode');
