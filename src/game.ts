import { DropCardMessage, isPlayerListChanged, isPlayerStatusMessage, isPublishMessage, PlayerStatusMessage, PublishMessage, TakeFromPileMessage } from './messages';
import { CardToImageUrl, createElement, getDiv, getList, getSpan } from './utilities';

//const PROTOCOL = 'http';
const PROTOCOL = 'https';
//const HOST = 'localhost:5157';
const HOST = 'uno-backend.azurewebsites.net';
const BASE_URL = `${PROTOCOL}://${HOST}`;

const playerList = getList('#player-list');
const chatHistory = getDiv('#history');
const gameCode = getSpan('#game-id');
const startGameButtonContainer = getDiv('.start-game-btn-container');
const cardArea = getDiv('.card-area');
const playerHand = getDiv('#player-hand');
const otherPlayers = getDiv('#other-players');
const gameData = getDiv('.game-data');
const pile = getDiv('#pile');

const CARD_PLACEHOLDER = 'https://cddataexchange.blob.core.windows.net/images/unno/game-cards.png';

export async function startGame(name: string): Promise<Game | undefined> {
  try {
    const response = await fetch(`${BASE_URL}/games`, { method: 'POST' });
    if (response.status !== 201) {
      return;
    }

    const gameId = (await response.json()) as string;
    return new Game(gameId, name);
  } catch {
    return;
  }
}

export async function checkGameId(gameId: string, name: string): Promise<Game | undefined> {
  try {
    const response = await fetch(`${BASE_URL}/games/${gameId}`);
    if (response.status !== 200) {
      return;
    }

    return new Game(gameId, name);
  } catch {
    return;
  }
}

export class Game {
  players: string[] = [];
  socket: WebSocket | undefined;
  status = 'WaitingForPlayers';

  constructor(public gameId: string, public name: string) { }

  public async Join() {
    this.socket = new WebSocket(this.buildWebsocketUrl());
    this.socket.addEventListener('message', (event) => {
      const ev = JSON.parse(event.data);
      if (isPlayerListChanged(ev)) {
        this.players = ev.PlayerList;
        this.refreshPlayerList();
      } else if (isPublishMessage(ev)) {
        const entry = createElement({
          tag: 'div',
          children: [
            createElement({ tag: 'div', className: 'sender', textContent: ev.Sender + ':' }),
            createElement({ tag: 'div', textContent: ev.Message }),
          ],
        });
        chatHistory.appendChild(entry);
        chatHistory.scrollTop = chatHistory.scrollHeight;
      } else if (isPlayerStatusMessage(ev)) {
        this.updateGameStatus(ev);
      }
    });
    this.socket.addEventListener('open', (_) => {
      //socket.send("ping");
    });
    this.refreshGameCode();
  }

  async startGame(): Promise<unknown> {
    try {
      const response = await fetch(`${BASE_URL}/games/${this.gameId}/start`, { method: 'POST' });
      if (response.status !== 200) {
        alert('Das Spiel konnte nicht gestartet werden');
        return;
      }
    } catch {
      return;
    }
  }

  public refreshPlayerList() {
    playerList.innerHTML = '';
    for (const p of this.players) {
      const newPlayerListItem = createElement({ tag: 'li', textContent: p });
      playerList.appendChild(newPlayerListItem);
    }
  }

  public refreshGameCode() {
    gameCode.innerText = this.gameId;
  }

  public updateGameStatus(status: PlayerStatusMessage) {
    if (status.GameStatus === 'WaitingForPlayers') {
      return;
    }

    startGameButtonContainer.className = 'hide';
    cardArea.classList.remove('hide');
    gameData.className = 'hide';

    pile.innerHTML = '';

    const stackOfCards = createElement({ tag: 'img' }) as HTMLImageElement;
    stackOfCards.src = CARD_PLACEHOLDER;
    if (status.ItIsYourTurn) {
      stackOfCards.addEventListener('click', () => {
        if (this.socketIsOpen) {
          const msg: TakeFromPileMessage = {
            Type: 'TakeFromPile',
          };
          this.socket!.send(JSON.stringify(msg));
        }
      });
    }
    pile.appendChild(stackOfCards);

    const pileTopCard = createElement({ tag: 'img' }) as HTMLImageElement;
    pileTopCard.src = CardToImageUrl(status.DiscardPileTop.Type, status.DiscardPileTop.Color);
    pile.appendChild(pileTopCard);

    playerHand.innerHTML = '';
    for (const c of status.Hand) {
      const newCard = createElement({ tag: 'img', className: 'card' }) as HTMLImageElement;
      newCard.src = CardToImageUrl(c.Type, c.Color);
      if (status.ItIsYourTurn) {
        newCard.addEventListener('click', () => {
          if (this.socketIsOpen) {
            const msg: DropCardMessage = {
              Type: 'DropCard',
              Card: { Type: c.Type, Color: c.Color },
            };
            this.socket!.send(JSON.stringify(msg));
          }
        });
      }
      else {
        newCard.classList.add('opaque');
      }
      playerHand.appendChild(newCard);
    }

    otherPlayers.innerHTML = '';
    for (const p of status.OtherPlayers) {
      const player = createElement({ tag: 'div' });
      for (let i = 0; i < p.NumberOfCardsInHand; i++) {
        const newCard = createElement({ tag: 'img', className: 'other-player-card' }) as HTMLImageElement;
        newCard.src = CARD_PLACEHOLDER;
        player.appendChild(newCard);
      }
      otherPlayers.appendChild(player);
      const playerName = createElement({ tag: 'div', textContent: `${p.Name} (${p.NumberOfCardsInHand})`, className: 'card-player-name' });
      if (p.PlayerId !== status.CurrentPlayerId) {
        playerName.classList.add('opaque');
      }
      otherPlayers.appendChild(playerName);
    }
  }

  public sendChatMessage(message: string) {
    if (this.socketIsOpen) {
      const chatMsg: PublishMessage = {
        Type: 'PublishMessage',
        Sender: this.name,
        Message: message,
      };
      this.socket!.send(JSON.stringify(chatMsg));
    }
  }

  private buildWebsocketUrl() {
    return `${PROTOCOL.endsWith('s') ? 'wss' : 'ws'}://${HOST}/games/${this.gameId}/join?name=${this.name}`;
  }

  private get socketIsOpen() {
    return this.socket && this.socket.readyState === this.socket.OPEN;
  }
}
