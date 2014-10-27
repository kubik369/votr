/** @jsx React.DOM */

(function () {


Votr.LogViewerContent = React.createClass({
  getInitialState: function () {
    return {
      http: true,
      table: true
    }
  },

  handleChange: function (e) {
    var update = {};
    update[e.target.name] = !e.target.checked;
    this.setState(update);
  },

  componentDidUpdate: function () {
    var div = this.getDOMNode().querySelector('.scroll');
    var time = _.last(Votr.logs).time;
    if (time != this.lastTime) {
      this.lastTime = time;
      div.scrollTop = div.scrollHeight;
    }
  },

  render: function () {
    var types = _.countBy(Votr.logs, 'log');

    return <div className="log-viewer">
      <div className="options">
        {this.props.closeButton}
        <ul className="list-inline">
          {_.sortBy(_.keys(types)).map((type) =>
            <li key={type}>
              <label>
                <input type="checkbox" name={type} checked={!this.state[type]}
                       onChange={this.handleChange} />
                {" " + type + " (" + types[type] + ")"}
              </label>
            </li>
          )}
        </ul>
      </div>

      <div className="scroll">
        <table>
          <tbody>
            {Votr.logs.map((entry, index) => !this.state[entry.log] &&
              <tr key={index}>
                <td className="text-right">{(entry.time - Votr.logs[0].time).toFixed(3)}</td>
                <td><code>{entry.log}</code></td>
                <td><code>{entry.message}</code></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>;
  }
});


Votr.LogViewer = React.createClass({
  toggle: function () {
    Votr.LocalSettings.set("logViewer",
      Votr.LocalSettings.get("logViewer") == "true" ? "false" : "true");
  },

  handleKeypress: function (e) {
    if (e.ctrlKey && e.altKey && e.shiftKey && e.which == 76) {   // Ctrl+Alt+Shift+L
      this.toggle();
      e.preventDefault();
    }
  },

  componentDidMount: function () {
    $(window).on('keydown.logViewer', this.handleKeypress);
  },

  componentWillUnmount: function () {
    $(window).off('keydown.logViewer');
  },

  render: function () {
    if (Votr.LocalSettings.get("logViewer") != "true") return null;

    var closeButton = <button type="button" className="close" onClick={this.toggle}>
      <span aria-hidden="true">&times;</span>
      <span className="sr-only">Close</span>
    </button>;

    return <Votr.LogViewerContent closeButton={closeButton} />;
  }
});


})();
