export const JOIN = 'join';
export const EXIT = 'exit';
export const SEND = 'send';
export const RECEIVE = 'recieve';
export const CHAT = 'chat';
export const ENDPOINT = `${window.location.protocol.replace('http', 'ws')}//${window.location.hostname}${window.location.port ? ':8080' : ''}`;

