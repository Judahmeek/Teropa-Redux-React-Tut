import {List, Map} from 'immutable';

function setState(state, newState) {
  let mergedState = state.merge(newState);
  const oldPair = state.getIn(['vote', 'pair'], List());
  const newPair = mergedState.getIn(['vote', 'pair'], List());
  if (mergedState.get('hasChosen') && !oldPair.equals(newPair)) {
    return mergedState.remove('hasChosen');
  }
  return mergedState;
}

function vote(state, entry) {
  const currentPair = state.getIn(['vote', 'pair']);
  if (currentPair && currentPair.includes(entry)) {
    return state.set('hasChosen', entry)
  } else {
    return state;
  }
}

export default function(state = Map(), action) {
  switch (action.type) {
  case 'SET_STATE':
    return setState(state, action.state);
  case 'VOTE':
    return vote(state, action.entry);
  }
  return state;
}