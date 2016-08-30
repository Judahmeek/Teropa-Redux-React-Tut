import {List, Map} from 'immutable';

//I hate functions like this: exchanging one line of code for another ilne of code that has implicit assumptions (such as state having a set method)
export function setEntries(state, entries) {
  return state.set('entries', List(entries));
}

//splits state into two maps: the entries being compared and all the other ones
export function next(state) {
  const entries = state.get('entries');
  return state.merge({
    vote: Map({pair: entries.take(2)}),
    entries: entries.skip(2)
  });
}