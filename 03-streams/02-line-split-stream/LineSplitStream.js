const stream = require("stream");
const os = require("os");

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
    let data = chunk.toString();
    if (this._lastLineData) data = this._lastLineData + data;

    let lines = data.split(os.EOL);
    this._lastLineData = lines.splice(lines.length - 1, 1)[0];
    lines.forEach(this.push.bind(this));
    callback();
  }

  _flush(callback) {
    if (this._lastLineData) this.push(this._lastLineData);
    this._lastLineData = null;
    callback();
  }
}

module.exports = LineSplitStream;
