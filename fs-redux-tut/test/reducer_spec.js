import {Map, List} from 'immutable';
import {INITIAL_STATE} from '../src/core'
import {expect} from 'chai';

import reducer from '../src/reducer';

describe('reducer', () => {

  it('handles SET_ENTRIES', () => {
    const action = {type: 'SET_ENTRIES', entries: ['Trainspotting']};
    const nextState = reducer(INITIAL_STATE, action);

    expect(nextState).to.equal(Map({
      entries: List(['Trainspotting']),
      initialEntries: List(['Trainspotting'])
    }));
  });

  it('handles NEXT', () => {
    const initialState = Map({
      entries: List(['Trainspotting', '28 Days Later'])
    });
    const action = {type: 'NEXT'};
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(Map({
      client: Map({
        vote: Map({
          pair: List(['Trainspotting', '28 Days Later'])
        })
      }),
      entries: List([])
    }));
  });

  it('handles VOTE', () => {
    const initialState = Map({
      client: Map({
        vote: Map({
          pair: List(['Trainspotting', '28 Days Later'])
        })
      }),
      entries: List([])
    });
    const action = {type: 'VOTE', clientId: 'voter1', entry: 'Trainspotting'};
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(Map({
      client: Map({
        vote: Map({
          pair: List(['Trainspotting', '28 Days Later']),
          tally: Map({Trainspotting: 1}),
          votes: Map({
            voter1: 'Trainspotting'
          })
        })
      }),
      entries: List([])
    }));
  });

  it('has an initial state', () => {
    const action = {type: 'SET_ENTRIES', entries: ['Trainspotting']};
    const nextState = reducer(undefined, action);
    expect(nextState).to.equal(Map({
      entries: List(['Trainspotting']),
      initialEntries: List(['Trainspotting'])
    }));
  });

  it('can be used with reduce', () => {
    const actions = [
      {type: 'SET_ENTRIES', entries: ['Trainspotting', '28 Days Later']},
      {type: 'NEXT'},
      {type: 'VOTE', entry: 'Trainspotting'},
      {type: 'VOTE', entry: '28 Days Later'},
      {type: 'VOTE', entry: 'Trainspotting'},
      {type: 'NEXT'}
    ];
    const finalState = actions.reduce(reducer, INITIAL_STATE);
  
    expect(finalState).to.equal(Map({
      client: Map({
        winner: 'Trainspotting'
      }),
      initialEntries: List(['Trainspotting', '28 Days Later'])
    }));
  });
});