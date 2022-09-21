import {io} from 'socket.io-client';

const SECRET = ''; // Das Secret des Bot
const GAMESERVER = 'https://games.uhno.de'; // URL zum Gameserver

if (SECRET == null || SECRET === '') {
  console.error('Was mit Secret?');
}

const socket = io(GAMESERVER, {
  transports: ['websocket']
});

socket.on('connect', () => {
  console.log('connect');
  socket.emit('authenticate', SECRET, (success) => {
    console.log('success?', success);
  });
});

socket.on('disconnect', () => {
  console.log('disconnect');
});

// Funktionen, um die verschiedene Arten von Rueckgaben zu behandeln
const init = (data) => {
  console.log('Neue Runde!');
};
const result = (data) => {
  console.log('Runde vorbei!');
};
const round = (data, res) => {
  const randomNum = Math.floor(Math.random() * 3);
  let result = '';
  switch (randomNum) {
    case 0:
      result = 'STEIN';
      break;
    case 1:
      result = 'PAPIER';
      break;
    case 2:
      result = 'SCHERE';
      break;
  }
  console.log('Wir schicken:', result);
  res(result);
};

socket.on('data', (data, res) => {
  switch (data.type) {
    case 'INIT':
      init(data);
      return;
    case 'RESULT':
      result(data);
      return;
    case 'ROUND':
      round(data, res);
      return;
    default:
      console.log('unbekannter typ:', data);
  }
});
