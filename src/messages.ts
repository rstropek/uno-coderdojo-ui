export interface TypedMessage {
  Type: string;
}

export interface PlayerListChanged extends TypedMessage {
  PlayerList: string[];
}

export function isPlayerListChanged(item: PlayerListChanged | any): item is PlayerListChanged {
  return (item as TypedMessage).Type === 'PlayerListChanged';
}

export interface PublishMessage extends TypedMessage {
  Sender: string;
  Message: string;
}

export function isPublishMessage(item: PublishMessage | any): item is PublishMessage {
  return (item as TypedMessage).Type === 'PublishMessage';
}

export interface DropCardMessage extends TypedMessage {
  Card: Card;
}

export interface StartMessage extends TypedMessage { }

export interface Card {
  Type: string;
  Color: string;
}

export interface TakeFromPileMessage extends TypedMessage {
}

export interface WinnerMessage extends TypedMessage {
  WinnerId: string;
  WinnerName: string;
}

export function isWinnerMessage(item: WinnerMessage | any): item is WinnerMessage {
  return (item as TypedMessage).Type === 'WinnerMessage';
}

export interface OtherPlayerStatusMessage {
  PlayerId: string;
  Name: string;
  NumberOfCardsInHand: number;
}

export interface PlayerStatusMessage extends TypedMessage {
  GameStatus: string;
  Hand: Card[];
  DiscardPileTop: Card;
  CurrentPlayerId: string;
  ItIsYourTurn: boolean;
  OtherPlayers: OtherPlayerStatusMessage[];
}

export const demoPlayerStatusMessage: PlayerStatusMessage = {
  Type: 'PlayerStatusMessage',
  GameStatus: 'InProgress',
  Hand: [
    { Type: 'One', Color: 'Red' },
    { Type: 'Five', Color: 'Green' },
    { Type: 'Nine', Color: 'Blue' },
  ],
  DiscardPileTop: { Type: 'Four', Color: 'Red' },
  CurrentPlayerId: '1',
  ItIsYourTurn: true,
  OtherPlayers: [
    { PlayerId: '2', Name: 'Franz', NumberOfCardsInHand: 5 },
    { PlayerId: '3', Name: 'Hugo', NumberOfCardsInHand: 1 },
    { PlayerId: '4', Name: 'Elke', NumberOfCardsInHand: 8 },
  ]
};

export function isPlayerStatusMessage(item: PlayerStatusMessage | any): item is PlayerStatusMessage {
  return (item as TypedMessage).Type === 'PlayerStatusMessage';
}
