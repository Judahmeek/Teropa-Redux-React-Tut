import makeStore from './src/store';
import startServer from './src/server';

export const store = makeStore();

store.dispatch({
  type: 'SET_ENTRIES',
  entries: require('./entries.json')
});

store.dispatch({type: 'NEXT'});

startServer(store);
