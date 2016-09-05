import {List} from 'immutable';
import uuid from 'uuid';
import Server from 'socket.io';

export default function startServer(store) {
  const io = new Server().attach(8082);
  
  function newClientId() {
    const users = store.get('users', []);
    do{
      var clientId = uuid.v4();
    }while(users.includes(clientId));
    users.push(clientId);
    store.set('users', List(users));
    return clientId;
  }
  
  store.subscribe(
    () => io.emit('state', store.getState().get('client').toJS())
  );
  
  io.on('connection', (socket) => {
    socket.emit('idQuery');
    socket.emit('state', store.getState().get('client').toJS());
    
    socket.on('clientId', (data) => {
    if(!data){
      socket.emit('clientId', newClientId());
    }
    });
    socket.on('action', store.dispatch.bind(store));
  });
}