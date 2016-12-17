export default socket => store => reducer => action => {
  if (action.meta && action.meta.remote) {
    socket.emit('action', action);
  }
  
  console.log('in middleware', action);
  return reducer(action);
}