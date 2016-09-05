import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default React.createClass({
  mixins: [PureRenderMixin],
  getPair: function() {
    return this.props.pair || [];
  },
  hasChosen: function(entry) {
    return this.props.hasChosen === entry;
  },
  render: function() {
    return <div className="voting">
      {this.getPair().map(entry =>
        <button key={entry}
                onClick={() => this.props.vote(entry)}>
          <h1>{entry}</h1>
          {this.hasChosen(entry) ?
            <div className="label">Chosen</div> :
            null}
        </button>
      )}
    </div>;
  }
});