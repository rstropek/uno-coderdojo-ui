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
