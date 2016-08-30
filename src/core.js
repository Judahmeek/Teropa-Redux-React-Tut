import {List, Map} from 'immutable'; //all state.methods can be expected to come from the Immutable.js library

//I hate functions like this: exchanging one line of code for another ilne of code that has implicit assumptions (such as state having a set method)
export function setEntries(state, entries) {
  return state.set('entries', List(entries));
}

function getWinners(vote) {
  if (!vote) return [];
  const [a, b] = vote.get('pair');
  const aVotes = vote.getIn(['tally', a], 0);
  const bVotes = vote.getIn(['tally', b], 0);
  if      (aVotes > bVotes)  return [a];
  else if (aVotes < bVotes)  return [b];
  else                       return [a, b];
}

//If there's a vote tally, concats winner to entry list, then
//splits state into two maps: the entries being compared and all the other ones
export function next(state) {
  const entries = state.get('entries')
                       .concat(getWinners(state.get('vote')));
  return state.merge({
    vote: Map({pair: entries.take(2)}),
    entries: entries.skip(2)
  });
}

export function vote(state, entry) {
  return state.updateIn(
    ['vote', 'tally', entry],
    0, //default value
    tally => tally + 1
  );
}