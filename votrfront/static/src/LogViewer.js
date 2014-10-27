/** @jsx React.DOM */

(function () {


Votr.LogViewerContent = React.createClass({
  getInitialState: function () {
    return {
      benchmark: true,
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
        {this.props.modeButton}
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


Votr.LogViewerBenchmarkContent = React.createClass({
  computeBenchmarks: function () {
    var sums = {};
    var beginnings = {};

    function start(what, time) {
      beginnings[what] = time;
    }
    function end(what, time) {
      if (!beginnings[what]) return;
      if (!sums[what]) sums[what] = 0;
      sums[what] += time - beginnings[what];
      delete beginnings[what];
    }

    Votr.logs.forEach((entry) => {
      if (entry.log == 'benchmark' && entry.message.substr(0, 6) == 'Begin ') {
        start(entry.message.substr(6), entry.time);
      }
      if (entry.log == 'benchmark' && entry.message.substr(0, 4) == 'End ') {
        end(entry.message.substr(4), entry.time);
      }
      if (entry.log == 'rpc' && entry.message.substr(-8) == ' started') {
        start('total RPC time', entry.time);
      }
      if (entry.log == 'rpc' && entry.message.substr(-9) == ' finished') {
        end('total RPC time', entry.time);
      }
    });

    return _(sums).pairs().sortBy(1).reverse().valueOf();
  },

  render: function () {
    var benchmarks = this.computeBenchmarks();

    return <div className="log-viewer">
      <div className="options">
        {this.props.closeButton}
        {this.props.modeButton}
      </div>

      <div className="scroll">
        <table>
          <tbody>
            {benchmarks.map(([message, sum], index) =>
              <tr key={message}>
                <td className="text-right">{sum.toFixed(3)}</td>
                <td>{message}</td>
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
      Votr.LocalSettings.get("logViewer") ? "" : "log");
  },

  toggleMode: function () {
    Votr.LocalSettings.set("logViewer",
      Votr.LocalSettings.get("logViewer") == "log" ? "benchmark" : "log");
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
    var mode = Votr.LocalSettings.get("logViewer");

    var component =
      mode == 'log' ? Votr.LogViewerContent :
      mode == 'benchmark' ? Votr.LogViewerBenchmarkContent :
      null;

    if (!component) return null;

    var modeButton = <button type="button" className="pull-left" onClick={this.toggleMode}>{mode}</button>;

    var closeButton = <button type="button" className="close" onClick={this.toggle}>
      <span aria-hidden="true">&times;</span>
      <span className="sr-only">Close</span>
    </button>;

    return <component modeButton={modeButton} closeButton={closeButton} />;
  }
});


})();
