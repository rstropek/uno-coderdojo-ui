import { isPlayerListChanged, isPublishMessage, PublishMessage } from './messages';
import { createElement, getDiv, getList } from './utilities';

//const PROTOCOL = 'http';
const PROTOCOL = 'https';
//const HOST = 'localhost:5157';
const HOST = 'uno-backend.azurewebsites.net';
const BASE_URL = `${PROTOCOL}://${HOST}`;

const playerList = getList('#player-list');
const chatHistory = getDiv('#history');

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

  constructor(public gameId: string, public name: string) {}

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
      }
    });
    this.socket.addEventListener('open', (_) => {
      //socket.send("ping");
    });
  }

  private refreshPlayerList() {
    playerList.innerHTML = '';
    for (const p of this.players) {
      const newPlayerListItem = createElement({ tag: 'li', textContent: p });
      playerList.appendChild(newPlayerListItem);
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
