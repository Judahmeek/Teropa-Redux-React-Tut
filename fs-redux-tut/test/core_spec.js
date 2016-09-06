import {List, Map} from 'immutable';
import {expect} from 'chai';

import {INITIAL_STATE, setEntries, next, vote, restart} from '../src/core';

describe('functions', () => {

  describe('setEntries', () => {
      
    it('adds entries and makes them immutable', () => {
      const nextState = setEntries(INITIAL_STATE, ['Pokemon', 'Digimon']);
      expect(nextState).to.equal(Map({
        entries: List.of('Pokemon', 'Digimon'),
        initialEntries: List.of('Pokemon', 'Digimon')
      }));
    });

  });

  describe('next', () => {

    it('takes the next two entries under vote', () => {
      const state = Map({
        entries: List.of('Trainspotting', '28 Days Later', 'Sunshine')
      });
      const nextState = next(state);
      expect(nextState).to.equal(Map({
        client: Map({
          vote: Map({
            pair: List(['Trainspotting', '28 Days Later'])
          })
        }),
        entries: List(['Sunshine'])
      }));
    });

  it('puts winner of current vote back to entries', () => {
    const state = Map({
      client: Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 4,
            '28 Days Later': 2
          })
        })
      }),
      entries: List.of('Sunshine', 'Millions', '127 Hours')
    });
    const nextState = next(state);
    expect(nextState).to.equal(Map({
      client: Map({
        vote: Map({
          pair: List.of('Sunshine', 'Millions')
        })
      }),
      entries: List.of('127 Hours', 'Trainspotting')
    }));
  });

  it('puts both from tied vote back to entries', () => {
    const state = Map({
      client: Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 3,
            '28 Days Later': 3
          })
        })
      }),
      entries: List.of('Sunshine', 'Millions', '127 Hours')
    });
    const nextState = next(state);
    expect(nextState).to.equal(Map({
      client: Map({
        vote: Map({
          pair: List.of('Sunshine', 'Millions')
        })
      }),
      entries: List.of('127 Hours', 'Trainspotting', '28 Days Later')
    }));
  });
  });

  it('marks winner when just one entry left', () => {
    const state = Map({
      client: Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 4,
            '28 Days Later': 2
          })
        })
      }),
      entries: List()
    });
    const nextState = next(state);
    expect(nextState).to.equal(Map({
      client: Map({
        winner: 'Trainspotting'
      })
    }));
  });

  describe('vote', () => {
  
    it('creates a tally for the voted entry', () => {
      const state = Map({
        pair: List.of('Trainspotting', '28 Days Later')
      });
      const nextState = vote(state, 'Trainspotting', 'voter1')
      expect(nextState).to.equal(Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 1
        }),
        votes: Map({
          voter1: 'Trainspotting'
        })
      }));
    });
  
    it('adds to existing tally for the voted entry', () => {
      const state = Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 3,
          '28 Days Later': 2
        })
      });
      const nextState = vote(state, 'Trainspotting', 'voter1');
      expect(nextState).to.equal(Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 4,
          '28 Days Later': 2
        }),
        votes: Map({
          voter1: 'Trainspotting'
        })
      }));
    });
    
    it('nullifies previous vote for the same voter', () => {
      expect(
        vote(Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 3,
            '28 Days Later': 2
          }),
          votes: Map({
            voter1: '28 Days Later'
          })
        }), 'Trainspotting', 'voter1')
      ).to.equal(
        Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 4,
            '28 Days Later': 1
          }),
          votes: Map({
            voter1: 'Trainspotting'
          })
        })
      );
    });
  
    it('ignores votes with invalid entries', () => {
      const state = Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 3,
          '28 Days Later': 2
        })
      });
      const nextState = vote(state, 'Invalid Entry', 'voter1');
      expect(nextState).to.equal(Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 3,
          '28 Days Later': 2
        })
      }));
    });
  
  });

  describe('restart', () => {

    it('returns to initial entries and takes the first two entries under vote', () => {
      expect(
        restart(Map({
          client: Map({
            vote: Map({
              pair: List.of('oldOne', 'oldTwo')
            })
          }),
          entries: List(),
          initialEntries: List.of('Trainspotting', '28 Days Later', 'Sunshine')
        }))
      ).to.equal(
        Map({
          client: Map({
            vote: Map({
              pair: List.of('Trainspotting', '28 Days Later')
            })
          }),
          entries: List.of('Sunshine'),
          initialEntries: List.of('Trainspotting', '28 Days Later', 'Sunshine')
        })
      );
    });

  });

});
