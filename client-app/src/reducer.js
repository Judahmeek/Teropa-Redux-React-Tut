import {List, Map} from 'immutable';

function setState(state, newState) {
  return state.merge(newState);
}

function vote(state, entry) {
  const currentPair = state.getIn(['vote', 'pair']);
  if (currentPair && currentPair.includes(entry)) {
    return state.set('hasChosen', Map({
      entry: entry,
      round: state.getIn(['vote', 'round'])
    }))
  } else {
    return state;
  }
}

function resetVote(state) {
  const choiceRound = state.getIn(['hasChosen', 'round']);
  const currentRound = state.getIn(['vote', 'round']);
  if (choiceRound && (choiceRound + 1) === currentRound){
    return state.remove('hasChosen');
  } else {
    return state;
  }
}

export default function(state = Map(), action) {
  switch (action.type) {
  case 'SET_STATE':
    return resetVote(setState(state, action.state));
  case 'VOTE':
    return vote(state, action.entry);
  }
  return state;
}