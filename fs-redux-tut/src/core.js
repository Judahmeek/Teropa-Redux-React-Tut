import {List, Map} from 'immutable'; //all state.methods can be expected to come from the Immutable.js library
export const INITIAL_STATE = Map();

//I hate functions like this: exchanging one line of code for another line of code that has implicit assumptions (such as state having a set method)
export function setEntries(state, entries) {
  return state.set('entries', List(entries));
}

function getWinners(vote) {
  if (!vote) return [];
  const [a, b] = vote.get('pair');
  const aVotes = vote.getIn([ 'tally', a], 0);
  const bVotes = vote.getIn([ 'tally', b], 0);
  if      (aVotes > bVotes)  return [a];
  else if (aVotes < bVotes)  return [b];
  else                       return [a, b];
}

//If there's a vote tally, concats winner to entry list, then
//splits state into two maps: the entries being compared and all the other ones
//unless there's only one entry left, in which case it sets final entry as the winner
export function next(state) {
  const entries = state.get('entries')
                       .concat(getWinners(state.getIn(['client', 'vote'])));
  if (entries.size === 1) {
    return state.deleteIn(['client', 'vote'])
                .delete('entries')
                .setIn(['client', 'winner'], entries.first());
  } else {
    return state.merge({
      client: Map({
        vote: Map({
          pair: entries.take(2)
        })
      }),
      entries: entries.skip(2)
    });
  }
}

function removePreviousVote(voteState, voter) {
  const previousVote = voteState.getIn(['votes', voter]);
  if (previousVote) {
    return voteState.updateIn(['tally', previousVote], t => t - 1)
                    .removeIn(['votes', voter]);
  } else {
    return voteState;
  }
}

function addVote(voteState, entry, voter) {
  if (voteState.get('pair').includes(entry)) {
    return voteState.updateIn(['tally', entry], 0, t => t + 1)
                    .setIn(['votes', voter], entry);
  } else {
    return voteState;
  }
}

export function vote(voteState, entry, voter) {
  return addVote(
    removePreviousVote(voteState, voter),
    entry,
    voter
  );
}